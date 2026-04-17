#!/bin/bash
# Run this after: gws auth login -s keep
# Creates the grocery list in Google Keep

gws keep notes create --json '{
  "title": "Workout Meal Plan — Weekly Groceries",
  "body": {
    "list": {
      "listItems": [
        {"text": {"text": "=== PROTEINS ==="}, "checked": false},
        {"text": {"text": "Chicken breast (2-3 lbs) — boneless skinless, buy in bulk"}, "checked": false},
        {"text": {"text": "Salmon fillets (1.5-2 lbs) — wild-caught preferred"}, "checked": false},
        {"text": {"text": "Shrimp (1 lb, raw, peeled)"}, "checked": false},
        {"text": {"text": "Canned tuna in olive oil (4-6 cans)"}, "checked": false},
        {"text": {"text": "Lean ground turkey (1 lb)"}, "checked": false},
        {"text": {"text": "Eggs (2 dozen)"}, "checked": false},
        {"text": {"text": "Greek yogurt, plain full-fat (32 oz tub)"}, "checked": false},
        {"text": {"text": "Whey or casein protein powder (<5g sugar/serving)"}, "checked": false},
        {"text": {"text": "String cheese or part-skim mozzarella"}, "checked": false},
        {"text": {"text": "=== PRODUCE ==="}, "checked": false},
        {"text": {"text": "Avocados (7-10) — one per day"}, "checked": false},
        {"text": {"text": "Baby spinach (large bag)"}, "checked": false},
        {"text": {"text": "Arugula (bag)"}, "checked": false},
        {"text": {"text": "Cherry tomatoes (2 pints)"}, "checked": false},
        {"text": {"text": "English cucumber (2)"}, "checked": false},
        {"text": {"text": "Broccoli (2 heads or bag of florets)"}, "checked": false},
        {"text": {"text": "Asparagus (2 bundles)"}, "checked": false},
        {"text": {"text": "Zucchini (3-4)"}, "checked": false},
        {"text": {"text": "Eggplant (1-2)"}, "checked": false},
        {"text": {"text": "Red onion (2)"}, "checked": false},
        {"text": {"text": "Garlic (1 head)"}, "checked": false},
        {"text": {"text": "Lemons (4-6)"}, "checked": false},
        {"text": {"text": "Blueberries or strawberries (1-2 pints)"}, "checked": false},
        {"text": {"text": "Cauliflower (1 head)"}, "checked": false},
        {"text": {"text": "=== PANTRY / FATS / OILS ==="}, "checked": false},
        {"text": {"text": "Extra virgin olive oil (large bottle)"}, "checked": false},
        {"text": {"text": "Kalamata olives (jar)"}, "checked": false},
        {"text": {"text": "Raw almonds or walnuts (bag)"}, "checked": false},
        {"text": {"text": "Red wine vinegar"}, "checked": false},
        {"text": {"text": "Dijon mustard"}, "checked": false},
        {"text": {"text": "Canned chickpeas (3-4 cans)"}, "checked": false},
        {"text": {"text": "Canned white beans (2-3 cans)"}, "checked": false},
        {"text": {"text": "Quinoa (small bag — training days only)"}, "checked": false},
        {"text": {"text": "Roasted red peppers (jar)"}, "checked": false},
        {"text": {"text": "=== HERBS & SPICES ==="}, "checked": false},
        {"text": {"text": "Sea salt + black pepper"}, "checked": false},
        {"text": {"text": "Dried oregano, thyme, rosemary"}, "checked": false},
        {"text": {"text": "Smoked paprika"}, "checked": false},
        {"text": {"text": "Cumin"}, "checked": false},
        {"text": {"text": "Fresh parsley or basil (bunch)"}, "checked": false},
        {"text": {"text": "=== HYDRATION / ELECTROLYTES ==="}, "checked": false},
        {"text": {"text": "Electrolyte packets, no sugar (LMNT or Liquid IV Zero)"}, "checked": false},
        {"text": {"text": "Sparkling water (case)"}, "checked": false},
        {"text": {"text": "Black coffee or green tea"}, "checked": false}
      ]
    }
  }
}'
