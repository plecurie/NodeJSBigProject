import {UsersController} from "./users/users";
import {ProductsController} from "./products/products";
import {PortfolioController} from "./portfolio/portfolio";
import {ProfileController} from "./profile/profile";
import {AuthController} from './authentication/auth';
import {OcrController} from './ocr/ocr';

const userController = new UsersController();
const productsController = new ProductsController();
const portfolioController = new PortfolioController();
const profileController = new ProfileController();
const authController = new AuthController();
const ocrController = new OcrController();


export {
    userController,
    productsController,
    portfolioController,
    profileController,
    authController,
    ocrController
};