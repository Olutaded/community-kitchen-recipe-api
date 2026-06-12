USE community_kitchen_db;

DROP TABLE IF EXISTS security_logs;
DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS meal_plans;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  scopes VARCHAR(255) NOT NULL DEFAULT 'recipes:read',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  created_by INT,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  preparation_time_minutes INT NOT NULL,
  cooking_time_minutes INT NOT NULL,
  servings INT NOT NULL,
  difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL DEFAULT 'Easy',
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_recipes_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_recipes_user
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE TABLE recipe_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,

  CONSTRAINT fk_recipe_ingredients_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_recipe_ingredients_ingredient
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    ON DELETE RESTRICT
);

CREATE TABLE meal_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  meal_date DATE NOT NULL,
  meal_type ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack') NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_meal_plans_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_meal_plans_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    ON DELETE CASCADE
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT chk_reviews_rating
    CHECK (rating BETWEEN 1 AND 5),

  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_reviews_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_user_recipe_review
    UNIQUE (user_id, recipe_id)
);

CREATE TABLE favourites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_favourites_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_favourites_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_user_recipe_favourite
    UNIQUE (user_id, recipe_id)
);

CREATE TABLE security_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_type VARCHAR(100) NOT NULL,
  ip_address VARCHAR(100),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_security_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
);