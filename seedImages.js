require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./Movies');

mongoose.connect(process.env.DB);

const movieImages = [
  {
    title: 'Inception',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg'
  },
  {
    title: 'The Dark Knight',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg'
  },
  {
    title: 'Titanic',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg'
  },
  {
    title: 'The Matrix',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVlLTM5YTUtZjk4ODhmNGJmNmQxXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg'
  },
  {
    title: 'Interstellar',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg'
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
      console.log(`Image updated for ${movie.title}`);
    }
    console.log('All images updated!');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

seedImages();