const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/', (req, res, next) => {
    knex.select('id', 'name')
        .from('folders')
        .orderBy('id')
        .returning(['id', 'name'])
        .then(results => res.json(results))
        .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
    knex.select('id', 'name')
        .from('folders')
        .where({id: req.params.id})
        .returning(['id', 'name'])
        .then(results => res.json(results[0]))
        .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
    const updateID = req.params.id;
    const updateObj = {};
    const updateableFields = ['name'];
  
    updateableFields.forEach(field => {
      if (field in req.body) {
        updateObj[field] = req.body[field];
      }
    });
    console.log(updateObj);
    if (!updateObj.name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
  
    knex
        .from('folders')
        .where('id', updateID)
        .update(updateObj)
        .returning(['name', 'id'])
        .then(results => res.json(results))
        .catch(err => next(err));
});

router.post('/', (req, res, next) => {
    const { name } = req.body;
    const newItem = { name };

    if (!newItem.name) {
        const err = new Error('Missing `title` in request body');
        err.status = 400;
        return next(err);
    }

    knex('folders')
        .insert(newItem)
        .returning(['name', 'id'])
        .then(results => {
            if (results) {
                res.location(`https://${req.headers.host}/folders/${results[0].id}`).status(201).json(results[0]);
            }
        })
        .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
    const deleteID = req.params.id;

    knex('folders')
        .where({id: deleteID})
        .returning(['name', 'id'])
        .del()
        .then(results => res.json(results))
        .catch(err => next(err));
});

module.exports = router;