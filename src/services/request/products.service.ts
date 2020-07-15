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

    public async getProductsByCriteria(allExclusions) {
        const nestedCriterias = allExclusions.map(({familyName, name, value}) => ({
            nested: {
                path: "criteria",
                query: {
                    bool: {
                        must: [
                            { match : { "criteria.familyName" : familyName } },
                            { match : { "criteria.name" : name } },
                        ],
                        must_not: [
                            { match : { "criteria.value" : value } }
                        ]
                    }
                }
            }
        }));
        const {body: {hits : {hits}}} = await client.search({
            size: 10000,
            index: index,
            type: type,
            body: {
                query: {
                    bool: {
                        must: nestedCriterias
                    }
                },
            }
        });
        const products = hits.reduce((product, hit) => {
            if (hit._source.type == 'product') product.push(hit);
            return product;
        }, []);
        return products;
    }

    // Handle scoring for question Q3A1 when response is A
    // On prend celui qui a la meilleure note dans chaque catégorie.
    // Les résultats seront classés par ordre alphabétique du nom du fonds.
    public handleScoringProductsByCategories(products, {envPercentage, societyPercentage, gouvernancePercentage}) {
        const categories = {};

        products.forEach(({_source: { criteria, category, isincode, product_name }}) => {
            if(category) {
                const portfolioEnvironmentalScore = criteria.find(({name}) => name === 'portfolioEnvironmentalScore').value || 0;
                const portfolioSocialScore = criteria.find(({name}) => name === 'portfolioSocialScore').value || 0;
                const percentOfAUMCoveredESG = criteria.find(({name}) => name === 'percentOfAUMCoveredESG').value || 0;
                const note = ((envPercentage * (100 - portfolioEnvironmentalScore) + societyPercentage * (100 - portfolioSocialScore ) + gouvernancePercentage * (100 - portfolioEnvironmentalScore)) * percentOfAUMCoveredESG / 100 + 1);
                if(!categories[category]) return categories[category] = { isincode, note, product_name };
                else if(note > categories[category].note) return categories[category] = { isincode, note, product_name };
            }
        });
        return Object.values(categories)
            .sort(({product_name: a}, {product_name: b}) => a.localeCompare(b))
            .map(({isincode}) => isincode)
    }

    // Handle scoring for question Q3A1 when response is B
    // On applique simplement la formule sur tous les fonds, et on les classe par note à la fin
    public handleScoringProductsOnUniverse(products, {envPercentage, societyPercentage, gouvernancePercentage}) {
        const categories = [];
        products.forEach(({_source: { criteria, isincode }}) => {
            const portfolioEnvironmentalScore = criteria.find(({name}) => name === 'portfolioEnvironmentalScore').value || 0;
            const portfolioSocialScore = criteria.find(({name}) => name === 'portfolioSocialScore').value || 0;
            const percentOfAUMCoveredESG = criteria.find(({name}) => name === 'percentOfAUMCoveredESG').value || 0;
            const note = (envPercentage * (100-portfolioEnvironmentalScore)+societyPercentage*(100-portfolioSocialScore)+gouvernancePercentage*(100-portfolioEnvironmentalScore))*percentOfAUMCoveredESG/100 + 1;
            categories.push({ isincode, note });
        });
        const ordonnedProducts = categories.sort(({note: a}, {note: b}) => b - a);
        return ordonnedProducts.map(({isincode}) => isincode);
    }

    // Handle scoring for question Q3A1 when response is C
    //On applique la formule sur tous les fonds
    //et on affichera uniquement ceux qui obtiennent un résultat supérieur à 0
    public handleScoringProductsOnProgression(products, percentages) {
        const funds = [];
        products.forEach(({_source: { criteria, isincode }}) => {
            const portfolioSustainabilityScore = criteria.find(({name}) => name === 'portfolioSustainabilityScore').value || 0;
            const historicalSustainabilityScore = criteria.find(({name}) => name === 'historicalSustainabilityAbsoluteRankInGlobalCategory').value || 0;
            const percentOfAUMCoveredESG = criteria.find(({name}) => name === 'percentOfAUMCoveredESG').value || 0;
            const note = ((100-portfolioSustainabilityScore)*percentOfAUMCoveredESG + 1)/(100-historicalSustainabilityScore)*percentOfAUMCoveredESG/100 + 1;
            funds.push({ isincode, note });
        });
        return funds.filter(({note}) => note > 0).map(({isincode}) => isincode);
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
