# CSC3916 Assignment 4

## Project Description
This API builds upon Assignment 3 by adding a Reviews collection to MongoDB. Users can query movies and get their reviews using the ?reviews=true query parameter. The API uses JWT authentication for all protected routes and supports aggregation of movies and reviews using MongoDB's $lookup operator.

## Deployed API
https://csc3916-assignment4-vo4c.onrender.com

## Installation

Clone the repository and install dependencies:

    git clone https://github.com/Kritikaajoshi/CSC3916_Assignment4
    cd CSC3916_Assignment4
    npm install
    npm start

## Environment Settings

Create a .env file in the root directory with the following variables:

| Variable | Description |
|----------|-------------|
| DB | MongoDB Atlas connection string |
| SECRET_KEY | JWT secret key for token signing |
| PORT | Server port (default: 8080) |

## API Routes

### Auth Routes
| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| POST | /signup | Create a new user | No |
| POST | /signin | Sign in and get JWT token | No |

### Movie Routes
| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| GET | /movies | Get all movies | Yes |
| POST | /movies | Add a new movie | Yes |
| GET | /movies/:title | Get one movie | Yes |
| GET | /movies/:title?reviews=true | Get movie with all reviews | Yes |
| PUT | /movies/:title | Update a movie | Yes |
| DELETE | /movies/:title | Delete a movie | Yes |

### Review Routes
| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| GET | /reviews | Get all reviews | Yes |
| POST | /reviews | Add a new review | Yes |

## Postman Collection

Collection and environment files are in the /postman folder of this repository.

### Postman Environment Variables
| Variable | Description |
|----------|-------------|
| token | JWT token (auto-saved from Signin request) |

### Postman Tests Included
- Signup
- Signin - auto saves JWT token to environment
- Get All Movies
- Add a Movie
- Get One Movie
- Update a Movie
- Delete a Movie
- Error: Duplicate User
- Error: Movie Missing Actors
- Error: Wrong Password
- Get Movie WITHOUT Reviews
- Get Movie that doesn't exist (invalid request)
- Get Movie WITH Reviews using ?reviews=true
- Post Valid Review
- Post Invalid Review with fake movieId