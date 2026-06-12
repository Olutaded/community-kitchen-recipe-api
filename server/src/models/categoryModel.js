const { pool } = require('../config/db');

const getAllCategories = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id,
      name,
      description,
      created_at,
      updated_at
    FROM categories
    ORDER BY name ASC
  `);

  return rows;
};

module.exports = {
  getAllCategories
};