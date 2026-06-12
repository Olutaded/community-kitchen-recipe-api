<template>
  <main class="app">
    <section class="hero">
      <div>
        <p class="eyebrow">Community Kitchen API Client</p>
        <h1>Recipe and Meal Planning System</h1>
        <p class="hero-text">
          This Vue.js single page application connects to the Koa RESTful API and displays
          live data from the MySQL database. It also demonstrates JWT login, protected
          API access, meal planning, favourites, reviews and admin recipe creation.
        </p>
      </div>

      <div class="status-card">
        <h2>API Status</h2>
        <p v-if="loadingHealth">Checking API connection...</p>
        <p v-else-if="apiStatus" class="success">{{ apiStatus }}</p>
        <p v-else class="error">{{ errorMessage }}</p>
        <button @click="loadHealth">Check API</button>
      </div>
    </section>

    <section class="auth-panel">
      <div class="panel">
        <h2>Login</h2>
        <p class="muted">Use the seeded account to test JWT authentication.</p>

        <form class="login-form" @submit.prevent="loginUser">
          <label>
            Email
            <input v-model="loginForm.email" type="email" required>
          </label>

          <label>
            Password
            <input v-model="loginForm.password" type="password" required>
          </label>

          <button type="submit" :disabled="loadingLogin">
            {{ loadingLogin ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p class="hint">Admin: admin@communitykitchen.test / Admin@12345</p>
        <p class="hint">User: grace@communitykitchen.test / User@12345</p>

        <p v-if="loginMessage" class="success">{{ loginMessage }}</p>
        <p v-if="loginError" class="error">{{ loginError }}</p>
      </div>

      <div class="panel">
        <h2>Authenticated User</h2>

        <div v-if="profile">
          <p><strong>Email:</strong> {{ profile.email }}</p>
          <p><strong>Role:</strong> {{ profile.role }}</p>

          <div class="button-row">
            <button @click="loadProfile">Refresh Profile</button>
            <button @click="checkAdminAccess">Admin Check</button>
            <button class="danger-button" @click="logout">Logout</button>
          </div>

          <p v-if="adminMessage" class="success">{{ adminMessage }}</p>
        </div>

        <p v-else class="muted">No user is logged in yet.</p>
      </div>
    </section>

    <section class="grid">
      <article class="panel large-panel">
        <div class="panel-header">
          <h2>Recipes</h2>
          <button @click="loadRecipes">Refresh</button>
        </div>

        <p v-if="loadingRecipes">Loading recipes...</p>
        <p v-else-if="recipes.length === 0">No recipes found.</p>

        <div v-else class="recipe-list">
          <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
            <div class="recipe-image-wrap">
              <img
                class="recipe-image"
                :src="getRecipeImage(recipe.id)"
                :alt="recipe.title"
              >
            </div>

            <h3>{{ recipe.title }}</h3>
            <p>{{ recipe.description }}</p>

            <div class="meta">
              <span>ID: {{ recipe.id }}</span>
              <span>{{ recipe.category }}</span>
              <span>{{ recipe.difficulty }}</span>
              <span>{{ recipe.servings }} servings</span>
            </div>

            <small>
              Prep: {{ recipe.preparationTimeMinutes }} mins |
              Cook: {{ recipe.cookingTimeMinutes }} mins
            </small>
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <h2>Categories</h2>
          <button @click="loadCategories">Refresh</button>
        </div>

        <p v-if="loadingCategories">Loading categories...</p>
        <p v-else-if="categories.length === 0">No categories found.</p>

        <ul v-else class="simple-list">
          <li v-for="category in categories" :key="category.id">
            <strong>{{ category.name }}</strong>
            <span>{{ category.description }}</span>
          </li>
        </ul>
      </article>

      <article class="panel">
        <div class="panel-header">
          <h2>Ingredients</h2>
          <button @click="loadIngredients">Refresh</button>
        </div>

        <p v-if="loadingIngredients">Loading ingredients...</p>
        <p v-else-if="ingredients.length === 0">No ingredients found.</p>

        <ul v-else class="ingredient-list">
          <li v-for="ingredient in ingredients" :key="ingredient.id">
            {{ ingredient.name }}
            <span>{{ ingredient.unit }}</span>
          </li>
        </ul>
      </article>
    </section>

    <section class="feature-grid">
      <article class="panel">
        <div class="panel-header">
          <h2>Meal Plans</h2>
          <button @click="loadMealPlans">Load</button>
        </div>

        <p class="muted">Requires login.</p>

        <form class="stacked-form" @submit.prevent="createMealPlan">
          <label>
            Recipe ID
            <input v-model.number="mealPlanForm.recipeId" type="number" min="1" required>
          </label>

          <label>
            Meal date
            <input v-model="mealPlanForm.mealDate" type="date" required>
          </label>

          <label>
            Meal type
            <select v-model="mealPlanForm.mealType" required>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </label>

          <label>
            Notes
            <input v-model="mealPlanForm.notes" type="text">
          </label>

          <button type="submit">Create Meal Plan</button>
        </form>

        <p v-if="mealPlanMessage" class="success">{{ mealPlanMessage }}</p>
        <p v-if="mealPlanError" class="error">{{ mealPlanError }}</p>

        <ul class="simple-list">
          <li v-for="plan in mealPlans" :key="plan.id">
            <strong>{{ plan.recipeTitle }}</strong>
            <span>{{ plan.mealType }} on {{ formatDate(plan.mealDate) }}</span>
          </li>
        </ul>
      </article>

      <article class="panel">
        <div class="panel-header">
          <h2>Favourites</h2>
          <button @click="loadFavourites">Load</button>
        </div>

        <p class="muted">Requires login.</p>

        <form class="stacked-form" @submit.prevent="addFavourite">
          <label>
            Recipe ID
            <input v-model.number="favouriteRecipeId" type="number" min="1" required>
          </label>

          <button type="submit">Add Favourite</button>
        </form>

        <p v-if="favouriteMessage" class="success">{{ favouriteMessage }}</p>
        <p v-if="favouriteError" class="error">{{ favouriteError }}</p>

        <ul class="simple-list">
          <li v-for="favourite in favourites" :key="favourite.id">
            <strong>{{ favourite.recipeTitle }}</strong>
            <span>{{ favourite.category }} | {{ favourite.difficulty }}</span>
            <button class="small-danger" @click="removeFavourite(favourite.recipeId)">
              Remove
            </button>
          </li>
        </ul>
      </article>

      <article class="panel wide-panel">
        <div class="panel-header">
          <h2>Reviews</h2>
          <button @click="loadReviews">Load Reviews</button>
        </div>

        <p class="muted">
          Select a recipe ID, load its reviews, then submit a review using the logged-in user.
        </p>

        <form class="review-form" @submit.prevent="createReview">
          <label>
            Recipe ID
            <input v-model.number="reviewForm.recipeId" type="number" min="1" required>
          </label>

          <label>
            Rating
            <select v-model.number="reviewForm.rating" required>
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
              <option :value="4">4</option>
              <option :value="5">5</option>
            </select>
          </label>

          <label class="review-comment">
            Comment
            <input v-model="reviewForm.comment" type="text" required>
          </label>

          <button type="submit">Create Review</button>
        </form>

        <p v-if="reviewMessage" class="success">{{ reviewMessage }}</p>
        <p v-if="reviewError" class="error">{{ reviewError }}</p>

        <ul class="simple-list">
          <li v-for="review in reviews" :key="review.id">
            <strong>{{ review.reviewerName }} rated {{ review.rating }}/5</strong>
            <span>{{ review.comment }}</span>
          </li>
        </ul>
      </article>
    </section>

    <section class="admin-section">
      <article class="panel">
        <div class="panel-header">
          <h2>Admin Recipe Creation</h2>
          <button @click="loadRecipes">Refresh Recipes</button>
        </div>

        <p class="muted">
          This section demonstrates an admin-only protected request to create a new recipe.
        </p>

        <form class="stacked-form" @submit.prevent="createAdminRecipe">
          <label>
            Category ID
            <input v-model.number="adminRecipeForm.categoryId" type="number" min="1" required>
          </label>

          <label>
            Recipe title
            <input v-model="adminRecipeForm.title" type="text" required>
          </label>

          <label>
            Description
            <input v-model="adminRecipeForm.description" type="text" required>
          </label>

          <label>
            Instructions
            <input v-model="adminRecipeForm.instructions" type="text" required>
          </label>

          <label>
            Preparation time minutes
            <input v-model.number="adminRecipeForm.preparationTimeMinutes" type="number" min="1" required>
          </label>

          <label>
            Cooking time minutes
            <input v-model.number="adminRecipeForm.cookingTimeMinutes" type="number" min="1" required>
          </label>

          <label>
            Servings
            <input v-model.number="adminRecipeForm.servings" type="number" min="1" required>
          </label>

          <label>
            Difficulty
            <select v-model="adminRecipeForm.difficulty" required>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>

          <button type="submit">Create Recipe as Admin</button>
        </form>

        <p v-if="adminRecipeMessage" class="success">{{ adminRecipeMessage }}</p>
        <p v-if="adminRecipeError" class="error">{{ adminRecipeError }}</p>
      </article>
    </section>
  </main>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

export default {
  name: 'App',

  data() {
    return {
      apiStatus: '',
      errorMessage: '',
      loadingHealth: false,

      token: localStorage.getItem('communityKitchenToken') || '',
      profile: null,

      loginForm: {
        email: 'admin@communitykitchen.test',
        password: 'Admin@12345'
      },

      loadingLogin: false,
      loginMessage: '',
      loginError: '',
      adminMessage: '',

      recipes: [],
      categories: [],
      ingredients: [],

      loadingRecipes: false,
      loadingCategories: false,
      loadingIngredients: false,

      mealPlans: [],
      mealPlanForm: {
        recipeId: 1,
        mealDate: '2026-07-01',
        mealType: 'Dinner',
        notes: 'Created from the Vue SPA.'
      },
      mealPlanMessage: '',
      mealPlanError: '',

      favourites: [],
      favouriteRecipeId: 1,
      favouriteMessage: '',
      favouriteError: '',

      reviews: [],
      reviewForm: {
        recipeId: 1,
        rating: 5,
        comment: 'A useful recipe from the Vue SPA.'
      },
      reviewMessage: '',
      reviewError: '',

      adminRecipeForm: {
        categoryId: 1,
        title: `Vue Created Recipe ${Date.now()}`,
        description: 'A recipe created from the Vue.js single page application.',
        instructions: 'Prepare the ingredients, cook carefully and serve while hot.',
        preparationTimeMinutes: 10,
        cookingTimeMinutes: 25,
        servings: 4,
        difficulty: 'Easy',
        isPublic: true
      },
      adminRecipeMessage: '',
      adminRecipeError: ''
    };
  },

  mounted() {
    this.loadHealth();
    this.loadRecipes();
    this.loadCategories();
    this.loadIngredients();

    if (this.token) {
      this.loadProfile();
    }
  },

  methods: {
    getRecipeImage(recipeId) {
      const images = {
        1: '/images/lentil-stew.png',
        2: '/images/rice-and-beans.png',
        3: '/images/spinach-potato-curry.png',
        4: '/images/vegetable-rice.png'
      };

      return images[recipeId] || '/images/default-recipe.png';
    },

    async apiRequest(endpoint, options = {}) {
      const headers = {
        ...(options.headers || {})
      };

      if (options.body) {
        headers['Content-Type'] = 'application/json';
      }

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    },

    formatDate(value) {
      if (!value) {
        return '';
      }

      return new Date(value).toLocaleDateString();
    },

    async loadHealth() {
      this.loadingHealth = true;
      this.errorMessage = '';

      try {
        const data = await this.apiRequest('/health');
        this.apiStatus = data.message;
      } catch (error) {
        this.apiStatus = '';
        this.errorMessage = error.message;
      } finally {
        this.loadingHealth = false;
      }
    },

    async loginUser() {
      this.loadingLogin = true;
      this.loginMessage = '';
      this.loginError = '';
      this.adminMessage = '';

      try {
        const data = await this.apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: this.loginForm.email,
            password: this.loginForm.password
          })
        });

        this.token = data.token;
        localStorage.setItem('communityKitchenToken', data.token);
        this.loginMessage = 'Login successful';

        await this.loadProfile();
      } catch (error) {
        this.loginError = error.message;
      } finally {
        this.loadingLogin = false;
      }
    },

    async loadProfile() {
      try {
        const data = await this.apiRequest('/auth/profile');
        this.profile = data.data;
      } catch (error) {
        this.profile = null;
        this.loginError = error.message;
        localStorage.removeItem('communityKitchenToken');
        this.token = '';
      }
    },

    async checkAdminAccess() {
      this.adminMessage = '';

      try {
        const data = await this.apiRequest('/auth/admin-check');
        this.adminMessage = data.message;
      } catch (error) {
        this.adminMessage = '';
        this.loginError = error.message;
      }
    },

    logout() {
      this.token = '';
      this.profile = null;
      this.loginMessage = '';
      this.loginError = '';
      this.adminMessage = '';
      localStorage.removeItem('communityKitchenToken');
    },

    async loadRecipes() {
      this.loadingRecipes = true;

      try {
        const data = await this.apiRequest('/recipes');
        this.recipes = data.data;
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loadingRecipes = false;
      }
    },

    async loadCategories() {
      this.loadingCategories = true;

      try {
        const data = await this.apiRequest('/categories');
        this.categories = data.data;
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loadingCategories = false;
      }
    },

    async loadIngredients() {
      this.loadingIngredients = true;

      try {
        const data = await this.apiRequest('/ingredients');
        this.ingredients = data.data;
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loadingIngredients = false;
      }
    },

    async loadMealPlans() {
      this.mealPlanError = '';
      this.mealPlanMessage = '';

      try {
        const data = await this.apiRequest('/meal-plans');
        this.mealPlans = data.data;
      } catch (error) {
        this.mealPlanError = error.message;
      }
    },

    async createMealPlan() {
      this.mealPlanError = '';
      this.mealPlanMessage = '';

      try {
        const data = await this.apiRequest('/meal-plans', {
          method: 'POST',
          body: JSON.stringify(this.mealPlanForm)
        });

        this.mealPlanMessage = data.message;
        await this.loadMealPlans();
      } catch (error) {
        this.mealPlanError = error.message;
      }
    },

    async loadFavourites() {
      this.favouriteError = '';
      this.favouriteMessage = '';

      try {
        const data = await this.apiRequest('/favourites');
        this.favourites = data.data;
      } catch (error) {
        this.favouriteError = error.message;
      }
    },

    async addFavourite() {
      this.favouriteError = '';
      this.favouriteMessage = '';

      try {
        const data = await this.apiRequest('/favourites', {
          method: 'POST',
          body: JSON.stringify({
            recipeId: this.favouriteRecipeId
          })
        });

        this.favouriteMessage = data.message;
        await this.loadFavourites();
      } catch (error) {
        this.favouriteError = error.message;
      }
    },

    async removeFavourite(recipeId) {
      this.favouriteError = '';
      this.favouriteMessage = '';

      try {
        const data = await this.apiRequest(`/favourites/${recipeId}`, {
          method: 'DELETE'
        });

        this.favouriteMessage = data.message;
        await this.loadFavourites();
      } catch (error) {
        this.favouriteError = error.message;
      }
    },

    async loadReviews() {
      this.reviewError = '';
      this.reviewMessage = '';

      try {
        const data = await this.apiRequest(`/recipes/${this.reviewForm.recipeId}/reviews`);
        this.reviews = data.data;
      } catch (error) {
        this.reviewError = error.message;
      }
    },

    async createReview() {
      this.reviewError = '';
      this.reviewMessage = '';

      try {
        const data = await this.apiRequest(`/recipes/${this.reviewForm.recipeId}/reviews`, {
          method: 'POST',
          body: JSON.stringify({
            rating: this.reviewForm.rating,
            comment: this.reviewForm.comment
          })
        });

        this.reviewMessage = data.message;
        await this.loadReviews();
      } catch (error) {
        this.reviewError = error.message;
      }
    },

    async createAdminRecipe() {
      this.adminRecipeError = '';
      this.adminRecipeMessage = '';

      try {
        const data = await this.apiRequest('/recipes', {
          method: 'POST',
          body: JSON.stringify(this.adminRecipeForm)
        });

        this.adminRecipeMessage = data.message;
        this.adminRecipeForm.title = `Vue Created Recipe ${Date.now()}`;

        await this.loadRecipes();
      } catch (error) {
        this.adminRecipeError = error.message;
      }
    }
  }
};
</script>