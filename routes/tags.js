const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/', (req, res, next) => {
    knex('tags')
        .select('name', 'id')
        .orderBy('id')
        .returning(['id', 'name'])
        .then(results => res.json(results))
        .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
    const someId = req.params.id;
    knex('tags')
        .select('name', 'id')
        .where({id: someId})
        .returning('name')
        .then(results => res.json(results[0]))
        .catch(err => next(err));
});

router.post('/', (req, res, next) => { 
    const { name } = req.body;
    if (!name) {
      const err = new Error('Missing `name` in request body');
      err.status = 400;
      return next(err);
    }
    const newItem = { name };
    knex.insert(newItem)
      .into('tags')
      .returning(['id', 'name'])
      .then((results) => {
        const result = results[0];
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      })
      .catch(err => next(err));
  });

router.put('/:id', (req, res, next) => {
    const updateId = req.params.id;
    const { name } = req.body;
    if (!name) {
        const err = new Error('Missing updated `name` in request body');
        err.status = 400;
        return next(err);
    }
    const updateObj = { name };
    knex('tags')
        .select('name', 'id')
        .where({id: updateId})
        .update(updateObj)
        .returning('id')
        .then(results => res.json(results))
        .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
    const deleteId = req.params.id;
    knex('tags')
        .select('id')
        .where({id: deleteId})
        .del()
        .then(() => res.status(204).end())
        .catch(err => next(err));
});


module.exports = router;