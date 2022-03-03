const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

/**
 * Get all orders
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getAll = (req, res, next) => {
  Order.find().select('product quantity _id').populate('product', 'name').exec().then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/order/' + doc._id
            }
          };
        })
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Create order
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.create = (req, res, next) => {
  Product.findById(req.body.productId).then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });

      return order.save();
    }).then(result => {
      res.status(201).json({
        message: 'Order created successfully',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/order/' + result._id
        }
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Get single order
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getSingle = (req, res, next) => {
  Order.findById(req.params.orderId).populate('product').exec().then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/order'
        }
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

/**
 * Delete order
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.delete = (req, res, next) => {
  Order.remove({ _id: req.params.orderId }).exec().then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/order',
          body: { productId: 'ID', quantity: 'Number' }
        }
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
