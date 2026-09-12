/* ==========================================================
   CulinaryCraft — Interactive Recipe Maker Engine + Gemini AI
   ========================================================== */

(function () {
  'use strict';

  // --- State Management ---
  const configKey = (typeof window.CONFIG !== 'undefined' && window.CONFIG?.GEMINI_API_KEY) ? window.CONFIG.GEMINI_API_KEY : '';
  const configModel = (typeof window.CONFIG !== 'undefined' && window.CONFIG?.GEMINI_MODEL) ? window.CONFIG.GEMINI_MODEL : 'gemini-1.5-flash';

  const state = {
    ingredients: [],
    dietPreference: 'veg',
    mealType: 'all',
    sortBy: 'match',
    favorites: JSON.parse(localStorage.getItem('culinary_favs') || '[]'),
    geminiApiKey: configKey || localStorage.getItem('culinary_gemini_key') || '',
    geminiModel: configModel || localStorage.getItem('culinary_gemini_model') || 'gemini-1.5-flash',
    activeRecipe: null,
    activeServings: 2,
    timerInterval: null,
    timerRemaining: 0,
    timerPaused: false
  };

  // --- DOM Elements ---
  const el = {
    ingredientInput: document.getElementById('ingredientInput'),
    addIngredientBtn: document.getElementById('addIngredientBtn'),
    tagsContainer: document.getElementById('tagsContainer'),
    dietPreference: document.getElementById('dietPreference'),
    mealType: document.getElementById('mealType'),
    generateBtn: document.getElementById('generateBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    quickSuggestions: document.getElementById('quickSuggestions'),
    heroSection: document.getElementById('heroSection'),
    discoverBtn: document.getElementById('discoverBtn'),
    recipeWorkshop: document.getElementById('recipeWorkshop'),
    generatorBox: document.getElementById('generatorBox'),
    mainFooter: document.getElementById('mainFooter'),
    backToHomeBtn: document.getElementById('backToHomeBtn'),
    navHomeBtn: document.getElementById('navHomeBtn'),
    navDiscoverBtn: document.getElementById('navDiscoverBtn'),
    navLogoBtn: document.getElementById('navLogoBtn'),
    headerStartBtn: document.getElementById('headerStartBtn'),
    resultsSection: document.getElementById('resultsSection'),
    recipesGrid: document.getElementById('recipesGrid'),
    resultsCount: document.getElementById('resultsCount'),
    activeFiltersBar: document.getElementById('activeFiltersBar'),
    sortBy: document.getElementById('sortBy'),
    backToSearchBtn: document.getElementById('backToSearchBtn'),
    recipeModal: document.getElementById('recipeModal'),
    modalContent: document.getElementById('modalContent'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    favBtn: document.getElementById('favoritesBtn'),
    favCount: document.getElementById('favCount'),
    favDrawer: document.getElementById('favDrawer'),
    favListContainer: document.getElementById('favListContainer'),
    closeDrawerBtn: document.getElementById('closeDrawerBtn'),
    themeToggle: document.getElementById('themeToggle'),
    toastContainer: document.getElementById('toastContainer'),
    floatingTimer: document.getElementById('floatingTimer'),
    timerDigits: document.getElementById('timerDigits'),
    pauseTimerBtn: document.getElementById('pauseTimerBtn'),
    stopTimerBtn: document.getElementById('stopTimerBtn'),
    aiLoadingOverlay: document.getElementById('aiLoadingOverlay'),
    aiLoadingSub: document.getElementById('aiLoadingSub')
  };

  // --- View Switcher Controller ---
  function switchView(viewName) {
    if (viewName === 'studio') {
      document.body.classList.remove('landing-view-active');
      document.body.classList.add('studio-view-active');
      if (el.heroSection) el.heroSection.style.display = 'none';
      if (el.recipeWorkshop) el.recipeWorkshop.style.display = 'block';
      if (el.mainFooter) el.mainFooter.style.display = 'block';

      if (el.navHomeBtn) el.navHomeBtn.classList.remove('active');
      if (el.navDiscoverBtn) el.navDiscoverBtn.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        if (el.ingredientInput) el.ingredientInput.focus();
      }, 400);
    } else {
      document.body.classList.remove('studio-view-active');
      document.body.classList.add('landing-view-active');
      if (el.heroSection) el.heroSection.style.display = 'flex';
      if (el.recipeWorkshop) el.recipeWorkshop.style.display = 'none';
      if (el.mainFooter) el.mainFooter.style.display = 'none';

      if (el.navHomeBtn) el.navHomeBtn.classList.add('active');
      if (el.navDiscoverBtn) el.navDiscoverBtn.classList.remove('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --- Initialize App ---
  async function init() {
    setupTheme();
    setupEventListeners();
    updateFavCount();
    await loadEnvFile();
    renderTags();
    updateQuickChips();
  }

  // --- Try loading from .env if running on local server ---
  async function loadEnvFile() {
    if (state.geminiApiKey) return;
    try {
      const res = await fetch('.env');
      if (res.ok) {
        const text = await res.text();
        const lines = text.split('\n');
        for (const line of lines) {
          const matchKey = line.match(/^GEMINI_API_KEY=(.+)$/);
          if (matchKey && matchKey[1].trim()) {
            state.geminiApiKey = matchKey[1].trim().replace(/^['"]|['"]$/g, '');
          }
          const matchModel = line.match(/^GEMINI_MODEL=(.+)$/);
          if (matchModel && matchModel[1].trim()) {
            state.geminiModel = matchModel[1].trim().replace(/^['"]|['"]$/g, '');
          }
        }
      }
    } catch (e) {
      // Ignored for file:// protocol
    }
  }

  // --- Theme Handling ---
  function setupTheme() {
    const savedTheme = localStorage.getItem('culinary_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('culinary_theme', next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    if (el.themeToggle) {
      el.themeToggle.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
    }
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    // Add ingredient on Enter or Comma
    el.ingredientInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addCurrentInput();
      }
    });

    el.addIngredientBtn.addEventListener('click', addCurrentInput);

    // Quick chips click
    el.quickSuggestions.addEventListener('click', (e) => {
      const chip = e.target.closest('.quick-chip');
      if (!chip) return;
      const item = chip.getAttribute('data-item');
      if (item && !state.ingredients.some(i => i.toLowerCase() === item.toLowerCase())) {
        addIngredient(item);
      }
    });

    // Clear all
    el.clearAllBtn.addEventListener('click', () => {
      state.ingredients = [];
      renderTags();
      updateQuickChips();
      showToast('All ingredients cleared', 'info');
    });

    // Generate Recipes
    el.generateBtn.addEventListener('click', handleGenerateRecipes);

    // Diet & Sort changes
    el.dietPreference.addEventListener('change', (e) => {
      state.dietPreference = e.target.value;
    });

    el.mealType.addEventListener('change', (e) => {
      state.mealType = e.target.value;
    });

    el.sortBy.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      if (state.lastSearchResults) {
        renderRecipeCards(state.lastSearchResults);
      }
    });

    // View Transitions: Discover / Start Cooking
    if (el.discoverBtn) {
      el.discoverBtn.addEventListener('click', () => switchView('studio'));
    }
    if (el.headerStartBtn) {
      el.headerStartBtn.addEventListener('click', () => switchView('studio'));
    }
    if (el.navDiscoverBtn) {
      el.navDiscoverBtn.addEventListener('click', () => switchView('studio'));
    }

    // View Transitions: Return to Home
    if (el.navHomeBtn) {
      el.navHomeBtn.addEventListener('click', () => switchView('landing'));
    }
    if (el.navLogoBtn) {
      el.navLogoBtn.addEventListener('click', () => switchView('landing'));
    }
    if (el.backToHomeBtn) {
      el.backToHomeBtn.addEventListener('click', () => switchView('landing'));
    }

    // Back to refine inside studio
    el.backToSearchBtn.addEventListener('click', () => {
      if (el.generatorBox) {
        el.generatorBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => el.ingredientInput.focus(), 400);
      }
    });

    // Recipe Modal close
    el.closeModalBtn.addEventListener('click', closeModal);
    el.recipeModal.addEventListener('click', (e) => {
      if (e.target === el.recipeModal) closeModal();
    });

    // Favorites Drawer
    el.favBtn.addEventListener('click', openFavDrawer);
    el.closeDrawerBtn.addEventListener('click', closeFavDrawer);
    el.favDrawer.addEventListener('click', (e) => {
      if (e.target === el.favDrawer) closeFavDrawer();
    });

    // Theme toggle
    el.themeToggle.addEventListener('click', toggleTheme);

    // Timer controls
    el.pauseTimerBtn.addEventListener('click', toggleTimerPause);
    el.stopTimerBtn.addEventListener('click', stopTimer);

    // Keyboard ESC to close modal/drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        closeFavDrawer();
      }
    });
  }

  // --- Ingredient Tag Management ---
  function addCurrentInput() {
    const rawVal = el.ingredientInput.value;
    if (!rawVal.trim()) return;

    const items = rawVal.split(',').map(s => s.trim()).filter(Boolean);
    items.forEach(item => {
      if (!state.ingredients.some(i => i.toLowerCase() === item.toLowerCase())) {
        addIngredient(item);
      }
    });

    el.ingredientInput.value = '';
    el.ingredientInput.focus();
  }

  function addIngredient(name) {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    state.ingredients.push(capitalized);
    renderTags();
    updateQuickChips();
  }

  function removeIngredient(index) {
    state.ingredients.splice(index, 1);
    renderTags();
    updateQuickChips();
  }

  function renderTags() {
    if (state.ingredients.length === 0) {
      el.tagsContainer.innerHTML = '<span class="tags-empty-state"><i class="fa-solid fa-carrot" style="margin-right: 6px;"></i> No ingredients added yet. Add items above or click quick tags.</span>';
      el.clearAllBtn.style.display = 'none';
      return;
    }

    el.clearAllBtn.style.display = 'inline-block';
    el.tagsContainer.innerHTML = state.ingredients
      .map((item, idx) => `
        <span class="ingredient-tag">
          ${escapeHtml(item)}
          <button class="remove-tag" data-index="${idx}" title="Remove">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </span>
      `)
      .join('');

    // Attach remove event
    el.tagsContainer.querySelectorAll('.remove-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        removeIngredient(idx);
      });
    });
  }

  function updateQuickChips() {
    el.quickSuggestions.querySelectorAll('.quick-chip').forEach(chip => {
      const item = chip.getAttribute('data-item');
      const isAdded = state.ingredients.some(i => i.toLowerCase() === item.toLowerCase());
      chip.classList.toggle('added', isAdded);
    });
  }

  // --- Main Recipe Generator Controller ---
  async function handleGenerateRecipes() {
    if (state.ingredients.length === 0) {
      showToast('Please add at least one ingredient to generate recipes!', 'info');
      el.ingredientInput.focus();
      return;
    }

    const diet = el.dietPreference.value;
    const meal = el.mealType.value;
    const userIngredients = state.ingredients.map(i => i.toLowerCase());

    // Check if Gemini API is enabled
    if (state.geminiApiKey && state.geminiApiKey.trim()) {
      showAiLoading(`Crafting a custom recipe with ${state.ingredients.slice(0, 3).join(', ')}...`);
      try {
        const geminiRecipe = await callGeminiApi(state.ingredients, diet, meal);
        hideAiLoading();

        if (geminiRecipe) {
          // Find matching local recipes as well to display a rich menu
          const localMatches = getMatchingLocalRecipes(userIngredients, diet, meal);
          const combinedResults = [geminiRecipe, ...localMatches.filter(r => r.id !== geminiRecipe.id)];
          
          state.lastSearchResults = combinedResults;
          renderRecipeCards(combinedResults);
          el.resultsSection.style.display = 'block';
          el.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast(`✨ Crafted a personalized recipe for you!`, 'success');
          return;
        }
      } catch (err) {
        hideAiLoading();
        console.error('Recipe Generation Error:', err);
      }
    }

    // Fallback or Standard Local Matching
    let results = getMatchingLocalRecipes(userIngredients, diet, meal);

    // If no database matches exist, generate dynamic synthesis
    if (results.length === 0) {
      const dynamicRecipe = generateDynamicRecipe(state.ingredients, diet, meal);
      results = [dynamicRecipe];
    }

    state.lastSearchResults = results;
    renderRecipeCards(results);

    // Reveal and smooth scroll to results
    el.resultsSection.style.display = 'block';
    el.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`Found ${results.length} recipe suggestion${results.length === 1 ? '' : 's'}!`, 'success');
  }

  // --- Local Recipe Scorer (Strict Matching) ---
  function getMatchingLocalRecipes(userIngredients, diet, meal) {
    let candidates = RECIPES_DATA.filter(recipe => {
      if (diet === 'veg') {
        if (recipe.diet !== 'veg' && recipe.diet !== 'vegan') return false;
      } else if (diet === 'non-veg') {
        if (recipe.diet !== 'non-veg') return false;
      } else if (diet === 'vegan') {
        if (recipe.diet !== 'vegan') return false;
      }

      if (meal !== 'all') {
        if (!recipe.mealType.includes(meal)) return false;
      }

      return true;
    });

    const scored = candidates.map(recipe => {
      const keyIngs = recipe.ingredients.filter(i => i.key).map(i => i.name.toLowerCase());
      let matchedCount = 0;
      let matchedItems = [];
      let missingItems = [];

      recipe.ingredients.forEach(ing => {
        const ingName = ing.name.toLowerCase();
        const hasMatch = userIngredients.some(userIng => 
          ingName.includes(userIng) || userIng.includes(ingName)
        );

        if (hasMatch) {
          matchedCount++;
          matchedItems.push(ing.name);
        } else {
          missingItems.push(ing.name);
        }
      });

      // Require user to have all key primary ingredients for catalog matches
      const hasAllKeys = keyIngs.every(k => 
        userIngredients.some(u => k.includes(u) || u.includes(k))
      );

      const matchPercent = Math.round((matchedCount / recipe.ingredients.length) * 100);

      return {
        ...recipe,
        matchedCount,
        totalIngredients: recipe.ingredients.length,
        matchPercent,
        hasAllKeys,
        matchedItems,
        missingItems
      };
    });

    // Only include catalog recipes if there's a strong direct match (at least 60% match and has key items)
    return scored.filter(r => r.matchedCount >= 2 && r.hasAllKeys);
  }

  // --- Google Gemini API Integration ---
  async function callGeminiApi(ingredients, diet, meal) {
    const ingredientsListStr = ingredients.join(', ');

    // 1. Try Vercel Serverless Endpoint (reads GEMINI_API_KEY from Vercel Environment Variables)
    try {
      const serverlessRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, diet, meal })
      });

      if (serverlessRes.ok) {
        const recipeJson = await serverlessRes.json();
        return formatGeneratedRecipe(recipeJson, ingredients, diet, meal);
      }
    } catch (e) {
      // If /api/generate is not present (e.g. static local file://), continue to direct client call
    }

    // 2. Direct client-side API call fallback
    const apiKey = state.geminiApiKey.trim();
    const model = state.geminiModel || 'gemini-1.5-flash';

    if (!apiKey) {
      throw new Error("No API key available.");
    }

    const systemPrompt = `You are a Michelin-star Executive Chef and culinary innovator.
Your mission is to craft a completely custom, unique gourmet recipe centered STRICTLY around the user's exact pantry ingredients: [${ingredientsListStr}].

CRITICAL RULES:
1. FOCUS ON PROVIDED INGREDIENTS: The dish title, core flavor, and preparation steps MUST revolve directly around ${ingredientsListStr}.
2. DO NOT introduce unprovided primary ingredients (for example: do NOT create a Chicken or Paneer recipe if the user did not give Chicken or Paneer). You may only assume basic pantry seasonings (oil, butter, salt, pepper, common spices, water).
3. DIETARY PREFERENCE COMPLIANCE:
   - If diet is "veg": STRICTLY NO meat, chicken, beef, pork, seafood, fish, or eggs. Dairy (milk, butter, cheese) is allowed.
   - If diet is "vegan": STRICTLY 100% plant-based. NO meat, NO eggs, NO dairy, NO honey.
   - If diet is "non-veg": Meat/poultry/eggs/seafood are allowed ONLY if provided by the user or as a complement if requested.
4. VARIATION & UNIQUENESS: Every request must produce a creative, authentic recipe specifically harmonizing ${ingredientsListStr}.

You MUST reply ONLY with a valid JSON object matching this exact schema:
{
  "title": "Creative, highly appetizing dish name featuring ${ingredientsListStr}",
  "cuisine": "Authentic Cuisine style (e.g. Italian, Mediterranean, Asian, Mexican, French, Indian)",
  "diet": "${diet === 'all' ? 'veg' : diet}",
  "mealType": ["${meal === 'all' ? 'dinner' : meal}"],
  "prepTime": 15,
  "cookTime": 20,
  "servings": 2,
  "difficulty": "Easy" | "Medium" | "Hard",
  "calories": 380,
  "protein": "18g",
  "carbs": "42g",
  "fats": "14g",
  "description": "An enticing culinary description explaining how ${ingredientsListStr} are paired, textured, and flavored.",
  "ingredients": [
    { "name": "Ingredient Name", "amount": "e.g. 2 cups / 200g / 2 tbsp", "key": true }
  ],
  "instructions": [
    "Step 1: Specific prep and technique for ${ingredients[0] || 'the main item'}.",
    "Step 2: Cooking aromatics and combining ingredients...",
    "Step 3: Simmering/searing with seasonings...",
    "Step 4: Plating and finishing..."
  ],
  "tips": "A professional chef secret tip to elevate this specific dish."
}`;

    const userPrompt = `Create a gourmet recipe now for:
Available Ingredients: ${ingredientsListStr}
Diet Preference: ${diet}
Meal Type: ${meal}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt + "\n\n" + userPrompt }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.85,
        maxOutputTokens: 2048
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) {
      throw new Error("No recipe returned by model");
    }

    const recipeJson = JSON.parse(candidate);

    // If recipe doesn't already have an image from API, generate dish-tailored AI photo
    if (!recipeJson.image) {
      try {
        recipeJson.image = await generateDishImage(recipeJson.title, ingredients, apiKey);
      } catch (e) {
        recipeJson.image = createDynamicFoodPhotoUrl(recipeJson.title, ingredients);
      }
    }

    return formatGeneratedRecipe(recipeJson, ingredients, diet, meal);
  }

  // --- AI Image Generator (Gemini Imagen 3 + Real-Time Generative Fallback) ---
  async function generateDishImage(dishTitle, ingredients, apiKey) {
    const mainItems = (ingredients && ingredients.length > 0) ? ingredients.slice(0, 3).join(', ') : 'gourmet ingredients';
    const cleanTitle = dishTitle || 'Chef Special Creation';

    // 1. Try Google Imagen 3 API if an API key is present
    if (apiKey && apiKey.trim()) {
      try {
        const prompt = `Professional food photography of ${cleanTitle}, beautifully plated on an artisanal ceramic dish, made with ${mainItems}, 45-degree gourmet angle, soft natural restaurant lighting, ultra-sharp focus, 8k culinary magazine food style`;
        const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey.trim()}`;
        const res = await fetch(imagenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: prompt }],
            parameters: { sampleCount: 1, aspectRatio: '4:3', outputMimeType: 'image/jpeg' }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const base64 = data.predictions?.[0]?.bytesBase64Encoded;
          if (base64) {
            return `data:image/jpeg;base64,${base64}`;
          }
        }
      } catch (err) {
        console.warn('Direct Imagen 3 generation notice:', err);
      }
    }

    // 2. Real-time Generative AI Dish Photo based on exact recipe requirements
    return createDynamicFoodPhotoUrl(cleanTitle, ingredients);
  }

  function createDynamicFoodPhotoUrl(dishTitle, ingredients) {
    const items = (ingredients && ingredients.length) ? ingredients.slice(0, 3).join(' ') : 'gourmet';
    const seed = Math.floor(Math.random() * 900000) + 100000;
    const promptStr = encodeURIComponent(`delicious appetizing gourmet ${dishTitle}, cooked with ${items}, restaurant plating, warm lighting, professional food photography, 4k`);
    return `https://image.pollinations.ai/prompt/${promptStr}?width=800&height=600&nologo=true&seed=${seed}`;
  }

  // --- Recipe Formatting Helper ---
  function formatGeneratedRecipe(recipeJson, ingredients, diet, meal) {
    const userIngredientsLower = ingredients.map(i => i.toLowerCase());
    let matchedCount = 0;
    const recipeIngredients = recipeJson.ingredients || [];

    recipeIngredients.forEach(ing => {
      const nameLower = ing.name.toLowerCase();
      if (userIngredientsLower.some(u => nameLower.includes(u) || u.includes(nameLower))) {
        matchedCount++;
      }
    });

    const image = recipeJson.image || createDynamicFoodPhotoUrl(recipeJson.title, ingredients);

    return {
      id: `custom_${Date.now()}`,
      title: recipeJson.title || `Chef's Custom ${ingredients.slice(0, 2).join(' & ')} Creation`,
      cuisine: recipeJson.cuisine || "Fusion Gourmet",
      diet: recipeJson.diet || (diet === 'all' ? 'veg' : diet),
      mealType: recipeJson.mealType || [meal === 'all' ? 'dinner' : meal],
      prepTime: recipeJson.prepTime || 15,
      cookTime: recipeJson.cookTime || 20,
      servings: recipeJson.servings || 2,
      difficulty: recipeJson.difficulty || "Medium",
      calories: recipeJson.calories || 360,
      protein: recipeJson.protein || "18g",
      carbs: recipeJson.carbs || "40g",
      fats: recipeJson.fats || "14g",
      image: image,
      description: recipeJson.description || `A bespoke culinary creation centering around ${ingredients.join(', ')}.`,
      ingredients: recipeIngredients,
      instructions: recipeJson.instructions || [],
      tips: recipeJson.tips || "Serve piping hot and garnish with freshly cracked black pepper.",
      matchedCount: matchedCount || ingredients.length,
      totalIngredients: recipeIngredients.length || ingredients.length,
      matchPercent: Math.round(((matchedCount || ingredients.length) / (recipeIngredients.length || ingredients.length)) * 100),
      isCustomSpecial: true
    };
  }

  // --- Dynamic Smart Fallback Generator (Ingredient-Tailored Procedural Synthesis) ---
  function generateDynamicRecipe(ingredients, diet, meal) {
    const lowerIngs = ingredients.map(i => i.toLowerCase());
    
    // Categorize items
    const hasEggs = lowerIngs.some(i => i.includes('egg'));
    const hasChicken = lowerIngs.some(i => i.includes('chicken'));
    const hasPaneer = lowerIngs.some(i => i.includes('paneer'));
    const hasCheese = lowerIngs.some(i => i.includes('cheese'));
    const hasPotato = lowerIngs.some(i => i.includes('potato'));
    const hasRice = lowerIngs.some(i => i.includes('rice'));
    const hasPasta = lowerIngs.some(i => i.includes('pasta') || i.includes('noodle'));
    const hasSpinach = lowerIngs.some(i => i.includes('spinach') || i.includes('palak'));
    const hasMushroom = lowerIngs.some(i => i.includes('mushroom'));
    const hasTomato = lowerIngs.some(i => i.includes('tomato'));
    const hasGarlic = lowerIngs.some(i => i.includes('garlic'));
    const hasOnion = lowerIngs.some(i => i.includes('onion'));

    let dishTitle = "";
    let cuisine = "Continental";
    let cookingTime = 15;
    let prepTime = 10;
    let instructions = [];

    // Synthesize tailored title and cooking steps based on actual user ingredients
    if (hasEggs && hasSpinach) {
      dishTitle = "Fluffy Garlic Butter Spinach & Herb Egg Scramble";
      cuisine = "French Bistro";
      cookingTime = 10;
      instructions = [
        "Wash spinach leaves thoroughly and roughly chop. Mince garlic cloves.",
        "Heat butter in a non-stick skillet over medium heat; sauté garlic and spinach for 2 minutes until wilted and excess moisture evaporates.",
        "Whisk eggs in a bowl with salt, black pepper, and a pinch of herbs.",
        "Pour whisked eggs into the pan with spinach. Stir gently on low heat with a spatula until silky, soft curds form.",
        "Remove from heat immediately while still creamy and serve warm with toast."
      ];
    } else if (hasChicken && hasRice) {
      dishTitle = "One-Skillet Garlic Butter Seared Chicken & Fragrant Rice";
      cuisine = "Mediterranean";
      cookingTime = 25;
      instructions = [
        "Cut chicken into bite-sized cubes and season with salt, pepper, and garlic powder.",
        "Sear chicken in hot oil/butter in a deep skillet for 5 minutes until golden brown on all sides. Remove chicken.",
        "In the same skillet, sauté diced onions and garlic until fragrant.",
        "Add rice and toast for 2 minutes, then pour in warm broth or water (2:1 ratio to rice).",
        "Return chicken to the skillet, cover tightly with a lid, and simmer on low for 15-18 minutes until rice is fluffy and tender.",
        "Rest for 5 minutes, fluff with a fork, and serve hot."
      ];
    } else if (hasPasta && (hasTomato || hasGarlic || hasCheese)) {
      dishTitle = "Rustic Sautéed Garlic & Blistered Tomato Tossed Pasta";
      cuisine = "Italian";
      cookingTime = 15;
      instructions = [
        "Boil pasta in salted water according to package instructions until al dente. Reserve 1/2 cup pasta water and drain.",
        "Heat olive oil in a skillet, sauté sliced garlic until light golden and fragrant.",
        "Add chopped or cherry tomatoes with salt and chili flakes. Cook on medium-high for 5 minutes until bursting and juicy.",
        "Toss the drained pasta directly into the tomato garlic reduction along with 2 tbsp reserved pasta water.",
        hasCheese ? "Fold in cheese until melted and glossy. Garnish with black pepper and herbs." : "Toss continuously for 1 minute until pasta is thoroughly coated with the pan sauce."
      ];
    } else if (hasPotato && hasCheese) {
      dishTitle = "Crispy Golden Skillet Herb Potato & Melted Cheese Bake";
      cuisine = "Alpine Style";
      cookingTime = 20;
      instructions = [
        "Thinly slice or grate potatoes and squeeze out excess moisture with a clean towel.",
        "Melt butter in a heavy skillet. Layer seasoned potatoes with diced onions and garlic.",
        "Cook over medium heat for 8-10 minutes until a deeply golden crispy bottom crust forms.",
        "Flip or stir to crisp the other side, then scatter shredded cheese evenly over the top.",
        "Cover with a lid for 3-4 minutes until cheese is completely melted, bubbling, and gooey."
      ];
    } else if (hasMushroom && (hasGarlic || hasOnion || hasRice)) {
      dishTitle = "Caramelized Garlic Herb Mushroom & Onion Sauté";
      cuisine = "Continental";
      cookingTime = 15;
      instructions = [
        "Slice mushrooms uniformly. Finely dice onions and mince garlic.",
        "Heat butter or olive oil in a skillet over high heat (essential for browning mushrooms instead of steaming).",
        "Add mushrooms and sear undisturbed for 3-4 minutes until golden brown.",
        "Toss in garlic, onions, salt, and black pepper. Sauté for 3 minutes until onions soften and aromas release.",
        "Finish with a splash of lemon juice and fresh chopped herbs before serving."
      ];
    } else if (hasPaneer && (hasTomato || hasOnion || hasSpinach)) {
      dishTitle = hasSpinach ? "Velvety Garlic Spinach Tossed Paneer Cubes" : "Pan-Seared Spiced Tomato & Onion Glazed Paneer";
      cuisine = "Indian Gourmet";
      cookingTime = 18;
      instructions = [
        "Cut paneer into 1-inch cubes and soak in warm water for 5 minutes for pillow-soft texture.",
        "Sauté chopped onions and garlic in butter or ghee until golden brown.",
        "Add chopped tomatoes and ground spices (turmeric, cumin, garam masala). Cook until a thick savory masala forms.",
        hasSpinach ? "Add chopped spinach and sauté for 3 minutes until tender and integrated." : "Add 3 tbsp water to loosen the masala glaze.",
        "Gently toss in paneer cubes to coat thoroughly. Simmer on low heat for 4 minutes and serve hot."
      ];
    } else {
      // General tailored procedural synthesis for any custom list
      const mainItem = ingredients[0];
      const otherItems = ingredients.slice(1);
      dishTitle = `Chef's Artisanal ${ingredients.slice(0, 3).join(' & ')} Medley`;
      cuisine = diet === 'veg' ? "Modern Vegetarian" : "Gourmet Kitchen";
      cookingTime = 15;
      instructions = [
        `Wash and prepare all fresh ingredients (${ingredients.join(', ')}), cutting them into uniform bite-sized pieces.`,
        `Heat 2 tbsp oil or butter in a wide skillet over medium-high heat until hot and shimmering.`,
        `Sauté base aromatics (garlic, onion) first for 1-2 minutes until fragrant.`,
        `Add ${mainItem} and sear for 4-5 minutes to develop color and texture.`,
        otherItems.length > 0 ? `Incorporate ${otherItems.join(' and ')} along with salt, freshly cracked pepper, and herbs. Cook for 4-5 minutes until tender.` : `Season with salt, pepper, and herbs, tossing continuously.`,
        `Simmer on low heat for 2 minutes to allow flavors to harmonize, then remove from heat and serve hot.`
      ];
    }

    const allIngredients = [
      ...ingredients.map(i => ({ name: i, amount: "As desired", key: true })),
      { name: "Olive Oil or Butter", amount: "2 tbsp", key: false },
      { name: "Salt & Fresh Cracked Pepper", amount: "To taste", key: false },
      { name: "Fresh Herb Garnish", amount: "1 tbsp", key: false }
    ];

    const image = createDynamicFoodPhotoUrl(dishTitle, ingredients);

    return {
      id: `custom_${Date.now()}`,
      title: dishTitle,
      cuisine: cuisine,
      diet: diet === 'all' ? 'veg' : diet,
      mealType: [meal === 'all' ? 'dinner' : meal],
      prepTime: prepTime,
      cookTime: cookingTime,
      servings: 2,
      difficulty: "Easy",
      calories: 330,
      protein: diet === 'non-veg' ? "22g" : "14g",
      carbs: "28g",
      fats: "15g",
      image: image,
      description: `A custom culinary creation specifically combining ${ingredients.join(', ')} with savory seasonings and chef-level technique.`,
      ingredients: allIngredients,
      instructions: instructions,
      tips: "For maximum flavor, sear ingredients over high heat initially before reducing to simmer.",
      matchedCount: ingredients.length,
      totalIngredients: allIngredients.length,
      matchPercent: 100,
      matchedItems: ingredients,
      missingItems: ["Olive Oil or Butter", "Salt & Fresh Cracked Pepper"],
      isCustomSpecial: true
    };
  }

  // --- Render Recipe Grid Cards ---
  function renderRecipeCards(recipes) {
    // Sort
    const sorted = [...recipes].sort((a, b) => {
      if (a.isCustomSpecial) return -1;
      if (b.isCustomSpecial) return 1;

      if (state.sortBy === 'match') {
        return (b.matchPercent || 0) - (a.matchPercent || 0);
      } else if (state.sortBy === 'time') {
        return (a.cookTime + a.prepTime) - (b.cookTime + b.prepTime);
      } else if (state.sortBy === 'difficulty') {
        const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return (order[a.difficulty] || 2) - (order[b.difficulty] || 2);
      } else if (state.sortBy === 'calories') {
        return a.calories - b.calories;
      }
      return 0;
    });

    // Update Counts & Badges
    el.resultsCount.textContent = `Found ${sorted.length} delicious recipe${sorted.length === 1 ? '' : 's'} based on your pantry`;
    renderActiveFilterBadges();

    if (sorted.length === 0) {
      el.recipesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-kitchen-set"></i></div>
          <h3>No matching recipes found</h3>
          <p>Try adding more pantry staples like Garlic, Tomato, Onion, Rice, or Eggs.</p>
        </div>
      `;
      return;
    }

    el.recipesGrid.innerHTML = sorted.map(recipe => {
      const isFav = state.favorites.some(f => f.id === recipe.id);
      const dietClass = recipe.diet === 'veg' ? 'diet-veg' : recipe.diet === 'vegan' ? 'diet-vegan' : 'diet-non-veg';
      const dietLabel = recipe.diet === 'veg' ? '🌱 Vegetarian' : recipe.diet === 'vegan' ? '🌿 Vegan' : '🍗 Non-Veg';

      return `
        <div class="recipe-card" data-id="${recipe.id}">
          <div class="card-img-wrapper">
            <img src="${recipe.image}" alt="${escapeHtml(recipe.title)}" class="card-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';" />
            <span class="card-diet-badge ${dietClass}">${dietLabel}</span>
            <button class="card-fav-btn ${isFav ? 'active' : ''}" data-fav-id="${recipe.id}" title="${isFav ? 'Remove Favorite' : 'Save Favorite'}">
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
          </div>

          <div class="card-body">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.3rem;">
              <span class="card-cuisine">${escapeHtml(recipe.cuisine)}</span>
              ${(recipe.isCustomSpecial || recipe.isCustomGenerated) ? `
                <span class="gemini-sparkle-tag"><i class="fa-solid fa-wand-magic-sparkles"></i> Chef's Creation</span>
              ` : ''}
            </div>

            <h3 class="card-title">${escapeHtml(recipe.title)}</h3>
            <p class="card-desc">${escapeHtml(recipe.description)}</p>

            <!-- Match Score Progress -->
            <div class="match-box">
              <div class="match-info">
                <span><i class="fa-solid fa-circle-check" style="color: var(--accent-primary);"></i> You have ${recipe.matchedCount || 1}/${recipe.totalIngredients || recipe.ingredients.length} items</span>
                <span>${recipe.matchPercent || 85}% Match</span>
              </div>
              <div class="match-bar-bg">
                <div class="match-bar-fill" style="width: ${recipe.matchPercent || 85}%;"></div>
              </div>
            </div>

            <div class="card-meta">
              <span class="meta-item"><i class="fa-regular fa-clock"></i> ${recipe.prepTime + recipe.cookTime} mins</span>
              <span class="meta-item"><i class="fa-solid fa-gauge"></i> ${recipe.difficulty}</span>
              <span class="meta-item"><i class="fa-solid fa-fire"></i> ${recipe.calories} kcal</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card click handlers
    el.recipesGrid.querySelectorAll('.recipe-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-fav-btn')) return;
        const recipeId = card.getAttribute('data-id');
        const selected = sorted.find(r => r.id === recipeId) || RECIPES_DATA.find(r => r.id === recipeId);
        if (selected) openModal(selected);
      });
    });

    // Attach Fav Click handlers
    el.recipesGrid.querySelectorAll('.card-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const recipeId = btn.getAttribute('data-fav-id');
        const selected = sorted.find(r => r.id === recipeId) || RECIPES_DATA.find(r => r.id === recipeId);
        if (selected) toggleFavorite(selected);
      });
    });
  }

  function renderActiveFilterBadges() {
    const dietText = el.dietPreference.options[el.dietPreference.selectedIndex].text;
    const mealText = el.mealType.options[el.mealType.selectedIndex].text;

    el.activeFiltersBar.innerHTML = `
      <span class="filter-badge"><i class="fa-solid fa-filter"></i> ${dietText}</span>
      <span class="filter-badge"><i class="fa-solid fa-utensils"></i> ${mealText}</span>
      <span class="filter-badge"><i class="fa-solid fa-layer-group"></i> ${state.ingredients.length} Pantry Items</span>
    `;
  }

  // --- Recipe Modal Presentation ---
  function openModal(recipe) {
    state.activeRecipe = recipe;
    state.activeServings = recipe.servings || 2;
    renderModalContent();
    el.recipeModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    el.recipeModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function renderModalContent() {
    const r = state.activeRecipe;
    if (!r) return;

    const baseServings = r.servings || 2;
    const scale = state.activeServings / baseServings;

    const isFav = state.favorites.some(f => f.id === r.id);
    const userIngredientsLower = state.ingredients.map(i => i.toLowerCase());

    el.modalContent.innerHTML = `
      <div class="modal-header-hero">
        <img src="${r.image}" alt="${escapeHtml(r.title)}" class="modal-hero-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';" />
        <div class="modal-hero-overlay">
          <div style="display: flex; gap: 0.5rem; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; width: 100%;">
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <span class="badge-pill" style="margin-bottom: 0; background: rgba(0,0,0,0.6); color: #fff;">
                ${escapeHtml(r.cuisine)} • ${r.difficulty}
              </span>
              ${(r.isCustomSpecial || r.isCustomGenerated) ? `
                <span class="gemini-sparkle-tag" style="background: rgba(16, 185, 129, 0.85); color: #fff;">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> Chef's Creation
                </span>
              ` : ''}
            </div>
            <button class="ai-regenerate-photo-btn" id="regeneratePhotoBtn" title="Generate New AI Photo for this Recipe">
              <i class="fa-solid fa-wand-magic-sparkles"></i> New AI Photo
            </button>
          </div>
          <h2 class="modal-hero-title">${escapeHtml(r.title)}</h2>
          <p class="modal-hero-subtitle">${escapeHtml(r.description)}</p>
        </div>
      </div>

      <div class="modal-content-inner">
        <!-- Nutrition Cards -->
        <div class="nutrition-grid">
          <div class="nutrition-card">
            <span class="nutrition-value">${Math.round(r.calories * scale)}</span>
            <span class="nutrition-label">Calories</span>
          </div>
          <div class="nutrition-card">
            <span class="nutrition-value">${r.protein}</span>
            <span class="nutrition-label">Protein</span>
          </div>
          <div class="nutrition-card">
            <span class="nutrition-value">${r.carbs}</span>
            <span class="nutrition-label">Carbs</span>
          </div>
          <div class="nutrition-card">
            <span class="nutrition-value">${r.fats}</span>
            <span class="nutrition-label">Fats</span>
          </div>
        </div>

        <!-- Servings Scaler -->
        <div class="servings-controller">
          <div>
            <strong><i class="fa-solid fa-users"></i> Serving Size:</strong>
            <span style="font-size: 0.88rem; color: var(--text-muted); margin-left: 0.5rem;">(Ingredients scale automatically)</span>
          </div>
          <div class="servings-btn-group">
            <button class="servings-btn" id="decServingsBtn">-</button>
            <span class="servings-count" id="servingsDisplay">${state.activeServings}</span>
            <button class="servings-btn" id="incServingsBtn">+</button>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="modal-details-grid">
          <!-- Ingredients Column -->
          <div>
            <h3 class="detail-section-title">
              <i class="fa-solid fa-list-check"></i> Ingredients
            </h3>
            <ul class="ingredients-checklist">
              ${r.ingredients.map(ing => {
                const ingLower = ing.name.toLowerCase();
                const hasItem = userIngredientsLower.some(u => ingLower.includes(u) || u.includes(ingLower));
                return `
                  <li class="ingredient-check-item ${hasItem ? 'in-pantry' : 'missing'}">
                    <i class="fa-solid ${hasItem ? 'fa-check text-success' : 'fa-circle-plus'}" style="color: ${hasItem ? 'var(--accent-primary)' : 'var(--accent-secondary)'}; font-size: 0.85rem;"></i>
                    <span><strong>${scaleAmount(ing.amount, scale)}</strong> ${escapeHtml(ing.name)}</span>
                    <span class="pantry-badge ${hasItem ? 'have' : 'need'}">${hasItem ? 'In Pantry' : 'Needed'}</span>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>

          <!-- Instructions Column -->
          <div>
            <h3 class="detail-section-title">
              <i class="fa-solid fa-fire-burner"></i> Step-by-Step Directions
            </h3>
            <ul class="instructions-steps">
              ${r.instructions.map((step, idx) => `
                <li class="step-item">
                  <span class="step-number">${idx + 1}</span>
                  <div class="step-text">${escapeHtml(step)}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Chef Tip -->
        ${r.tips ? `
          <div class="chef-tip-box">
            <i class="fa-solid fa-lightbulb chef-tip-icon"></i>
            <div class="chef-tip-text">
              <strong>Chef's Secret Tip:</strong> ${escapeHtml(r.tips)}
            </div>
          </div>
        ` : ''}

        <!-- Footer Action Buttons -->
        <div class="modal-footer-actions">
          <div class="modal-action-group">
            <button class="btn-ghost" id="startCookTimerBtn">
              <i class="fa-solid fa-stopwatch"></i> Start ${r.cookTime}m Timer
            </button>
            <button class="btn-ghost" id="copyShoppingListBtn">
              <i class="fa-solid fa-copy"></i> Copy Missing Items
            </button>
          </div>
          <div class="modal-action-group">
            <button class="btn-ghost" id="printRecipeBtn">
              <i class="fa-solid fa-print"></i> Print Recipe
            </button>
            <button class="btn-primary" id="modalFavBtn">
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i> ${isFav ? 'Saved' : 'Save to Favorites'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Servings Scaling Buttons
    document.getElementById('decServingsBtn').addEventListener('click', () => {
      if (state.activeServings > 1) {
        state.activeServings--;
        renderModalContent();
      }
    });

    document.getElementById('incServingsBtn').addEventListener('click', () => {
      if (state.activeServings < 12) {
        state.activeServings++;
        renderModalContent();
      }
    });

    // AI Photo Regeneration Button
    const regenBtn = document.getElementById('regeneratePhotoBtn');
    if (regenBtn) {
      regenBtn.addEventListener('click', async () => {
        regenBtn.disabled = true;
        regenBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        try {
          const newImg = await generateDishImage(r.title, state.ingredients, state.geminiApiKey);
          r.image = newImg;
          
          const modalHeroImg = el.modalContent.querySelector('.modal-hero-img');
          if (modalHeroImg) modalHeroImg.src = newImg;

          // Update grid card image if visible
          const cardImg = el.recipesGrid.querySelector(`[data-id="${r.id}"] .card-img`);
          if (cardImg) cardImg.src = newImg;

          // Update in favorites if saved
          const favIdx = state.favorites.findIndex(f => f.id === r.id);
          if (favIdx > -1) {
            state.favorites[favIdx].image = newImg;
            localStorage.setItem('culinary_favs', JSON.stringify(state.favorites));
          }

          showToast('✨ Updated recipe with fresh AI photo!', 'success');
        } catch (e) {
          console.error(e);
          showToast('Could not regenerate photo right now.', 'info');
        } finally {
          regenBtn.disabled = false;
          regenBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> New AI Photo';
        }
      });
    }

    // Cooking Timer Button
    document.getElementById('startCookTimerBtn').addEventListener('click', () => {
      startTimer(r.cookTime * 60, r.title);
      showToast(`Started ${r.cookTime} minute cooking timer!`, 'success');
    });

    // Copy missing ingredients
    document.getElementById('copyShoppingListBtn').addEventListener('click', () => {
      const missing = r.ingredients
        .filter(ing => !userIngredientsLower.some(u => ing.name.toLowerCase().includes(u)))
        .map(ing => `• ${ing.amount} ${ing.name}`)
        .join('\n');

      if (!missing) {
        showToast('You have all the ingredients for this recipe! 🎉', 'success');
        return;
      }

      navigator.clipboard.writeText(`Shopping List for ${r.title}:\n\n${missing}`)
        .then(() => showToast('Missing ingredients copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy', 'info'));
    });

    // Print recipe
    document.getElementById('printRecipeBtn').addEventListener('click', () => {
      window.print();
    });

    // Save Favorite inside modal
    document.getElementById('modalFavBtn').addEventListener('click', () => {
      toggleFavorite(r);
      renderModalContent();
      if (state.lastSearchResults) renderRecipeCards(state.lastSearchResults);
    });
  }

  // --- Dynamic Serving Scaler Helper ---
  function scaleAmount(amountStr, scale) {
    if (!amountStr || scale === 1) return amountStr;
    return amountStr.replace(/^([\d\/\.]+)/, (match) => {
      try {
        let num;
        if (match.includes('/')) {
          const parts = match.split('/');
          num = parseFloat(parts[0]) / parseFloat(parts[1]);
        } else {
          num = parseFloat(match);
        }
        if (isNaN(num)) return match;
        const scaled = num * scale;
        return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, '');
      } catch (e) {
        return match;
      }
    });
  }

  // --- Loading Animation Overlays ---
  function showAiLoading(subtitle) {
    if (el.aiLoadingOverlay) {
      if (el.aiLoadingSub && subtitle) el.aiLoadingSub.textContent = subtitle;
      el.aiLoadingOverlay.style.display = 'flex';
    }
  }

  function hideAiLoading() {
    if (el.aiLoadingOverlay) {
      el.aiLoadingOverlay.style.display = 'none';
    }
  }

  // --- Favorites Management ---
  function toggleFavorite(recipe) {
    const existsIndex = state.favorites.findIndex(f => f.id === recipe.id);
    if (existsIndex > -1) {
      state.favorites.splice(existsIndex, 1);
      showToast(`Removed "${recipe.title}" from favorites`, 'info');
    } else {
      state.favorites.push(recipe);
      showToast(`Saved "${recipe.title}" to favorites! ❤️`, 'success');
    }

    localStorage.setItem('culinary_favs', JSON.stringify(state.favorites));
    updateFavCount();
    if (state.lastSearchResults) renderRecipeCards(state.lastSearchResults);
    if (el.favDrawer.style.display === 'flex') renderFavoritesDrawer();
  }

  function updateFavCount() {
    el.favCount.textContent = state.favorites.length;
  }

  function openFavDrawer() {
    renderFavoritesDrawer();
    el.favDrawer.style.display = 'flex';
  }

  function closeFavDrawer() {
    el.favDrawer.style.display = 'none';
  }

  function renderFavoritesDrawer() {
    if (state.favorites.length === 0) {
      el.favListContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="fa-regular fa-heart" style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5;"></i>
          <p>No saved recipes yet.</p>
        </div>
      `;
      return;
    }

    el.favListContainer.innerHTML = state.favorites.map(recipe => `
      <div class="fav-item-card" data-fav-item-id="${recipe.id}">
        <img src="${recipe.image}" alt="${escapeHtml(recipe.title)}" class="fav-thumb" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';" />
        <div class="fav-info">
          <h4 class="fav-title">${escapeHtml(recipe.title)}</h4>
          <span class="fav-meta">${recipe.cuisine} • ${recipe.prepTime + recipe.cookTime} mins</span>
        </div>
        <button class="remove-fav-btn" style="background: transparent; border: none; color: var(--accent-danger); cursor: pointer; padding: 0.5rem;" title="Remove">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    // Attach card clicks in drawer
    el.favListContainer.querySelectorAll('.fav-item-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-fav-btn');
        const id = card.getAttribute('data-fav-item-id');
        const recipe = state.favorites.find(f => f.id === id);

        if (removeBtn) {
          e.stopPropagation();
          if (recipe) toggleFavorite(recipe);
        } else if (recipe) {
          closeFavDrawer();
          openModal(recipe);
        }
      });
    });
  }

  // --- Floating Cooking Timer ---
  function startTimer(seconds, title) {
    clearInterval(state.timerInterval);
    state.timerRemaining = seconds;
    state.timerPaused = false;

    el.floatingTimer.style.display = 'flex';
    document.getElementById('timerLabel').textContent = `${title ? title.slice(0, 16) + '...' : 'Timer'}:`;
    updateTimerDisplay();

    state.timerInterval = setInterval(() => {
      if (!state.timerPaused) {
        state.timerRemaining--;
        updateTimerDisplay();

        if (state.timerRemaining <= 0) {
          clearInterval(state.timerInterval);
          stopTimer();
          showToast(`⏰ Time's up for ${title || 'your dish'}!`, 'success');
          playTimerAlarm();
        }
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const mins = Math.floor(state.timerRemaining / 60);
    const secs = state.timerRemaining % 60;
    el.timerDigits.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function toggleTimerPause() {
    state.timerPaused = !state.timerPaused;
    el.pauseTimerBtn.innerHTML = state.timerPaused 
      ? '<i class="fa-solid fa-play"></i>' 
      : '<i class="fa-solid fa-pause"></i>';
  }

  function stopTimer() {
    clearInterval(state.timerInterval);
    el.floatingTimer.style.display = 'none';
  }

  function playTimerAlarm() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // AudioContext fallback
    }
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="${type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info'}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- Utility ---
  function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
