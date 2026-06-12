const { pool } = require('../config/db');

const recipeExists = async (recipeId) => {
  const [rows] = await pool.query(
    `
    SELECT id
    FROM recipes
    WHERE id = ? AND is_public = true
    LIMIT 1
    `,
    [recipeId]
  );

  return Boolean(rows[0]);
};

const getFavouritesByUserId = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      favourites.id,
      favourites.user_id,
      favourites.recipe_id,
      favourites.created_at,
      recipes.title AS recipe_title,
      recipes.description AS recipe_description,
      recipes.difficulty,
      recipes.servings,
      categories.name AS category_name
    FROM favourites
    INNER JOIN recipes ON favourites.recipe_id = recipes.id
    INNER JOIN categories ON recipes.category_id = categories.id
    WHERE favourites.user_id = ?
    ORDER BY favourites.created_at DESC
    `,
    [userId]
  );

  return rows;
};

const favouriteExists = async (userId, recipeId) => {
  const [rows] = await pool.query(
    `
    SELECT id
    FROM favourites
    WHERE user_id = ? AND recipe_id = ?
    LIMIT 1
    `,
    [userId, recipeId]
  );

  return Boolean(rows[0]);
};

const createFavourite = async (userId, recipeId) => {
  const [result] = await pool.query(
    `
    INSERT INTO favourites (user_id, recipe_id)
    VALUES (?, ?)
    `,
    [userId, recipeId]
  );

  const [rows] = await pool.query(
    `
    SELECT
      favourites.id,
      favourites.user_id,
      favourites.recipe_id,
      favourites.created_at,
      recipes.title AS recipe_title,
      recipes.description AS recipe_description,
      recipes.difficulty,
      recipes.servings,
      categories.name AS category_name
    FROM favourites
    INNER JOIN recipes ON favourites.recipe_id = recipes.id
    INNER JOIN categories ON recipes.category_id = categories.id
    WHERE favourites.id = ?
    `,
    [result.insertId]
  );

  return rows[0];
};

const deleteFavourite = async (userId, recipeId) => {
  const [result] = await pool.query(
    `
    DELETE FROM favourites
    WHERE user_id = ? AND recipe_id = ?
    `,
    [userId, recipeId]
  );

  return result.affectedRows > 0;
};

module.exports = {
  recipeExists,
  getFavouritesByUserId,
  favouriteExists,
  createFavourite,
  deleteFavourite
};