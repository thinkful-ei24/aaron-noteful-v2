const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/', (req, res, next) => {
    knex('tags')
        .select('name')
        .orderBy('name')
        .returning('name')
        .then(results => res.json(results))
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


module.exports = router;