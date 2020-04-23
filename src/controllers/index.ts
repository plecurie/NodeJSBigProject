import { UsersController } from "./users/users";
import {ProducersController} from "./producers/producers";
import {ProductsController} from "./products/products";
import { AuthController } from './authentification/auth';
import { OcrController } from './ocr/ocr';

const userController = new UsersController();
const producersController = new ProducersController();
const productsController = new ProductsController();
const authController = new AuthController();
const ocrController = new OcrController();


export {
    userController,
    producersController,
    productsController,
    authController,
    ocrController
};