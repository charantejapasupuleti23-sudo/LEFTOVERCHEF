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

  const systemPrompt = `You are an elite master chef and culinary scientist. 
The user has given you a specific set of pantry ingredients, dietary preference, and meal type.
Generate a gourmet, realistic, delicious recipe that prioritizes their provided ingredients.

Strict Dietary Rule:
- If diet is "veg", the recipe must strictly contain NO meat, poultry, fish, seafood, or eggs. Dairy is allowed.
- If diet is "vegan", strictly 100% plant-based with NO meat, dairy, eggs, or animal products.
- If diet is "non-veg", you can incorporate chicken, egg, meat, or seafood while harmonizing with their ingredients.

You MUST reply ONLY with a valid JSON object matching this exact schema:
{
  "title": "Dish Name",
  "cuisine": "Cuisine style (e.g. Italian, Indian, Mexican, Asian, Mediterranean, American)",
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
  "description": "A 2-sentence enticing description highlighting the flavor profile and texture.",
  "ingredients": [
    { "name": "Ingredient Name", "amount": "e.g. 2 cups / 200g / 2 tbsp", "key": true }
  ],
  "instructions": [
    "Step 1 description with precise techniques and visual cues.",
    "Step 2 description..."
  ],
  "tips": "A professional chef tip to make this dish taste restaurant quality."
}`;

  const userPrompt = `User's available pantry ingredients: ${ingredients.join(', ')}
Dietary preference: ${diet}
Meal type: ${meal}

Create an extraordinary recipe now.`;

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
      temperature: 0.7,
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
