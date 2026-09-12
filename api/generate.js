// Vercel Serverless API Route: /api/generate
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on Vercel Environment Variables.' });
  }

  const { ingredients = [], diet = 'veg', meal = 'all' } = req.body || {};

  if (!ingredients.length) {
    return res.status(400).json({ error: 'Ingredients list is required.' });
  }

  const ingredientsListStr = ingredients.join(', ');

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

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: errorData.error?.message || 'Gemini API call failed' });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidate) {
      return res.status(500).json({ error: 'No recipe returned from model' });
    }

    const recipeJson = JSON.parse(candidate);
    return res.status(200).json(recipeJson);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error generating recipe' });
  }
}
