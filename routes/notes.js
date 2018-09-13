'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');


router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderID = req.query.folderId;
  const tagID = req.query.tagId;


  knex('notes')
    .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
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
    .modify(results => {
      if (tagID) {
        results.where('tags.id', tagID);
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
    .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .where('notes.id', someID)
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
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
  const { title, content, folder_id, tagId } = req.body;
  console.log(req.body);

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateObj = {
    title,
    content,
    folder_id,
    tag_id: tagId
  };

  knex('notes')
    .where({ id: updateID })
    .update(updateObj)
    .returning('id')
    .then(() => {
      return knex('notes')
        .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
        .where('notes.id', updateID)
    })
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
    })
    .catch(err => new (err));
});


router.post('/', (req, res, next) => {
  const { title, content, folderId, tags } = req.body;
  console.log(req.body);
  const newItem = { 
    title, 
    content,
    folder_id: folderId,
    tag_id: tags[0]
  };
  console.log(newItem);
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
        .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
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
