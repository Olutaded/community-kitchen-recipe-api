# Community Kitchen Recipe and Meal Planning API

## Project Overview

This project is a full stack RESTful API portfolio for a Community Kitchen Recipe and Meal Planning system. It includes a Koa Node.js backend, a MySQL database and a Vue.js single page application frontend.

The system allows users to view community recipes, categories and ingredients. Authenticated users can manage meal plans, favourites and reviews. Admin users can create, update and delete recipes through protected API routes.

## Main Features

* RESTful API built with Koa and Node.js
* MySQL database with relational tables
* Vue.js single page application frontend
* JWT authentication
* Role-based authorisation
* Scope-based access checks
* Recipe CRUD operations
* Categories and ingredients
* Meal plans for authenticated users
* Recipe reviews
* Favourite recipes
* Request validation using Joi
* Security middleware using Helmet and CORS
* Request logging middleware
* Response time headers
* Cache-Control headers
* Custom 404 route handling
* Automated API tests using Jest and Supertest
* OpenAPI 3.0 documentation

## Technology Stack

### Backend

* Node.js
* Koa
* MySQL
* mysql2
* JSON Web Token
* bcryptjs
* Joi
* Jest
* Supertest

### Frontend

* Vue.js
* Vite
* JavaScript
* CSS

## Project Structure

```text
community-kitchen-recipe-api
  client
    src
      App.vue
      main.js
      style.css
    package.json

  server
    src
      config
      controllers
      database
      middleware
      models
      routes
      validation
      app.js
      server.js
    tests
      api.test.js
    openapi.yaml
    package.json

  documentation
  README.md
  .gitignore
```

## Demo Login Accounts

The seed data creates these accounts:

```text
Admin account
Email: admin@communitykitchen.test
Password: Admin@12345

User account
Email: grace@communitykitchen.test
Password: User@12345
```

## Backend Setup

Go into the server folder:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=3000
DB_HOST=localhost
DB_USER=kitchen_user
DB_PASSWORD=KitchenApp@2026
DB_NAME=community_kitchen_db
JWT_SECRET=community_kitchen_secret_key
```

If your local MySQL password is different, update `DB_PASSWORD` to match your own database user password.

## Database Setup

Log in to MySQL and create the database:

```sql
CREATE DATABASE community_kitchen_db;
```

Run the schema file to create the tables:

```bash
mysql -u kitchen_user -p community_kitchen_db < src/database/schema.sql
```

Seed the database:

```bash
node src/database/seed.js
```

## Run the Backend API

From the `server` folder, run:

```bash
npm start
```

The API should run on:

```text
http://localhost:3000
```

Test the health endpoint in the browser:

```text
http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "success",
  "message": "Community Kitchen Recipe API is running"
}
```

## Run Backend Tests

From the `server` folder, run:

```bash
npm test
```

The automated test suite checks authentication, authorisation, recipes, categories, ingredients, meal plans, reviews, favourites, validation, response headers and 404 handling.

Expected result:

```text
Test Suites: 1 passed
Tests: 30 passed
```

## Frontend Setup

Open a second terminal and go into the client folder:

```bash
cd client
```

Install frontend dependencies:

```bash
npm install
```

Run the Vue.js development server:

```bash
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

## Build the Frontend

From the `client` folder, run:

```bash
npm run build
```

This creates the production build inside:

```text
client/dist
```

## Main API Endpoints

### System

```text
GET /api/health
GET /api/db-test
```

### Authentication

```text
POST /api/auth/login
GET  /api/auth/profile
GET  /api/auth/admin-check
```

### Recipes

```text
GET    /api/recipes
GET    /api/recipes/:id
POST   /api/recipes
PUT    /api/recipes/:id
DELETE /api/recipes/:id
```

### Categories

```text
GET /api/categories
```

### Ingredients

```text
GET /api/ingredients
```

### Meal Plans

```text
GET  /api/meal-plans
POST /api/meal-plans
```

### Reviews

```text
GET  /api/recipes/:id/reviews
POST /api/recipes/:id/reviews
```

### Favourites

```text
GET    /api/favourites
POST   /api/favourites
DELETE /api/favourites/:recipeId
```

## OpenAPI Documentation

The API is documented using OpenAPI 3.0.

The specification file is located at:

```text
server/openapi.yaml
```

This file describes the available endpoints, request bodies, response formats, authentication requirements and error responses.

## Security Features

The API includes:

* JWT authentication
* Role-based authorisation
* Scope-based permission checks
* Password hashing with bcryptjs
* Helmet security headers
* CORS configuration
* Validation of request bodies
* Protected admin routes
* Protected user routes

## Testing Evidence

The project includes automated tests using Jest and Supertest. The tests cover normal requests, protected requests, invalid requests, role-based rejection and successful CRUD operations.

## Frontend Evidence

The Vue.js SPA demonstrates:

* API health check
* Recipe list display
* Category list display
* Ingredient list display
* Login with seeded accounts
* JWT token storage
* Profile loading
* Admin authorisation check
* Meal plan creation
* Favourite recipe management
* Review creation
* Admin recipe creation

## Author

Daniel Olatude
