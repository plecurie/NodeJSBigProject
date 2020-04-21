import { UsersController } from "./users/users";
import { ProducersController } from "./producers/producers";
import { ProductsController } from "./products/products";
import { PortfolioController } from "./portfolio/portfolio";
import { ProfileController } from "./profile/profile";

const userController = new UsersController();
const producersController = new ProducersController();
const productsController = new ProductsController();
const portfolioController = new PortfolioController();
const profileController = new ProfileController();

export {
    userController,
    producersController,
    productsController,
    portfolioController,
    profileController
};