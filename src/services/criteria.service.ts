import {excelToJsonService} from "./excelToJson.service";
import {CriteriaFamily, Family} from "../models/Family";
import {client, index, type} from "../utils/elasticsearch";
import {CriteriaView} from '../models/Criteria';
import {IncomingMessage, ServerResponse} from "http";
import {productsController} from "../controllers";

export class CriteriaService {
    private static instance: CriteriaService;
    private pathFile = './src/uploads/excel/';

    public static getInstance(): CriteriaService {
        if(!CriteriaService.instance) {
            CriteriaService.instance = new CriteriaService();
        }
        return CriteriaService.instance;
    }

    public async mapProductCriteria() {
        const criteriaFamilies = this.loadCriteriaFamily();
        const products = await this.loadCriteria();

        for (let i = 0; i < products.length; i++) {
            const criteriaView: CriteriaView = products[i]._source.criteria.map(criteria => {
                const criteriaFamily = criteriaFamilies.find(data => data.criteriaName.toLowerCase() == criteria.name.toLowerCase());
                return {
                    name: criteria.name,
                    value: typeof criteria.value == 'string' ? CriteriaService.classify(criteria.value) : criteria.value,
                    familyName: criteriaFamily ? criteriaFamily.familyName : 'Other Category'
                }
            });
            console.log(criteriaView);
            products[i]._source.criteria = criteriaView;
        }
        return products;
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
                    const criteria_name = criteria.name.replace(/\s/g,'').replace(/[^a-zA-Z ]/g, "");
                    criteriaFamilies.push({familyName: family.name, criteriaName: criteria_name})
                }
            }
        }
        return criteriaFamilies;
    }

    public async loadCriteria() {

        try {

            const products = await client.search({
                index: index, type: type, body : { query: { match: { type: "product" } } }
            }).then(data => data.body.hits.hits);

            for (let i = 0; i < products.length; i++)
                products[i]._source.criteria = Object.keys(products[i]._source.criteria).map(name => {
                    return {name: name, value: products[i]._source.criteria[name], familyName: ""} as CriteriaView;
                });

            return products;

        } catch(err) {
            console.error(err.meta.body.error);
        }

    }

    private static classify(value: any) {
            switch(value.toLowerCase()) {
                case 'low': return 1;
                case 'below average': return 2;
                case 'average': return 3;
                case 'above average': return 4;
                case 'high': return 5;
                case 'low risk': return 1;
                case 'medium risk': return 2;
                case 'high risk': return 3;
                case 'yes': return 1;
                case 'no': return 0;
        }
    }
}