import { excelToJsonService } from "../excelToJson.service";
import { Categorie } from "../../models/Categorie";
import { CriteriaView } from "../../models/Criteria";

export class ProductService {
    private static instance: ProductService;
    private pathFile = './src/uploads/excel/';

    public static getInstance(): ProductService {
        if(!ProductService.instance) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    public loadCriteriaWithCategorie() {
        const categoriesXlsx: any = excelToJsonService.getInstance().processXlsxToJson(`${this.pathFile}categorie.xlsx`);
        const criteriaXlsx: any = excelToJsonService.getInstance().processXlsxToJson(`${this.pathFile}criteria.xlsx`);
        const categories: Array<Categorie> = [];

       categoriesXlsx.forEach(catx => categories.push({id: catx.id, name: catx.name, type: catx.type, criteria: []}));
       
       for (const cat of categories) {
           for (const critXl of criteriaXlsx) {
               if (cat.id == critXl.id_category) {
                   cat.criteria.push({id_cat: critXl.id_category, name: critXl.name, values: null})
               }
           }
       }
       console.log(categories);
    }
}