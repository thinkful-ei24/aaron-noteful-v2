'use strict';

const express = require('express');

const router = express.Router();

// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);
const knex = require('../knex');


router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;

  knex
  .select('notes.id', 'title', 'content')
  .from('notes')
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

  // notes.filter(searchTerm)
  //   .then(list => {
  //     res.json(list);
  //   })
  //   .catch(err => {
  //     next(err);
  //   });
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
  .then(results => res.json(results[0]));

});


router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .insert(newItem)
    .returning(['title', 'id'])
    .then(results => {
      if(results) {
      res.location(`https://${req.headers.host}/notes/${results.id}`).status(201).json(results);
      }
    })
    .catch(err => {
      next(err);
    });



  // notes.create(newItem)
  //   .then(item => {
  //     if (item) {
  //       res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
  //     }
  //   })
  //   .catch(err => {
  //     next(err);
  //   });
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
