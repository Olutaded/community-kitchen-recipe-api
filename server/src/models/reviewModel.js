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

const getReviewsByRecipeId = async (recipeId) => {
  const [rows] = await pool.query(
    `
    SELECT
      reviews.id,
      reviews.user_id,
      reviews.recipe_id,
      reviews.rating,
      reviews.comment,
      reviews.created_at,
      reviews.updated_at,
      users.full_name AS reviewer_name
    FROM reviews
    INNER JOIN users ON reviews.user_id = users.id
    WHERE reviews.recipe_id = ?
    ORDER BY reviews.created_at DESC
    `,
    [recipeId]
  );

  return rows;
};

const userReviewExists = async (userId, recipeId) => {
  const [rows] = await pool.query(
    `
    SELECT id
    FROM reviews
    WHERE user_id = ? AND recipe_id = ?
    LIMIT 1
    `,
    [userId, recipeId]
  );

  return Boolean(rows[0]);
};

const createReview = async (userId, recipeId, reviewData) => {
  const [result] = await pool.query(
    `
    INSERT INTO reviews
    (
      user_id,
      recipe_id,
      rating,
      comment
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      userId,
      recipeId,
      reviewData.rating,
      reviewData.comment || null
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      reviews.id,
      reviews.user_id,
      reviews.recipe_id,
      reviews.rating,
      reviews.comment,
      reviews.created_at,
      reviews.updated_at,
      users.full_name AS reviewer_name
    FROM reviews
    INNER JOIN users ON reviews.user_id = users.id
    WHERE reviews.id = ?
    `,
    [result.insertId]
  );

  return rows[0];
};

module.exports = {
  recipeExists,
  getReviewsByRecipeId,
  userReviewExists,
  createReview
};