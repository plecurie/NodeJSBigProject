import { UsersController } from "./users/users";
import { ProducersController } from "./producers/producers";
import { ProductsController } from "./products/products";
import { PortfolioController } from "./portfolio/portfolio";
import { ProfileController } from "./profile/profile";
import { AuthController } from './authentication/auth';
import { OcrController } from './ocr/ocr';

const userController = new UsersController();
const producersController = new ProducersController();
const productsController = new ProductsController();
const portfolioController = new PortfolioController();
const profileController = new ProfileController();
const authController = new AuthController();
const ocrController = new OcrController();


export {
    userController,
    producersController,
    productsController,
    portfolioController,
    profileController,
    authController,
    ocrController
};