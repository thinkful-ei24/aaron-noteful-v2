SELECT CURRENT_DATE;

-- psql -U dev -f ./db/noteful-app.sql -d noteful-app

DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS folders;


CREATE TABLE folders (
  id serial PRIMARY KEY,
  name text NOT NULL
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;

CREATE TABLE tags(
    id serial PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE notes(
    id serial PRIMARY KEY,
    title text NOT NULL,
    content text, 
    created timestamp DEFAULT current_timestamp,
    folder_id int REFERENCES folders(id) ON DELETE SET NULL,
    tag_id int REFERENCES tags(id) ON DELETE SET NULL
);

CREATE TABLE notes_tags(
    note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);


INSERT INTO folders (name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');


INSERT INTO tags (name) VALUES
  ('Hello'),
  ('Goodbye'),
  ('Another'),
  ('Last Tag');



INSERT INTO notes (title, content, folder_id) VALUES 
  (
    '5 life lessons learned from cats',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    100
  ),
  (
    'What the government doesn''t want you to know about cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.',
    101
  ),
  (
    'The most boring article about cats you''ll ever read',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    102
  ),
  (
    '7 things lady gaga has in common with cats',
    'Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.',
    103
  );


INSERT INTO notes_tags (note_id, tag_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4);


SELECT title, tags.name as tag, folders.name as folderName FROM notes
  LEFT JOIN folders ON notes.folder_id = folders.id
  LEFT JOIN notes_tags ON notes.id = notes_tags.note_id
  LEFT JOIN tags ON notes_tags.tag_id = tags.id;

