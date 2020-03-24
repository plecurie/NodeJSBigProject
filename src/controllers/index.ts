import { UsersController } from "./users/users";
import {ProducersController} from "./producers/producers";
import {ProductsController} from "./products/products";

const userController = new UsersController();
const producersController = new ProducersController();
const productsController = new ProductsController();

export {
    userController,
    producersController,
    productsController
};