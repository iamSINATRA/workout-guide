# Nutrition Daily Meals Design
**Date:** 2026-04-16
**File:** `index.html`

## Overview

Replace the static single-day nutrition meal cards with a 7-day daily meal plan. Each day has unique meals with Unsplash food photos and expandable step-by-step recipes. Navigation uses a day-selector pill row (MON–SUN) matching the existing week grid visual language.

## Constraints

- Mediterranean diet + 16:8 IF (12 PM–8 PM eating window)
- No tuna fish
- No smoked salmon (regular salmon is fine)
- 170g+ protein/day, <80g net carbs, 35g+ fiber, <25g added sugar
- Avocado daily — non-negotiable

## Layout Changes (Nutrition Screen)

**Unchanged:** hero, macros row, eating window callout, rules, back protocol.

**Replaced:** the 4 static meal cards become a day-selector + swappable meal cards.

**New elements inserted between eating window and rules:**
1. Day selector — 7 pill buttons (MON–SUN), styled with the existing day colors, active day highlighted in `--accent` gold. Default = today's day of week via JS `new Date().getDay()`.
2. Meal card set — swaps to the selected day's 4 cards (Meal 1, Meal 2, Meal 3, Snack).

## Recipe Card Design

Each meal card contains:
- Wide food photo (Unsplash keyword URL, ~200px tall, `object-fit: cover`)
- Meal label + time (e.g., "Meal 1 — 12:00 PM")
- Dish name (bold, white)
- Tap-to-expand recipe accordion showing:
  - **Ingredients** — bulleted list
  - **Steps** — numbered list

Accordion uses the same open/close chevron pattern as the workout day cards.

## 7-Day Meal Plan

| Day | 12 PM | 3 PM | 6:30 PM | Snack |
|-----|-------|------|---------|-------|
| Mon | Egg & Avocado Scramble | Grilled Chicken Arugula Salad | Herb-Crusted Salmon + Broccoli + White Beans | Greek Yogurt + Blueberries |
| Tue | Shrimp & Avocado Plate | Shrimp & Spinach + Chickpeas | Ground Turkey & Zucchini Skillet | Hard-Boiled Eggs + Almonds |
| Wed | Yogurt Parfait + Walnuts | Grilled Salmon & Olive Bowl | Baked Chicken Thighs + Asparagus + Lentils | String Cheese + Walnuts |
| Thu | Shakshuka + Avocado | Salmon & Arugula Bowl | Shrimp Stir-fry + Broccoli + Quinoa | Protein Shake |
| Fri | Sautéed Shrimp & Avocado Plate | Chicken Salad (no croutons) | Sea Bass + Roasted Eggplant + White Beans | Greek Yogurt + Strawberries |
| Sat | Mediterranean Frittata | Grilled Shrimp & Avocado Bowl | Slow-Roasted Salmon + Asparagus + Lentils | Almonds + String Cheese |
| Sun | Egg White Omelette + Spinach | Chicken & Chickpea Salad | Herb-Roasted Chicken + Cauliflower + Chickpeas | Hard-Boiled Eggs + Walnuts |

## Photo Strategy

Unsplash source URLs with food keywords:
`https://source.unsplash.com/600x300/?[keyword]`

Each meal gets a relevant keyword (e.g., `eggs,avocado`, `salmon,herbs`, `shakshuka`). No API key required. Images load lazily.

## JS Changes

- `switchDay(dayIndex)` — shows/hides the correct day's meal card set
- Day selector auto-defaults to current day on page load
- Recipe accordion reuses existing `toggleDay()` pattern (add/remove `open` class)
- Day meal data can be inline HTML (no JS data layer needed given single-file architecture)
