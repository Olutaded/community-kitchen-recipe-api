const { pool } = require('../config/db');

const getMealPlansByUserId = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      meal_plans.id,
      meal_plans.user_id,
      meal_plans.recipe_id,
      meal_plans.meal_date,
      meal_plans.meal_type,
      meal_plans.notes,
      meal_plans.created_at,
      meal_plans.updated_at,
      recipes.title AS recipe_title,
      categories.name AS category_name
    FROM meal_plans
    INNER JOIN recipes ON meal_plans.recipe_id = recipes.id
    INNER JOIN categories ON recipes.category_id = categories.id
    WHERE meal_plans.user_id = ?
    ORDER BY meal_plans.meal_date ASC
    `,
    [userId]
  );

  return rows;
};

const createMealPlan = async (userId, mealPlanData) => {
  const [result] = await pool.query(
    `
    INSERT INTO meal_plans
    (
      user_id,
      recipe_id,
      meal_date,
      meal_type,
      notes
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      userId,
      mealPlanData.recipeId,
      mealPlanData.mealDate,
      mealPlanData.mealType,
      mealPlanData.notes || null
    ]
  );

  const [rows] = await pool.query(
    `
    SELECT
      meal_plans.id,
      meal_plans.user_id,
      meal_plans.recipe_id,
      meal_plans.meal_date,
      meal_plans.meal_type,
      meal_plans.notes,
      meal_plans.created_at,
      meal_plans.updated_at,
      recipes.title AS recipe_title,
      categories.name AS category_name
    FROM meal_plans
    INNER JOIN recipes ON meal_plans.recipe_id = recipes.id
    INNER JOIN categories ON recipes.category_id = categories.id
    WHERE meal_plans.id = ?
    `,
    [result.insertId]
  );

  return rows[0];
};

module.exports = {
  getMealPlansByUserId,
  createMealPlan
};