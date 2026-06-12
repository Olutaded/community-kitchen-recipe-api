const categoryModel = require('../models/categoryModel');

const getCategories = async (ctx) => {
  const categories = await categoryModel.getAllCategories();

  ctx.status = 200;
  ctx.body = {
    status: 'success',
    count: categories.length,
    data: categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
      links: {
        self: `/api/categories/${category.id}`,
        recipes: `/api/recipes?categoryId=${category.id}`
      }
    }))
  };
};

module.exports = {
  getCategories
};