require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./Movies');

mongoose.connect(process.env.DB);

const movieImages = [
  {
    title: 'Inception',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg'
  },
  {
    title: 'The Dark Knight',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg'
  },
  {
    title: 'Titanic',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png'
  },
  {
    title: 'The Matrix',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg'
  },
  {
    title: 'Interstellar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg'
  }
];

async function seedImages() {
  try {
    for (const movie of movieImages) {
      await Movie.findOneAndUpdate(
        { title: movie.title },
        { imageUrl: movie.imageUrl },
        { new: true }
      );
      console.log(`Image added for ${movie.title}`);
    }
    console.log('All images added!');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

seedImages();