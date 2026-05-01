require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./Movies');
const Review = require('./Reviews');

mongoose.connect(process.env.DB);

async function cleanup() {
  try {
    // Delete all movies and reviews
    await Movie.deleteMany({});
    await Review.deleteMany({});
    console.log('All movies and reviews deleted!');

    // Add fresh movies with images
    const movies = [
      { title: 'Inception', releaseDate: 2010, genre: 'Science Fiction',
        actors: [{ actorName: 'Leonardo DiCaprio', characterName: 'Cobb' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg' },
      { title: 'The Dark Knight', releaseDate: 2008, genre: 'Action',
        actors: [{ actorName: 'Christian Bale', characterName: 'Batman' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg' },
      { title: 'Titanic', releaseDate: 1997, genre: 'Drama',
        actors: [{ actorName: 'Leonardo DiCaprio', characterName: 'Jack' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png' },
      { title: 'The Matrix', releaseDate: 1999, genre: 'Science Fiction',
        actors: [{ actorName: 'Keanu Reeves', characterName: 'Neo' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg' },
      { title: 'Interstellar', releaseDate: 2014, genre: 'Science Fiction',
        actors: [{ actorName: 'Matthew McConaughey', characterName: 'Cooper' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg' }
    ];

    const savedMovies = await Movie.insertMany(movies);
    console.log('Fresh movies added!');

    // Add one review for each movie
    for (const movie of savedMovies) {
      const review = new Review({
        movieId: movie._id,
        username: 'testuser',
        review: `Great movie! ${movie.title} was amazing!`,
        rating: 5
      });
      await review.save();
      console.log(`Review added for ${movie.title}`);
    }

    console.log('All done!');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

cleanup();