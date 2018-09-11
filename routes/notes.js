'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');


router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;

  knex('notes')
    .select('notes.id', 'title', 'content')
    .modify(queryBuilder => {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});


router.get('/:id', (req, res, next) => {
  const someID = req.params.id;
    
  knex('notes')
    .select()
    .where({id: `${someID}`})
    .then(results => res.json(results[0]))
    .catch(err => {
      next(err)
    });

});


router.put('/:id', (req, res, next) => {
  const updateID = req.params.id;

  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .where({id: `${updateID}`})
    .update(updateObj)
    .returning(['title', 'content'])
    .then(results => res.json(results[0]))
    .catch(err => new(err));
});


router.post('/', (req, res, next) => {
  const { title, content } = req.body;
  const newItem = { title, content };

  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .insert(newItem)
    .returning(['title', 'id'])
    .then(results => {
      console.log(results[0]);
      if(results) {
      res.location(`https://${req.headers.host}/notes/${results[0].id}`).status(201).json(results[0]);
      }
    })
    .catch(err => {
      next(err);
    });
});


router.delete('/:id', (req, res, next) => {
  const deleteID = req.params.id;

  knex('notes')
    .where({id: `${deleteID}`})
    .returning('title')
    .del()
    .then(results => res.json(results))
    .catch(err => {
      next(err);
    });
});

module.exports = router;
