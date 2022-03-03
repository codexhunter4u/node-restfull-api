const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/productController');
const upload = require('../lib/uploadDocuments');

router.get('/getAll', checkAuth, ProductsController.getAll);

router.post('/create', checkAuth, upload.single('productImage'), ProductsController.create);

router.get('/getSingle/:productId', checkAuth, ProductsController.getSingle);

router.patch('/update/:productId', checkAuth, ProductsController.update);

router.delete('/delete/:productId', checkAuth, ProductsController.delete);

module.exports = router;
