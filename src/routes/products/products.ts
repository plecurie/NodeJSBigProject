import * as express from 'express';
import {productsController} from '../../controllers'

export const router = express.Router({
    strict: true
});

router.post('/_updatedb', productsController.update_db);

router.get('/suggest/:input', productsController.suggest);

router.post('/', productsController.findAll);

router.get('/:isincode', productsController.findOne);

router.post('/list', productsController.findProductsList);

router.post('/filteredList', productsController.getProductsByCriteria);

router.post('/search', productsController.search);
