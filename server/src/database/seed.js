const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    await pool.query('SET FOREIGN_KEY_CHECKS = 0');

    await pool.query('DELETE FROM security_logs');
    await pool.query('DELETE FROM favourites');
    await pool.query('DELETE FROM reviews');
    await pool.query('DELETE FROM meal_plans');
    await pool.query('DELETE FROM recipe_ingredients');
    await pool.query('DELETE FROM recipes');
    await pool.query('DELETE FROM ingredients');
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM users');

    await pool.query('ALTER TABLE security_logs AUTO_INCREMENT = 1');
    await pool.query('ALTER TABLE favourites AUTO_INCREMENT = 1');
    await pool.query('ALTER TABLE reviews AUTO_INCREMENT = 1');
    await pool.query('ALTER TABLE meal_plans AUTO_INCREMENT = 1');
    await pool.query('ALTER TABLE recipe_ingredients AUTO_INCREMENT = 1');
    await pool.query('ALTER TABLE recipes AUTO_INCREMENT = 1');
    await pool.query('ALTER TABLE ingredients AUTO_INCREMENT = 1');
    await pool.query('ALTER TABLE categories AUTO_INCREMENT = 1');
    await pool.query('ALTER TABLE users AUTO_INCREMENT = 1');

    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);
    const userPasswordHash = await bcrypt.hash('User@12345', 10);

    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, scopes)
       VALUES
       (?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?)`,
      [
        'System Administrator',
        'admin@communitykitchen.test',
        adminPasswordHash,
        'admin',
        'recipes:read,recipes:write,categories:write,ingredients:write,mealplans:write,reviews:write,favourites:write,admin:manage',

        'Grace Wanjiku',
        'grace@communitykitchen.test',
        userPasswordHash,
        'user',
        'recipes:read,mealplans:write,reviews:write,favourites:write',

        'Daniel Otieno',
        'daniel@communitykitchen.test',
        userPasswordHash,
        'user',
        'recipes:read,mealplans:write,reviews:write,favourites:write'
      ]
    );

    await pool.query(
      `INSERT INTO categories (name, description)
       VALUES
       (?, ?),
       (?, ?),
       (?, ?),
       (?, ?)`,
      [
        'Healthy Meals',
        'Balanced meals suitable for community kitchen nutrition programmes.',

        'Budget Meals',
        'Low-cost meals using affordable ingredients.',

        'Vegetarian',
        'Meals prepared without meat or fish.',

        'Family Meals',
        'Meals suitable for families and group serving.'
      ]
    );

    await pool.query(
      `INSERT INTO ingredients (name, unit)
       VALUES
       (?, ?),
       (?, ?),
       (?, ?),
       (?, ?),
       (?, ?),
       (?, ?),
       (?, ?),
       (?, ?),
       (?, ?),
       (?, ?)`,
      [
        'Rice', 'grams',
        'Lentils', 'grams',
        'Carrots', 'grams',
        'Onions', 'pieces',
        'Tomatoes', 'pieces',
        'Spinach', 'grams',
        'Beans', 'grams',
        'Potatoes', 'grams',
        'Cooking Oil', 'tablespoons',
        'Salt', 'teaspoons'
      ]
    );

    await pool.query(
      `INSERT INTO recipes
       (category_id, created_by, title, description, instructions, preparation_time_minutes, cooking_time_minutes, servings, difficulty, is_public)
       VALUES
       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        1,
        1,
        'Vegetable Lentil Stew',
        'A nutritious lentil stew prepared with carrots, tomatoes and spinach.',
        'Wash the lentils. Fry onions and tomatoes. Add carrots, lentils and water. Simmer until soft. Add spinach near the end and season with salt.',
        15,
        35,
        4,
        'Easy',
        true,

        2,
        1,
        'Simple Rice and Beans',
        'An affordable rice and beans meal suitable for large groups.',
        'Boil the beans until soft. Cook rice separately. Prepare onion and tomato sauce, then mix with beans and serve with rice.',
        20,
        60,
        6,
        'Medium',
        true,

        3,
        1,
        'Spinach Potato Curry',
        'A vegetarian curry made with potatoes, spinach, onions and tomatoes.',
        'Peel and chop potatoes. Fry onions and tomatoes. Add potatoes and simmer. Add spinach when potatoes are cooked.',
        15,
        30,
        4,
        'Easy',
        true,

        4,
        1,
        'Family Vegetable Rice',
        'A simple vegetable rice dish for family and community servings.',
        'Cook rice with carrots, onions, tomatoes and seasoning. Serve hot as a complete family meal.',
        10,
        25,
        5,
        'Easy',
        true
      ]
    );

    await pool.query(
      `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
       VALUES
       (?, ?, ?),
       (?, ?, ?),
       (?, ?, ?),
       (?, ?, ?),
       (?, ?, ?),
       (?, ?, ?),
       (?, ?, ?),
       (?, ?, ?)`,
      [
        1, 2, 300,
        1, 3, 150,
        1, 6, 100,
        2, 1, 500,
        2, 7, 400,
        3, 8, 500,
        3, 6, 150,
        4, 1, 600
      ]
    );

    await pool.query(
      `INSERT INTO meal_plans (user_id, recipe_id, meal_date, meal_type, notes)
       VALUES
       (?, ?, ?, ?, ?),
       (?, ?, ?, ?, ?)`,
      [
        2,
        1,
        '2026-06-12',
        'Lunch',
        'Prepare for weekday lunch plan.',

        3,
        2,
        '2026-06-13',
        'Dinner',
        'Suitable for family dinner.'
      ]
    );

    await pool.query(
      `INSERT INTO reviews (user_id, recipe_id, rating, comment)
       VALUES
       (?, ?, ?, ?),
       (?, ?, ?, ?)`,
      [
        2,
        1,
        5,
        'Nutritious, simple and easy to prepare.',

        3,
        2,
        4,
        'Good budget meal for a family.'
      ]
    );

    await pool.query(
      `INSERT INTO favourites (user_id, recipe_id)
       VALUES
       (?, ?),
       (?, ?)`,
      [
        2,
        1,
        3,
        2
      ]
    );

    await pool.query(
      `INSERT INTO security_logs (user_id, event_type, ip_address, details)
       VALUES
       (?, ?, ?, ?)`,
      [
        1,
        'DATABASE_SEEDED',
        '127.0.0.1',
        'Initial demonstration data added successfully.'
      ]
    );

    console.log('Database seeded successfully.');
    console.log('');
    console.log('Demo login accounts:');
    console.log('Admin: admin@communitykitchen.test / Admin@12345');
    console.log('User: grace@communitykitchen.test / User@12345');

    await pool.end();
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    await pool.end();
    process.exit(1);
  }
};

seedDatabase();
