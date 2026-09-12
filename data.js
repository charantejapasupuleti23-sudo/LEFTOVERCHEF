// Comprehensive Culinary Recipe Database
const RECIPES_DATA = [
  // --- VEGETARIAN RECIPES ---
  {
    id: "rec_paneer_butter_masala",
    title: "Creamy Paneer Butter Masala",
    cuisine: "North Indian",
    diet: "veg",
    mealType: ["lunch", "dinner"],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    calories: 420,
    protein: "18g",
    carbs: "16g",
    fats: "32g",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    description: "Rich, luscious cottage cheese cubes simmered in a velvety spiced tomato, cashew, and butter gravy.",
    ingredients: [
      { name: "Paneer", amount: "250g", key: true },
      { name: "Tomato", amount: "4 medium", key: true },
      { name: "Onion", amount: "2 medium", key: true },
      { name: "Garlic", amount: "5 cloves", key: true },
      { name: "Ginger", amount: "1 inch piece", key: false },
      { name: "Butter", amount: "3 tbsp", key: true },
      { name: "Heavy Cream", amount: "3 tbsp", key: false },
      { name: "Cashews", amount: "12-15 nuts", key: false },
      { name: "Garam Masala", amount: "1 tsp", key: false },
      { name: "Kasuri Methi", amount: "1 tsp", key: false }
    ],
    instructions: [
      "Blend soaked cashews, chopped tomatoes, ginger, and garlic into a silky smooth puree.",
      "Melt 2 tbsp butter in a pan, sauté finely diced onions until translucent golden.",
      "Pour the tomato-cashew puree into the pan and cook on medium heat until butter separates from sides (about 8-10 mins).",
      "Add Kashmiri chili powder, turmeric, coriander powder, and garam masala. Stir well.",
      "Add 1/2 cup warm water, gently toss in cubed paneer and simmer for 5 minutes.",
      "Finish with fresh cream, crushed kasuri methi, and remaining tablespoon of butter. Serve hot with naan or rice."
    ],
    tips: "Soak paneer cubes in warm water for 10 minutes before adding to keep them pillow-soft."
  },
  {
    id: "rec_classic_margherita_pasta",
    title: "Tuscan Garlic Tomato Pasta",
    cuisine: "Italian",
    diet: "veg",
    mealType: ["lunch", "dinner"],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: "Easy",
    calories: 380,
    protein: "14g",
    carbs: "62g",
    fats: "9g",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    description: "Al dente pasta coated in a fragrant roasted garlic, ripe tomato, and fresh basil olive oil emulsion.",
    ingredients: [
      { name: "Pasta", amount: "200g (Penne or Spaghetti)", key: true },
      { name: "Tomato", amount: "3 ripe or cherry tomatoes", key: true },
      { name: "Garlic", amount: "4 cloves sliced", key: true },
      { name: "Olive Oil", amount: "2 tbsp", key: true },
      { name: "Cheese", amount: "1/4 cup grated Parmesan or Mozzarella", key: false },
      { name: "Basil", amount: "a handful fresh leaves", key: false },
      { name: "Chili Flakes", amount: "1/2 tsp", key: false }
    ],
    instructions: [
      "Boil salted water in a large pot, cook pasta until al dente according to package instructions. Reserve 1/2 cup pasta water.",
      "Heat olive oil in a skillet over low-medium heat; sauté sliced garlic and chili flakes for 1 minute until fragrant.",
      "Add diced tomatoes and a pinch of salt. Cook until softened and bursting with juices (about 5-7 mins).",
      "Transfer drained pasta directly into the sauce along with 2 tbsp of reserved starchy water.",
      "Toss vigorously to create a silky glaze. Stir in torn basil and grated cheese before serving."
    ],
    tips: "Always cook pasta in well-salted boiling water for optimal seasoning inside the pasta itself."
  },
  {
    id: "rec_crispy_potato_rosti",
    title: "Golden Crispy Herb Potato Hash",
    cuisine: "Continental",
    diet: "veg",
    mealType: ["breakfast", "snack"],
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: "Easy",
    calories: 290,
    protein: "5g",
    carbs: "38g",
    fats: "14g",
    image: "https://images.unsplash.com/photo-1518013034458-30b0ee243591?auto=format&fit=crop&w=800&q=80",
    description: "Crisp on the outside, tender on the inside shredded potato pancakes flavored with onion and melted cheese.",
    ingredients: [
      { name: "Potato", amount: "3 large", key: true },
      { name: "Onion", amount: "1 small grated", key: true },
      { name: "Cheese", amount: "1/2 cup shredded cheddar/mozzarella", key: true },
      { name: "Butter", amount: "2 tbsp", key: false },
      { name: "Black Pepper", amount: "1/2 tsp freshly cracked", key: false }
    ],
    instructions: [
      "Peel and grate potatoes using a coarse box grater.",
      "Squeeze out all excess moisture from grated potatoes using a clean tea towel (crucial for crispiness).",
      "Mix potato shreds with grated onion, salt, pepper, and shredded cheese in a mixing bowl.",
      "Melt 1 tbsp butter in a non-stick skillet on medium heat. Press the potato mixture into a flat, compact disc.",
      "Cook for 8-10 minutes until deeply golden brown. Carefully flip, add remaining butter around the edges, and cook for 8 more minutes.",
      "Slice into wedges and serve with sour cream or spicy ketchup."
    ],
    tips: "The secret to maximum crispness is squeezing out as much water from the potatoes as possible."
  },
  {
    id: "rec_spinach_corn_sandwich",
    title: "Cheesy Spinach & Sweet Corn Melt",
    cuisine: "Cafe Style",
    diet: "veg",
    mealType: ["breakfast", "snack"],
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    calories: 340,
    protein: "12g",
    carbs: "35g",
    fats: "17g",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    description: "Grilled golden sourdough bread stuffed with sautéed creamy garlic spinach, corn, and gooey cheese.",
    ingredients: [
      { name: "Spinach", amount: "2 cups roughly chopped", key: true },
      { name: "Corn", amount: "1/2 cup sweet corn kernels", key: false },
      { name: "Cheese", amount: "1 cup mozzarella/cheddar blend", key: true },
      { name: "Bread", amount: "4 slices", key: true },
      { name: "Garlic", amount: "2 cloves minced", key: true },
      { name: "Butter", amount: "2 tbsp", key: false }
    ],
    instructions: [
      "Heat 1 tsp butter in a skillet, sauté minced garlic for 30 seconds.",
      "Add chopped spinach and sweet corn. Sauté for 3 minutes until spinach wilts completely and water evaporates.",
      "Remove from heat, let cool slightly, then stir in the grated cheese.",
      "Butter one side of each bread slice. Spread the spinach-cheese mixture generously between unbuttered sides.",
      "Toast in a skillet over low-medium heat for 3-4 minutes per side until the crust is golden brown and cheese is fully melted."
    ],
    tips: "Cover the pan with a lid while toasting to help the cheese melt evenly without burning the bread."
  },
  {
    id: "rec_mushroom_risotto",
    title: "Creamy Garlic Herb Mushroom Risotto",
    cuisine: "Italian",
    diet: "veg",
    mealType: ["lunch", "dinner"],
    prepTime: 10,
    cookTime: 25,
    servings: 3,
    difficulty: "Medium",
    calories: 410,
    protein: "11g",
    carbs: "58g",
    fats: "15g",
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
    description: "Silky, comforting rice simmered in savory broth with caramelized garlic butter mushrooms and herbs.",
    ingredients: [
      { name: "Mushroom", amount: "250g sliced button/cremini", key: true },
      { name: "Rice", amount: "1 cup Arborio or short grain", key: true },
      { name: "Onion", amount: "1 finely diced", key: true },
      { name: "Garlic", amount: "4 cloves minced", key: true },
      { name: "Butter", amount: "2 tbsp", key: false },
      { name: "Cheese", amount: "1/3 cup grated Parmesan", key: false },
      { name: "Vegetable Broth", amount: "3.5 cups warm", key: false }
    ],
    instructions: [
      "Sauté mushrooms in 1 tbsp melted butter over high heat until caramelized and golden brown. Set half aside for garnish.",
      "In the same pan, sauté finely diced onion and garlic in remaining butter until soft.",
      "Add the rice and toast for 2 minutes until edges become translucent.",
      "Ladle warm broth one cup at a time into the rice, stirring constantly until liquid is absorbed before adding the next.",
      "Once rice is creamy and tender (around 18-20 mins), fold in remaining sautéed mushrooms and grated cheese.",
      "Garnish with black pepper and fresh parsley."
    ],
    tips: "Add warm broth gradually — constant stirring releases starches for a restaurant-grade velvety texture."
  },
  {
    id: "rec_veg_fried_rice",
    title: "Classic Wok-Tossed Vegetable Fried Rice",
    cuisine: "Asian / Indo-Chinese",
    diet: "veg",
    mealType: ["lunch", "dinner"],
    prepTime: 15,
    cookTime: 10,
    servings: 3,
    difficulty: "Easy",
    calories: 330,
    protein: "8g",
    carbs: "54g",
    fats: "10g",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    description: "Fluffy jasmine or basmati rice tossed on high heat with crisp vegetables, soy sauce, and aromatic garlic.",
    ingredients: [
      { name: "Rice", amount: "3 cups cooked & cooled", key: true },
      { name: "Garlic", amount: "4 cloves finely minced", key: true },
      { name: "Onion", amount: "1 diced (or spring onion)", key: true },
      { name: "Carrot", amount: "1 small finely diced", key: false },
      { name: "Soy Sauce", amount: "2 tbsp", key: false },
      { name: "Oil", amount: "2 tbsp sesame or vegetable oil", key: false }
    ],
    instructions: [
      "Heat oil in a wok or large pan on high flame until smoky.",
      "Add minced garlic and onions, stir-fry vigorously for 45 seconds until aromatic.",
      "Toss in diced carrots, bell peppers, or other available veggies. Flash-fry for 2 minutes to keep them crisp.",
      "Add chilled cooked rice, breaking up any clumps with a spatula.",
      "Drizzle soy sauce, vinegar, and ground white pepper around the sides of the wok. Toss everything together on high heat for 3 minutes.",
      "Serve steaming hot alongside your favorite stir-fry or sauce."
    ],
    tips: "Day-old cold refrigerated rice produces the best non-sticky fried rice texture."
  },
  {
    id: "rec_spinach_paneer_curry",
    title: "Traditional Palak Paneer",
    cuisine: "North Indian",
    diet: "veg",
    mealType: ["lunch", "dinner"],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "Medium",
    calories: 360,
    protein: "19g",
    carbs: "12g",
    fats: "26g",
    image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=800&q=80",
    description: "Soft paneer cubes simmered in a vibrant, spiced pureed spinach gravy infused with garlic and cumin.",
    ingredients: [
      { name: "Spinach", amount: "300g fresh leaves", key: true },
      { name: "Paneer", amount: "200g cubed", key: true },
      { name: "Onion", amount: "1 finely chopped", key: true },
      { name: "Tomato", amount: "1 chopped", key: true },
      { name: "Garlic", amount: "6 cloves", key: true },
      { name: "Butter", amount: "1 tbsp", key: false }
    ],
    instructions: [
      "Blanch spinach leaves in boiling water for 2 minutes, then immediately transfer to an ice water bath to preserve the vibrant green color.",
      "Puree the blanched spinach with green chili and 1 clove of garlic until smooth.",
      "Heat butter/oil in a pan, sauté cumin seeds, chopped garlic, and onions until lightly browned.",
      "Add chopped tomatoes and ground spices (turmeric, coriander, garam masala). Cook until mushy.",
      "Pour in the spinach puree and 1/4 cup water. Simmer on low heat for 5 minutes.",
      "Gently fold in paneer cubes and let them warm through in the gravy for 3-4 minutes. Drizzle cream if desired."
    ],
    tips: "Do not overcook spinach after pureeing to keep its bright emerald color intact."
  },

  // --- NON-VEGETARIAN RECIPES ---
  {
    id: "rec_garlic_butter_chicken",
    title: "Pan-Seared Garlic Butter Chicken",
    cuisine: "Continental",
    diet: "non-veg",
    mealType: ["dinner", "lunch"],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: "Easy",
    calories: 460,
    protein: "42g",
    carbs: "4g",
    fats: "30g",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    description: "Juicy, golden pan-seared chicken breast basted in a fragrant garlic, butter, and herb reduction.",
    ingredients: [
      { name: "Chicken", amount: "400g boneless breast or thighs", key: true },
      { name: "Garlic", amount: "6 cloves minced", key: true },
      { name: "Butter", amount: "3 tbsp", key: true },
      { name: "Olive Oil", amount: "1 tbsp", key: false },
      { name: "Lemon", amount: "1/2 juiced", key: false },
      { name: "Thyme or Oregano", amount: "1 tsp dried or fresh", key: false }
    ],
    instructions: [
      "Pat chicken dry with paper towels. Season both sides generously with salt, black pepper, and paprika.",
      "Heat olive oil and 1 tbsp butter in a cast-iron or heavy skillet over medium-high heat.",
      "Place chicken in the pan and sear without moving for 5-6 minutes until a golden-brown crust develops.",
      "Flip chicken, turn heat to medium-low, and add remaining butter and minced garlic.",
      "Tilt skillet and spoon the foamy melted garlic butter continuously over the chicken for 4-5 minutes until cooked through (internal temp 165°F / 74°C).",
      "Squeeze fresh lemon juice over the top, rest for 5 minutes, then slice and serve."
    ],
    tips: "Resting the chicken for 5 minutes before slicing locks in the savory juices."
  },
  {
    id: "rec_classic_egg_bhurji",
    title: "Masala Egg Scramble (Spicy Bhurji)",
    cuisine: "Indian",
    diet: "non-veg",
    mealType: ["breakfast", "dinner"],
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    calories: 260,
    protein: "16g",
    carbs: "6g",
    fats: "18g",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    description: "Fluffy, tender scrambled eggs cooked with caramelized onions, tangy tomatoes, garlic, and aromatic spices.",
    ingredients: [
      { name: "Eggs", amount: "4 whole eggs", key: true },
      { name: "Onion", amount: "1 large finely diced", key: true },
      { name: "Tomato", amount: "1 medium diced", key: true },
      { name: "Garlic", amount: "2 cloves minced", key: false },
      { name: "Butter", amount: "1.5 tbsp", key: false },
      { name: "Turmeric & Chili Powder", amount: "1/2 tsp each", key: false }
    ],
    instructions: [
      "Whisk eggs in a bowl with salt and black pepper until frothy.",
      "Melt butter in a pan over medium heat; add diced onions and garlic, sautéing until soft and light brown.",
      "Add diced tomatoes, turmeric, and chili powder. Sauté for 3 minutes until tomatoes break down.",
      "Pour the whisked eggs into the pan.",
      "Gently stir with a spatula on low heat, cooking slowly until soft, creamy curdles form (about 3-4 mins).",
      "Garnish with fresh cilantro and serve warm with toasted buttered bread or rotis."
    ],
    tips: "Cook over gentle low heat to prevent eggs from turning dry or rubbery."
  },
  {
    id: "rec_chicken_fried_rice",
    title: "Savory Chicken Fried Rice",
    cuisine: "Asian",
    diet: "non-veg",
    mealType: ["lunch", "dinner"],
    prepTime: 15,
    cookTime: 12,
    servings: 3,
    difficulty: "Easy",
    calories: 450,
    protein: "28g",
    carbs: "52g",
    fats: "14g",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    description: "Tender chicken bits and fluffy rice tossed in a high-heat wok with scrambled eggs, garlic, and soy seasoning.",
    ingredients: [
      { name: "Chicken", amount: "200g diced small", key: true },
      { name: "Rice", amount: "3 cups cold cooked", key: true },
      { name: "Eggs", amount: "2 beaten", key: true },
      { name: "Garlic", amount: "3 cloves minced", key: true },
      { name: "Onion", amount: "1/2 cup diced", key: true },
      { name: "Soy Sauce", amount: "2 tbsp", key: false }
    ],
    instructions: [
      "Heat 1 tbsp oil in a wok. Add diced chicken seasoned with salt/pepper and stir-fry for 4-5 minutes until cooked. Push to side.",
      "Pour beaten eggs onto the cleared side and scramble gently into bite-sized pieces.",
      "Add garlic and onions, stir-frying on high heat for 1 minute.",
      "Add the cold rice, breaking apart clumps with your spatula.",
      "Pour soy sauce and a splash of sesame oil around the wok edges. Toss everything continuously for 3 minutes until steaming hot."
    ],
    tips: "Cut chicken into small, uniform cubes so it cooks in just 4 minutes."
  },
  {
    id: "rec_chicken_curry",
    title: "Homestyle Rustic Chicken Curry",
    cuisine: "Indian",
    diet: "non-veg",
    mealType: ["lunch", "dinner"],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "Medium",
    calories: 490,
    protein: "36g",
    carbs: "14g",
    fats: "28g",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    description: "Tender chicken pieces simmered in a hearty onion-tomato and whole spice aromatic gravy.",
    ingredients: [
      { name: "Chicken", amount: "500g bone-in or boneless", key: true },
      { name: "Onion", amount: "2 large sliced", key: true },
      { name: "Tomato", amount: "2 pureed", key: true },
      { name: "Garlic", amount: "6 cloves minced", key: true },
      { name: "Potato", amount: "1 diced (optional)", key: false },
      { name: "Garam Masala", amount: "1 tsp", key: false }
    ],
    instructions: [
      "Heat oil in a heavy-bottomed pot. Add whole spices (bay leaf, cloves, cardamom) and sliced onions.",
      "Sauté onions until deep caramelized golden brown (8-10 mins).",
      "Add minced garlic, ginger, and tomato puree. Cook until oil glimmers on the surface.",
      "Add chicken and potatoes; sear on medium-high heat for 5 minutes to coat with the masala.",
      "Add 1 cup hot water, cover with a tight lid, and simmer on low for 18-20 minutes until chicken is tender.",
      "Stir in garam masala and cilantro. Serve with warm steamed rice."
    ],
    tips: "Browning the onions patiently is the key to deep gravy color and rich authentic flavor."
  },
  {
    id: "rec_cheesy_egg_omelette",
    title: "French Bistro Herb & Cheese Omelette",
    cuisine: "French",
    diet: "non-veg",
    mealType: ["breakfast", "snack"],
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: "Easy",
    calories: 320,
    protein: "19g",
    carbs: "2g",
    fats: "26g",
    image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80",
    description: "Silky soft-curd rolled omelette filled with melted cheese, chives, and butter.",
    ingredients: [
      { name: "Eggs", amount: "3 large eggs", key: true },
      { name: "Cheese", amount: "1/3 cup Gruyere or Cheddar", key: true },
      { name: "Butter", amount: "1.5 tbsp", key: true },
      { name: "Garlic", amount: "1 pinch garlic powder or fresh chives", key: false }
    ],
    instructions: [
      "Beat eggs vigorously with a pinch of salt until completely uniform with no visible egg white streaks.",
      "Melt butter in an 8-inch nonstick pan over medium-low heat until bubbling but not browned.",
      "Pour eggs in and stir rapidly in circles with a silicone spatula while shaking the pan back and forth for 60 seconds.",
      "When curds are soft and custard-like, smooth out the top and scatter cheese across the center.",
      "Tilt the pan and gently roll the omelette onto itself into an elegant oval shape.",
      "Invert onto a warm plate, brush with a dab of butter, and serve immediately."
    ],
    tips: "Keep heat gentle — a classic French omelette should be silky and pale yellow with no brown crust."
  },
  {
    id: "rec_creamy_chicken_pasta",
    title: "Creamy Garlic Parmesan Chicken Alfredo",
    cuisine: "Italian-American",
    diet: "non-veg",
    mealType: ["lunch", "dinner"],
    prepTime: 10,
    cookTime: 20,
    servings: 3,
    difficulty: "Medium",
    calories: 580,
    protein: "38g",
    carbs: "56g",
    fats: "24g",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80",
    description: "Tender seasoned chicken strips over fettuccine or penne pasta smothered in rich garlic parmesan cream sauce.",
    ingredients: [
      { name: "Chicken", amount: "300g sliced into strips", key: true },
      { name: "Pasta", amount: "250g Fettuccine or Penne", key: true },
      { name: "Garlic", amount: "4 cloves minced", key: true },
      { name: "Cheese", amount: "1/2 cup grated Parmesan", key: true },
      { name: "Butter", amount: "2 tbsp", key: false },
      { name: "Heavy Cream", amount: "3/4 cup (or milk)", key: false }
    ],
    instructions: [
      "Cook pasta in boiling salted water until al dente; reserve 1/2 cup pasta water and drain.",
      "In a skillet, melt 1 tbsp butter and sear chicken strips with Italian herbs for 6-8 minutes until golden and cooked. Transfer to a plate.",
      "In the same skillet, melt remaining butter and gently sauté minced garlic for 1 minute.",
      "Pour in cream, bring to a gentle simmer for 3 minutes, then remove from heat and whisk in parmesan until velvety smooth.",
      "Toss the pasta and chicken directly into the sauce. If needed, splash in reserved pasta water to loosen."
    ],
    tips: "Whisk cheese into the sauce off direct high heat so it melts smoothly without separating."
  },

  // --- VEGAN RECIPES ---
  {
    id: "rec_potato_tomato_roast",
    title: "Spanish Patatas Bravas in Smokey Tomato Sauce",
    cuisine: "Spanish",
    diet: "vegan",
    mealType: ["snack", "dinner"],
    prepTime: 10,
    cookTime: 25,
    servings: 2,
    difficulty: "Easy",
    calories: 270,
    protein: "5g",
    carbs: "45g",
    fats: "9g",
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
    description: "Crispy roasted potato cubes tossed in a rich smoked paprika, garlic, and tomato reduction.",
    ingredients: [
      { name: "Potato", amount: "3 medium cubed", key: true },
      { name: "Tomato", amount: "3 pureed or crushed", key: true },
      { name: "Garlic", amount: "4 cloves sliced", key: true },
      { name: "Olive Oil", amount: "2 tbsp", key: true },
      { name: "Smoked Paprika", amount: "1 tsp", key: false }
    ],
    instructions: [
      "Toss cubed potatoes in 1 tbsp olive oil, salt, and pepper. Roast in an oven or air fryer at 200°C (400°F) for 20 minutes until crisp and golden.",
      "Meanwhile, heat 1 tbsp olive oil in a skillet, sauté garlic and paprika for 1 minute.",
      "Add tomato puree and simmer until thick, glossy, and reduced (about 8-10 mins).",
      "Toss crisp roasted potatoes directly into the sauce or serve the sauce over top.",
      "Garnish with fresh parsley."
    ],
    tips: "Parboiling potatoes in water with 1/2 tsp baking soda before roasting creates maximum crunch."
  },
  {
    id: "rec_spinach_garlic_dal",
    title: "Hearty Garlic & Spinach Lentil Stew (Dal)",
    cuisine: "Indian",
    diet: "vegan",
    mealType: ["lunch", "dinner"],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    calories: 240,
    protein: "14g",
    carbs: "38g",
    fats: "4g",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    description: "Nutritious, comforting yellow lentils cooked with garlic, tender spinach, and tempered with cumin seeds.",
    ingredients: [
      { name: "Spinach", amount: "2 cups shredded", key: true },
      { name: "Garlic", amount: "6 cloves sliced", key: true },
      { name: "Tomato", amount: "1 chopped", key: true },
      { name: "Onion", amount: "1 chopped", key: true },
      { name: "Lentils", amount: "1 cup yellow or red lentils", key: true }
    ],
    instructions: [
      "Rinse lentils and pressure cook or simmer in 3 cups water with turmeric and salt until creamy and tender.",
      "In a small skillet, heat oil, add cumin seeds, sliced garlic, and chopped onions. Sauté until garlic is golden brown.",
      "Add chopped tomatoes and cook for 3 minutes.",
      "Stir in the shredded spinach and cook for 2 minutes until wilted.",
      "Pour this aromatic garlic-spinach tempering over the cooked lentils. Stir and serve hot with steamed rice."
    ],
    tips: "The aroma comes from frying the garlic until light golden — do not rush this step."
  }
];

// Fallback dynamic synthesis templates for novel ingredient combinations
const DYNAMIC_CUISINE_PROFILES = {
  italian: {
    name: "Mediterranean Sauté",
    flavors: ["Olive Oil", "Garlic", "Oregano", "Black Pepper", "Fresh Herbs"],
    technique: "slow sautéing and reducing into a savory pan sauce"
  },
  indian: {
    name: "Spiced Masala Stir-Fry",
    flavors: ["Cumin", "Turmeric", "Garlic", "Ginger", "Garam Masala"],
    technique: "blooming whole spices in oil and simmering with aromatics"
  },
  asian: {
    name: "Garlic Sesame Stir-Fry",
    flavors: ["Soy Sauce", "Garlic", "Sesame Oil", "Ginger", "Chili Flakes"],
    technique: "fast high-heat wok tossing for crisp texture and rich umami"
  },
  american: {
    name: "Rustic Skillet Bake",
    flavors: ["Butter", "Garlic", "Smoked Paprika", "Black Pepper"],
    technique: "searing in a hot cast-iron skillet and finishing with a butter glaze"
  }
};
