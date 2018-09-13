'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');


router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderID = req.query.folderId;

  knex('notes')
    .select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .modify(results => {
      if (searchTerm) {
        results.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(results => {
      if (folderID) {
        results.where('folder_id', folderID);
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
    .select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folderName')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where('notes.id', someID)
    .returning(['title', 'id'])
    .then(results => {
      if (results.length > 0) {
        res.json(results[0]);
      }
      else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });

});


router.put('/:id', (req, res, next) => {

  const updateID = req.params.id;
  const { title, content, folderId} = req.body;

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateObj = {
    title,
    content,
    folder_id: (folderId) ? folderId : null
  };

  knex('notes')
    .where({ id: updateID })
    .update(updateObj)
    .returning('id')
    .then(() => {
      return knex('notes')
        .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', updateID)
    })
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
    })
    .catch(err => new (err));
});


router.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body;
  const newItem = { 
    title, 
    content,
    folder_id: (folderId) ? folderId : null
  };
  let noteId;

  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .insert(newItem)
    .returning('id')
    .then(([id]) => {
      noteId = id;
      return knex('notes')
        .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .where('notes.id', noteId);
      })
    .then(results => {
      console.log(results[0]);
      if (results) {
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
    .where({ id: `${deleteID}` })
    .returning('title')
    .del()
    .then(() => res.status(204).end())
    .catch(err => {
      next(err);
    });
});

module.exports = router;
