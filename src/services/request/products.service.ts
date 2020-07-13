import {excelToJsonService} from "../excelToJson.service";
import {CriteriaFamily, Family} from "../../models/Family";
import {client, index, type} from "../../utils/elasticsearch";
import {Criteria} from '../../models/Criteria';
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
            const findCriteria = criterias.find(c => c.name.toLowerCase() == t.fieldName.toLowerCase() && c.value == 'Yes');
            if (findCriteria) {
                const regex = new RegExp(wordToReplace, 'g');
                return t.name.replace(/  +/g, ' ').replace(regex, '').trim();
            }
            return findCriteria
        }).filter(c => c !== undefined);
    }

    public async mapProductList(products) {
        const criteriaFamilies = this.loadCriteriaFamily();
        const thematics: Array<Thematic> = this.loadSimpleXlsx("thematics");
        const employsExclusion: Array<EmployExclusion> = this.loadSimpleXlsx("employs_exclusion");
        const list_products = [];

        for (let i = 0; i < products.length; i++) {
            const criterias = products[i].criteria;
            const criteria: Criteria = criterias.map(criteria => {
                const criteriaFamily = criteriaFamilies.find(family => family.criteriaName.toLowerCase() == criteria.name.toLowerCase());
                return {
                    name: criteria.name,
                    value: typeof criteria.value == 'string' ? this.classify(criteria.value) : criteria.value,
                    familyName: criteriaFamily ? criteriaFamily.familyName : 'Other Category'
                }
            });
            products[i]['thematics'] = this.findMatchesResult(criterias, thematics, "sustainableInvestment");
            products[i]['employsExclusion'] = this.findMatchesResult(criterias, employsExclusion, "employsExclusions");
            products[i].criteria = criteria;
            products[i]['criteriaCategorieAverage'] = this.valuesComputed(products[i].criteria);

            list_products.push({index: {_index: index, _type: type}});
            list_products.push(products[i]);
        }
        return list_products;
    }

    public computedRates(values: Array<number>, esg: number) {
        if (values.length > 0) {
            const reducedValues = values.map(item => 1 / 3 * (100 - item))
                .reduce((item, current) => item + current);
            return (reducedValues ? (reducedValues * esg) / 100 + 1 : 0);
        }
        return 0
    }

    public valuesComputed(criterias: Array<any>) {
        const values = [];
        let esg = 0;
        criterias.forEach(item => {
            if (rates.includes(item.name) && !item.name.match(rates[2])) {
                values.push(item ? item.value : 0)
            } else if (item.name.match(rates[2])) {
                esg = item ? item.value : 0
            }
        });
        const computedValue = this.computedRates(values, esg);
        return computedValue != 0 ? parseFloat((computedValue / 10).toFixed(2)) : computedValue;
    }

    public async findProducts(isinCodes: Array<string>) {
        const codesToMatches = isinCodes.map(isincode => ({match: {isincode}}));
        const productsCodesToMatches = isinCodes.map(isincode => ({match: {"products.isincode": isincode}}));
        const {body: {hits: {hits}}} = await client.search({
            index: index,
            type: type,
            body: {
                query: {
                    bool: {
                        should: [
                            ...codesToMatches,
                            {
                                nested: {
                                    path: "products",
                                    query: {
                                        bool: {
                                            should: productsCodesToMatches
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        });

        if (hits.length === 0) throw  "No products found";
        const [contracts, products] = hits.reduce(([contracts, product], hit) => {
            const {contract_name: name, euro_fees, uc_fees, type, products} = hit._source;
            if (type == 'contract') contracts.push({name, euro_fees, uc_fees, products});
            else if (type == 'product') product.push(hit);
            return [contracts, product];
        }, [[], []]);
        if (products.length === 0) throw "No products returned";
        products.forEach(product => {
            const isinCode = product._source.isincode;
            product._source.contracts = contracts.filter(({products}) =>
                products.some(({isincode}) => isincode == isinCode)
            );
        });
        return products;
    }

    public async findProductsByCriterias(isinCodes: Array<string>) {
        const codesToMatches = isinCodes.map(isincode => ({match: {isincode}}));
        const productsCodesToMatches = isinCodes.map(isincode => ({match: {"products.isincode": isincode}}));
        const {body: {hits: {hits}}} = await client.search({
            index: index,
            type: type,
            body: {
                query: {
                    bool: {
                        should: [
                            ...codesToMatches,
                            {
                                nested: {
                                    path: "products",
                                    query: {
                                        bool: {
                                            should: productsCodesToMatches
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        });

        if (hits.length === 0) throw  "No products found";
        const [contracts, products] = hits.reduce(([contracts, product], hit) => {
            const {contract_name: name, euro_fees, uc_fees, type, products} = hit._source;
            if (type == 'contract') contracts.push({name, euro_fees, uc_fees, products});
            else if (type == 'product') product.push(hit);
            return [contracts, product];
        }, [[], []]);
        if (products.length === 0) throw "No products returned";
        products.forEach(product => {
            const isinCode = product._source.isincode;
            product._source.contracts = contracts.filter(({products}) =>
                products.some(({isincode}) => isincode == isinCode)
            );
        });
        return products;
    }


    protected classify(value: any): number {
        switch (value.toLowerCase()) {
            case 'low':
            case'low risk':
            case '1':
            case 'yes':
                return 1;
            case 'below average':
            case 'medium risk':
                return 2;
            case 'average':
            case 'high risk':
                return 3;
            case 'above average':
                return 4;
            case 'high':
                return 5;
            case '0':
            case 'no':
                return 0;
            default:
                return +value;
        }
    }

}
