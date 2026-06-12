const { pool } = require('../config/db');

const publicRecipeSelect = `
  SELECT 
    recipes.id,
    recipes.title,
    recipes.description,
    recipes.instructions,
    recipes.preparation_time_minutes,
    recipes.cooking_time_minutes,
    recipes.servings,
    recipes.difficulty,
    recipes.is_public,
    recipes.created_at,
    recipes.updated_at,
    categories.name AS category_name,
    users.full_name AS created_by
  FROM recipes
  INNER JOIN categories ON recipes.category_id = categories.id
  LEFT JOIN users ON recipes.created_by = users.id
`;

const getAllRecipes = async () => {
  const [rows] = await pool.query(`
    ${publicRecipeSelect}
    WHERE recipes.is_public = true
    ORDER BY recipes.created_at DESC
  `);

  return rows;
};

const getRecipeById = async (id) => {
  const [rows] = await pool.query(
    `
    ${publicRecipeSelect}
    WHERE recipes.id = ? AND recipes.is_public = true
    `,
    [id]
  );

  return rows[0];
};

const getRecipeByIdForAdmin = async (id) => {
  const [rows] = await pool.query(
    `
    ${publicRecipeSelect}
    WHERE recipes.id = ?
    `,
    [id]
  );

  return rows[0];
};

const createRecipe = async (recipeData, userId) => {
  const [result] = await pool.query(
    `
    INSERT INTO recipes
    (
      category_id,
      created_by,
      title,
      description,
      instructions,
      preparation_time_minutes,
      cooking_time_minutes,
      servings,
      difficulty,
      is_public
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      recipeData.categoryId,
      userId,
      recipeData.title,
      recipeData.description,
      recipeData.instructions,
      recipeData.preparationTimeMinutes,
      recipeData.cookingTimeMinutes,
      recipeData.servings,
      recipeData.difficulty,
      recipeData.isPublic
    ]
  );

  return getRecipeByIdForAdmin(result.insertId);
};

const updateRecipe = async (id, recipeData) => {
  const [result] = await pool.query(
    `
    UPDATE recipes
    SET
      category_id = ?,
      title = ?,
      description = ?,
      instructions = ?,
      preparation_time_minutes = ?,
      cooking_time_minutes = ?,
      servings = ?,
      difficulty = ?,
      is_public = ?
    WHERE id = ?
    `,
    [
      recipeData.categoryId,
      recipeData.title,
      recipeData.description,
      recipeData.instructions,
      recipeData.preparationTimeMinutes,
      recipeData.cookingTimeMinutes,
      recipeData.servings,
      recipeData.difficulty,
      recipeData.isPublic,
      id
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getRecipeByIdForAdmin(id);
};

const deleteRecipe = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM recipes
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  getRecipeByIdForAdmin,
  createRecipe,
  updateRecipe,
  deleteRecipe
};