require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./Movies');

mongoose.connect(process.env.DB);

const movies = [
  { title: 'Inception', releaseDate: 2010, genre: 'Science Fiction',
    actors: [{ actorName: 'Leonardo DiCaprio', characterName: 'Cobb' }] },
  { title: 'The Dark Knight', releaseDate: 2008, genre: 'Action',
    actors: [{ actorName: 'Christian Bale', characterName: 'Batman' }] },
  { title: 'Titanic', releaseDate: 1997, genre: 'Drama',
    actors: [{ actorName: 'Leonardo DiCaprio', characterName: 'Jack' }] },
  { title: 'The Matrix', releaseDate: 1999, genre: 'Science Fiction',
    actors: [{ actorName: 'Keanu Reeves', characterName: 'Neo' }] },
  { title: 'Interstellar', releaseDate: 2014, genre: 'Science Fiction',
    actors: [{ actorName: 'Matthew McConaughey', characterName: 'Cooper' }] }
];

Movie.insertMany(movies)
  .then(() => { console.log('Movies added!'); mongoose.disconnect(); })
  .catch(err => console.error(err));