import {excelToJsonService} from "../excelToJson.service";
import {CriteriaFamily, Family} from "../../models/Family";
import {client, index, type} from "../../utils/elasticsearch";
import {CriteriaView} from '../../models/Criteria';
import {EmployExclusion, Thematic} from '../../models/OtherModel'

const rates = ['portfolioSocialScore', 'portfolioGovernanceScore', 'percentOfAUMCoveredESG', 'portfolioEnvironmentalScore'];

export class ProductsService {
    private static instance: ProductsService;
    private pathFile = './src/uploads/excel/';

    public static getInstance(): ProductsService {
        if (!ProductsService.instance) {
            ProductsService.instance = new ProductsService();
        }
        return ProductsService.instance;
    }

    public loadCriteriaFamily() {

        const families_xlsx: any = excelToJsonService.getInstance().processXlsxToJson(`${this.pathFile}families.xlsx`);
        const criteria_xlsx: any = excelToJsonService.getInstance().processXlsxToJson(`${this.pathFile}criteria.xlsx`);
        const families: Array<Family> = [];
        const criteriaFamilies: Array<CriteriaFamily> = [];

        families_xlsx.forEach(family => families.push({id: family.id, name: family.name, type: family.type}));

        for (const family of families) {
            for (const criteria of criteria_xlsx) {
                if (family.id == criteria.id_category) {
                    const criteria_name = criteria.name.replace(/\s/g, '').replace(/[^a-zA-Z ]/g, "");
                    criteriaFamilies.push({familyName: family.name, criteriaName: criteria_name})
                }
            }
        }
        return criteriaFamilies;
    }

    public loadSimpleXlsx(xlsxName: string) {
        const thematicsXlsx = excelToJsonService.getInstance().processXlsxToJson(`${this.pathFile}${xlsxName}.xlsx`) as Array<Thematic> | Array<EmployExclusion>;
        return thematicsXlsx.map(item => {
            item.name = item.name.replace(/[^a-zA-Z ]/g, "");
            item.fieldName = item.name.replace(/\s/g, '').replace(/[^a-zA-Z ]/g, "");
            return item
        });
    }

    public findMatchesResult(criterias: any[], array: Thematic[] | EmployExclusion[], wordToReplace: string) {

        return array.map(t => {
            const findCriteria = criterias.find(c => {
                return c.name.toLowerCase() == t.fieldName.toLowerCase() && c.value == 'Yes'
            });
            if (findCriteria) {
                const regex = new RegExp(wordToReplace, 'g');
                return t.name.replace(/  +/g, ' ').replace(regex, '').trim();
            }
            return findCriteria
        }).filter(c => c !== undefined);
    }

    public async mapProductCriteria(data) {
        const criteriaFamilies = this.loadCriteriaFamily();
        const thematics: Array<Thematic> = this.loadSimpleXlsx("thematics");
        const employsExclusion: Array<EmployExclusion> = this.loadSimpleXlsx("employs_exclusion");

        if (!data.products) {
            data.products = await this.findAll(data.isincodes);
        }
        data.products = await this.loadCriteria(data.products);
        for (let i = 0; i < data.products.length; i++) {
            const criterias = data.products[i]._source.criteria;
            const criteriaView: CriteriaView = criterias.map(criteria => {
                const criteriaFamily = criteriaFamilies.find(family => family.criteriaName.toLowerCase() == criteria.name.toLowerCase());
                return {
                    name: criteria.name,
                    value: typeof criteria.value == 'string' ? this.classify(criteria.value) : criteria.value,
                    familyName: criteriaFamily ? criteriaFamily.familyName : 'Other Category'
                }
            });
            data.products[i]._source['thematics'] = this.findMatchesResult(criterias, thematics, "sustainableInvestment");
            data.products[i]._source['employsExclusion'] = this.findMatchesResult(criterias, employsExclusion, "employsExclusions");
            data.products[i]._source.criteria = criteriaView;
        }

        return data.products;
    }

    public loadCriteria(products) {
        for (let i = 0; i < products.length; i++) {
            products[i]._source.criteria = Object.keys(products[i]._source.criteria).map(name => {
                return {name: name, value: products[i]._source.criteria[name], familyName: ""} as CriteriaView;
            });
        }
        return products;
    }

    public async findAll(isincodes: any) {
        try {
            return await client.search({
                index: index, type: type, 
                size: 10_000, 
                body: {
                    query: {
                        bool: {
                            should: isincodes
                        }
                    }
                }
            }).then(data => data.body.hits.hits);

        } catch (err) {
            console.error(err.meta.body.error);
        }

    }

    protected classify(value: any): number {
        switch (value.toLowerCase()) {
            case 'low':
                return 1;
            case 'below average':
                return 2;
            case 'average':
                return 3;
            case 'above average':
                return 4;
            case 'high':
                return 5;
            case 'low risk':
                return 1;
            case 'medium risk':
                return 2;
            case 'high risk':
                return 3;
            case '1':
                return 1;
            case '0':
                return 0;
            default:
                return parseInt(value, 10)
        }
    }

    public computedRates(values: Array<number>, esg: number) {
        if (values.length > 0) {
            const reducedValues = values.map(item => 1/3*(100 - item))
            .reduce((item, current) => item + current);
            return (reducedValues ? (reducedValues * esg) / 100 + 1 : 0);
        }
        return 0
    }

    public valuesComputed(criterias: Array<any>) {
        const values = []
        let esg = 0;
        criterias.forEach(item => {
            if(rates.includes(item.name) && !item.name.match(rates[2])) {
                values.push(item ? item.value : 0)
            } else if (item.name.match(rates[2])) {
                esg = item ? item.value : 0
            }
        })
        const computedValue = this.computedRates(values, esg);
        return computedValue != 0 ? parseFloat((computedValue / 10).toFixed(2)) : computedValue;
    }

}