'use strict';

const knex = require('../knex');

// // let searchTerm = 'gaga';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

// knex('notes')
//   .select()
//   .then(result => console.log(result));

// let someID = 10;
// knex('notes')
//   .select()
//   .where({id: `${someID}`})
//   .then(results => console.log(results[0]));


// let updateID = 5;
// let updateObj = {
//   title: 'New Title',
//   content: 'Something different than before'
// };

// knex('notes')
//   .where({id: `${updateID}`})
//   .update(updateObj)
//   .returning(['title', 'content'])
//   .then(results => console.log(results[0]));


// let deleteID = 7;
// knex('notes')
//   .where({id: `${deleteID}`})
//   .returning('title')
//   .del()
//   .then(results => console.log(results));

