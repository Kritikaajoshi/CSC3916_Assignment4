// Assignment 4 - Updated with aggregation
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authJwtController = require('./auth_jwt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Users');
const Movie = require('./Movies');
const Review = require('./Reviews');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

const router = express.Router();

// ── SIGNUP ──────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ success: false, msg: 'Please include both username and password.' });
  }
  try {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.status(201).json({ success: true, msg: 'Successfully created new user.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'A user with that username already exists.' });
    }
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// ── SIGNIN ──────────────────────────────────────────────
router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('name username password');
    if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const userToken = { id: user._id, username: user.username };
      const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '24h' });
      res.json({ success: true, token: 'JWT ' + token });
    } else {
      res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
});

// ── MOVIES ──────────────────────────────────────────────
router.route('/movies')
  .get(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const aggregate = [
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'movieId',
            as: 'movieReviews'
          }
        },
        {
          $addFields: {
            avgRating: { $avg: '$movieReviews.rating' }
          }
        },
        {
          $sort: { avgRating: -1 }
        }
      ];
      const movies = await Movie.aggregate(aggregate);
      res.json(movies);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  })
  .post(authJwtController.isAuthenticated, async (req, res) => {
    const { title, releaseDate, genre, actors, imageUrl } = req.body;
    if (!title || !releaseDate || !genre || !actors || actors.length === 0) {
      return res.status(400).json({ success: false, message: 'All fields including actors are required.' });
    }
    try {
      const movie = new Movie({ title, releaseDate, genre, actors, imageUrl });
      const saved = await movie.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  })
  .put(authJwtController.isAuthenticated, (req, res) => {
    res.status(405).json({ success: false, message: 'PUT not supported on /movies' });
  })
  .delete(authJwtController.isAuthenticated, (req, res) => {
    res.status(405).json({ success: false, message: 'DELETE not supported on /movies' });
  });

router.route('/movies/:movieparameter')
  .get(authJwtController.isAuthenticated, async (req, res) => {
    try {
      if (req.query.reviews === 'true') {
        const movieWithReviews = await Movie.aggregate([
          { $match: { title: req.params.movieparameter } },
          {
            $lookup: {
              from: 'reviews',
              localField: '_id',
              foreignField: 'movieId',
              as: 'movieReviews'
            }
          },
          {
            $addFields: {
              avgRating: { $avg: '$movieReviews.rating' }
            }
          }
        ]);
        if (!movieWithReviews || movieWithReviews.length === 0) {
          return res.status(404).json({ success: false, message: 'Movie not found.' });
        }
        return res.json(movieWithReviews[0]);
      }
      const movie = await Movie.findOne({ title: req.params.movieparameter });
      if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });
      res.json(movie);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  })
  .put(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const updated = await Movie.findOneAndUpdate(
        { title: req.params.movieparameter },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Movie not found.' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  })
  .delete(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const deleted = await Movie.findOneAndDelete({ title: req.params.movieparameter });
      if (!deleted) return res.status(404).json({ success: false, message: 'Movie not found.' });
      res.json({ success: true, message: 'Movie deleted successfully.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

// ── REVIEWS ──────────────────────────────────────────────
router.route('/reviews')
  .get(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const reviews = await Review.find();
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  })
  .post(authJwtController.isAuthenticated, async (req, res) => {
    const { movieId, username, review, rating } = req.body;
    if (!movieId || !username || !review || rating === undefined) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    try {
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found in database.' });
      }
      const newReview = new Review({ movieId, username, review, rating });
      await newReview.save();
      res.status(201).json({ message: 'Review created!' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

app.use('/', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;