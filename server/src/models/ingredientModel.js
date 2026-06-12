const { pool } = require('../config/db');

const getAllIngredients = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id,
      name,
      unit,
      created_at,
      updated_at
    FROM ingredients
    ORDER BY name ASC
  `);

  return rows;
};

module.exports = {
  getAllIngredients
};