require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./Movies');
const Review = require('./Reviews');

mongoose.connect(process.env.DB);

async function seedReviews() {
  try {
    // Get all movies
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies`);

    // Add one review for each movie
    for (const movie of movies) {
      const review = new Review({
        movieId: movie._id,
        username: 'testuser',
        review: `Great movie! ${movie.title} was amazing!`,
        rating: 5
      });
      await review.save();
      console.log(`Review added for ${movie.title}`);
    }

    console.log('All reviews added!');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

seedReviews();