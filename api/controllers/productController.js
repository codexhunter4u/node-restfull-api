const mongoose = require('mongoose');
const Product = require('../models/productModel');

/**
 * Get all prodcut list
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getAll = (req, res, next) => {
  Product.find().select('name price _id productImage').exec().then(results => {
      const response = {
        count: results.length,
        products: results.map(result => {
          return {
            name: result.name,
            price: result.price,
            productImage: result.productImage,
            _id: result._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/product/getSingle/' + result._id
            }
          };
        })
      };
      res.status(200).json(response);
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Create product
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.create = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save().then(result => {
      res.status(201).json({
        message: 'Product created successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/product/getSingle/' + result._id
          }
        }
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Get single product by Id.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getSingle = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id).select('name price _id productImage').exec().then(result => {
      if (result) {
        res.status(200).json({
          product: result,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/product'
          }
        });
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' });
      }
    }).catch(err => {
      res.status(500).json({ error: err });
    });
};

/**
 * Update the product
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.update = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps }).exec().then(result => {
      res.status(200).json({
        message: 'Product updated successfully',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/product/' + id
        }
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Delete product
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.delete = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id }).exec().then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/product',
          body: { name: 'String', price: 'Number' }
        }
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
