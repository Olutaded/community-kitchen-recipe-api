const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('Community Kitchen Recipe API endpoint tests', () => {
  let adminToken;
  let userToken;
  let createdRecipeId;

  const uniqueTitle = `Automated Test Recipe ${Date.now()}`;

  afterAll(async () => {
    await pool.end();
  });

  test('GET /api/health should return API running message and response headers', async () => {
    const response = await request(app.callback())
      .get('/api/health')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Community Kitchen Recipe API is running');
    expect(response.headers['x-response-time']).toBeDefined();
    expect(response.headers['cache-control']).toBeDefined();
  });

  test('GET /api/db-test should confirm database connection', async () => {
    const response = await request(app.callback())
      .get('/api/db-test')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Database connection is working');
  });

  test('POST /api/auth/login should reject invalid login details', async () => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .send({
        email: 'admin@communitykitchen.test',
        password: 'WrongPassword'
      })
      .expect(401);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Invalid email or password');
  });

  test('POST /api/auth/login should login admin user', async () => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .send({
        email: 'admin@communitykitchen.test',
        password: 'Admin@12345'
      })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
    expect(response.body.user.role).toBe('admin');

    adminToken = response.body.token;
  });

  test('POST /api/auth/login should login normal user', async () => {
    const response = await request(app.callback())
      .post('/api/auth/login')
      .send({
        email: 'grace@communitykitchen.test',
        password: 'User@12345'
      })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.token).toBeDefined();
    expect(response.body.user.role).toBe('user');

    userToken = response.body.token;
  });

  test('GET /api/auth/profile should reject request without token', async () => {
    const response = await request(app.callback())
      .get('/api/auth/profile')
      .expect(401);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Authentication token is required');
  });

  test('GET /api/auth/profile should allow request with token', async () => {
    const response = await request(app.callback())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.role).toBe('admin');
  });

  test('GET /api/auth/admin-check should allow admin user', async () => {
    const response = await request(app.callback())
      .get('/api/auth/admin-check')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Admin authorisation successful');
  });

  test('GET /api/auth/admin-check should reject normal user', async () => {
    const response = await request(app.callback())
      .get('/api/auth/admin-check')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('You do not have permission to access this resource');
  });

  test('GET /api/recipes should return recipes', async () => {
    const response = await request(app.callback())
      .get('/api/recipes')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.count).toBeGreaterThan(0);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /api/recipes/1 should return one recipe', async () => {
    const response = await request(app.callback())
      .get('/api/recipes/1')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.id).toBe(1);
    expect(response.body.data.links.self).toBe('/api/recipes/1');
  });

  test('GET /api/recipes/99999 should return recipe not found', async () => {
    const response = await request(app.callback())
      .get('/api/recipes/99999')
      .expect(404);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Recipe not found');
  });

  test('POST /api/recipes should reject normal user', async () => {
    const response = await request(app.callback())
      .post('/api/recipes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        categoryId: 1,
        title: uniqueTitle,
        description: 'A test recipe created during automated endpoint testing.',
        instructions: 'Prepare ingredients, cook carefully and serve while hot.',
        preparationTimeMinutes: 10,
        cookingTimeMinutes: 20,
        servings: 4,
        difficulty: 'Easy',
        isPublic: true
      })
      .expect(403);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('You do not have permission to access this resource');
  });

  test('POST /api/recipes should reject invalid recipe body', async () => {
    const response = await request(app.callback())
      .post('/api/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        description: 'This recipe is missing a title.',
        instructions: 'This request should fail validation.',
        preparationTimeMinutes: 10,
        cookingTimeMinutes: 20,
        servings: 4,
        difficulty: 'Easy',
        isPublic: true
      })
      .expect(400);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Invalid recipe data');
    expect(response.body.details).toEqual(expect.arrayContaining(['"title" is required']));
  });

  test('POST /api/recipes should allow admin to create recipe', async () => {
    const response = await request(app.callback())
      .post('/api/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        title: uniqueTitle,
        description: 'A test recipe created during automated endpoint testing.',
        instructions: 'Prepare ingredients, cook carefully and serve while hot.',
        preparationTimeMinutes: 10,
        cookingTimeMinutes: 20,
        servings: 4,
        difficulty: 'Easy',
        isPublic: true
      })
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Recipe created successfully');
    expect(response.body.data.title).toBe(uniqueTitle);

    createdRecipeId = response.body.data.id;
  });

  test('PUT /api/recipes/:id should allow admin to update recipe', async () => {
    const response = await request(app.callback())
      .put(`/api/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId: 1,
        title: `${uniqueTitle} Updated`,
        description: 'An updated test recipe used during automated endpoint testing.',
        instructions: 'Update ingredients, cook carefully and serve while hot.',
        preparationTimeMinutes: 15,
        cookingTimeMinutes: 25,
        servings: 5,
        difficulty: 'Medium',
        isPublic: true
      })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Recipe updated successfully');
    expect(response.body.data.title).toBe(`${uniqueTitle} Updated`);
  });

  test('GET /api/categories should return categories', async () => {
    const response = await request(app.callback())
      .get('/api/categories')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.count).toBeGreaterThan(0);
  });

  test('GET /api/ingredients should return ingredients', async () => {
    const response = await request(app.callback())
      .get('/api/ingredients')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.count).toBeGreaterThan(0);
  });

  test('GET /api/meal-plans should reject request without token', async () => {
    const response = await request(app.callback())
      .get('/api/meal-plans')
      .expect(401);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Authentication token is required');
  });

  test('GET /api/meal-plans should return user meal plans', async () => {
    const response = await request(app.callback())
      .get('/api/meal-plans')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST /api/meal-plans should create meal plan', async () => {
    const response = await request(app.callback())
      .post('/api/meal-plans')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        recipeId: createdRecipeId,
        mealDate: '2026-07-01',
        mealType: 'Dinner',
        notes: 'Automated test meal plan.'
      })
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Meal plan created successfully');
    expect(response.body.data.recipeId).toBe(createdRecipeId);
  });

  test('GET /api/recipes/:id/reviews should return reviews', async () => {
    const response = await request(app.callback())
      .get(`/api/recipes/${createdRecipeId}/reviews`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST /api/recipes/:id/reviews should reject invalid rating', async () => {
    const response = await request(app.callback())
      .post(`/api/recipes/${createdRecipeId}/reviews`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        rating: 7,
        comment: 'Invalid rating should fail.'
      })
      .expect(400);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Invalid review data');
  });

  test('POST /api/recipes/:id/reviews should create review', async () => {
    const response = await request(app.callback())
      .post(`/api/recipes/${createdRecipeId}/reviews`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        rating: 5,
        comment: 'Automated test review for the created recipe.'
      })
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Review created successfully');
    expect(response.body.data.rating).toBe(5);
  });

  test('GET /api/favourites should return user favourites', async () => {
    const response = await request(app.callback())
      .get('/api/favourites')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST /api/favourites should add favourite', async () => {
    const response = await request(app.callback())
      .post('/api/favourites')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        recipeId: createdRecipeId
      })
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Favourite added successfully');
    expect(response.body.data.recipeId).toBe(createdRecipeId);
  });

  test('DELETE /api/favourites/:recipeId should remove favourite', async () => {
    const response = await request(app.callback())
      .delete(`/api/favourites/${createdRecipeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Favourite removed successfully');
  });

  test('DELETE /api/recipes/:id should reject normal user', async () => {
    const response = await request(app.callback())
      .delete(`/api/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('You do not have permission to access this resource');
  });

  test('DELETE /api/recipes/:id should allow admin to delete recipe', async () => {
    const response = await request(app.callback())
      .delete(`/api/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Recipe deleted successfully');
  });

  test('GET /api/wrong-route should return 404', async () => {
    const response = await request(app.callback())
      .get('/api/wrong-route')
      .expect(404);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Route not found');
  });
});