require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./Movies');
const Review = require('./Reviews');

mongoose.connect(process.env.DB);

async function check() {
  const movies = await Movie.find();
  const reviews = await Review.find();
  
  console.log('Movies:', movies.length);
  console.log('Reviews:', reviews.length);
  
  movies.forEach(m => console.log(m.title, m._id));
  reviews.forEach(r => console.log(r.movieId, r.rating));
  
  mongoose.disconnect();
}

check();