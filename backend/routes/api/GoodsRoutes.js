const { request } = require('express');
const express = require('express');
const GoodsModel = require('../../models/GoodsModel');
const middleware = require('../../middleware/AuthMiddleware');

const router = express.Router();

// @route GET api/goods
// @desc Get all goods
// @access Public
router.get('/', (req, res) => {
  GoodsModel
    .find()
    .collation({ locale: "en" })
    .sort({ name: 1 })
    .then(goods => {
      response = {
        error: false,
        message: 'list',
        data: goods
      }
      res.json(response);
      console.log('All Goods retrieved.');
    })
    .catch(err => {
      response = {
        error: true,
        message: err,
        data: ''
      }
      res.json(response);
      console.log(`GoodsModel GET Error in file GoodsRoutes.js --> ${err}`)
    }
    );
});

// @route POST api/goods
// @desc Add a new Good
// @access Private
router.post('/', middleware, (req, res) => {
  const newGood = new GoodsModel({
    name: req.body.name,
    price: req.body.price
  });
  newGood
    .save()
    .then(goodItem => {
      response = {
        error: false,
        message: 'add',
        data: goodItem
      }
      res.json(response);
      console.log(`New Good added => ${goodItem}`);
    })
    .catch(err => {
      response = {
        error: true,
        message: err,
        data: ''
      }
      res.json(response);
      console.log(`GoodsModel POST Error in file GoodsRoutes.js --> ${err}`)
    });
});

// @route PUT api/goods/:id
// @desc Update a Good
// @access Private
router.put('/:id', middleware, (req, res) => {
  let newGood = new GoodsModel();
  newGood._id = req.params.id;
  newGood.name = req.body.name;
  newGood.price = req.body.price;
  newGood.date = Date.now();
  GoodsModel
    .findByIdAndUpdate(
      { _id: req.params.id },
      newGood,
      { new: true })
    .then(goodItem => {
      response = {
        error: false,
        message: 'update',
        data: goodItem
      }
      res.json(response);
      console.log(`Updated Good Item => ${goodItem}`);
    })
    .catch(err => {
      response = {
        error: true,
        message: err,
        data: ''
      }
      res.json(response);
      console.log(`GoodsModel PUT Error in file GoodsRoutes.js --> ${err}`)
    });
});

// @route DELETE api/goods/:id
// @desc Delete a Good
// @access Private
router.delete('/:id', middleware, (req, res) => {
  GoodsModel
    .findOneAndDelete({ _id: req.params.id })
    .then(goodItem => {
      response = {
        error: false,
        message: 'delete',
        data: ''
      }
      res.json(response);
      console.log('Good Item deleted.');
    })
    .catch(err => {
      response = {
        error: true,
        message: err,
        data: ''
      }
      res.json(response);
      console.log(`GoodsModel DELETE Error in file GoodsRoutes.js --> ${err}`)
    });
});

module.exports = router;