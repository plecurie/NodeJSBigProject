import { excelToJsonService } from "../excelToJson.service";
import { Categorie, CategorieWithItsCriteria } from "../../models/Categorie";
import { client } from "../../utils/elasticsearch";
import { CriteriaView } from '../../models/Criteria';

export class ProductService {
    private static instance: ProductService;
    private pathFile = './src/uploads/excel/';
    private index = 'scala';
    private types = 'database';

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
        const categorieWithCriteria: Array<CategorieWithItsCriteria> = [];
       
        categoriesXlsx.forEach(catx => categories.push({id: catx.id, name: catx.name, type: catx.type}));
       
       for (const cat of categories) {
           for (const critXl of criteriaXlsx) {
               if (cat.id == critXl.id_category) {
                   const newCatName = critXl.name.replace(/\s/g,'').replace(/[^a-zA-Z ]/g, "");
                   categorieWithCriteria.push({cateogryName: cat.name, criteriaName: newCatName})
               }
           }
       }
       return categorieWithCriteria;
    }

    // public loadThematics() {
    //     const categoriesXlsx: any = excelToJsonService.getInstance().processXlsxToJson(`${this.pathFile}categorie.xlsx`);
    // }
    public async associateDataDbWithCategorie() {
        const loadCriteriaWithCategorie = this.loadCriteriaWithCategorie();
        const products = await this.allProduct();
        
        for (let i = 0; i < products.length; i++) {
            const categoryProduct: CriteriaView = products[i]._source.criteria.map(c => {
                const lcwc = loadCriteriaWithCategorie.find(d => d.criteriaName.toLowerCase() == c.name.toLowerCase());
                return {
                    name: c.name, 
                    value: typeof c.value == 'string' ? this.transformStringToInt(c.value) : c.value, 
                    categoryCriteria: lcwc ? lcwc.cateogryName : 'Other Category'
                }
            });
            console.log(categoryProduct)
            products[i]._source.criteria = categoryProduct;
        }
        return products;
    }

    public async allProduct() {
        try {
            const productsBdd = await client.search({
                index: this.index,
                type: this.types,
                //scroll: "5m",
                size: 100
            }).then(d => d.body.hits.hits);

            for (let i = 0; i < productsBdd.length; i++) {
                const criteriaView = Object.keys(productsBdd[i]._source.criteria).map(c => {
                    return {name: c, value: productsBdd[i]._source.criteria[c], categoryCriteria: ""} as CriteriaView;
                })
                productsBdd[i]._source.criteria = criteriaView;
            }

            return productsBdd;
        } catch(err) {
            console.error(err.meta.body.error);
        }
    }

    private transformStringToInt(value: any) {
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
};