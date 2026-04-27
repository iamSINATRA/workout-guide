# Nutrition Daily Meals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 4 static meal cards in the Nutrition screen with a 7-day day-selector + swappable daily meal sets, each card having an Unsplash food photo and expandable step-by-step recipe.

**Architecture:** All changes are within the single-file `index.html`. New CSS classes added to the existing `<style>` block. Static meal HTML (lines 1057–1095) replaced with a `.day-selector` pill row + 7 `.meal-day-set` containers (one per day, hidden/shown via JS). New `switchDay(n)` function added to the existing `<script>` block.

**Tech Stack:** Vanilla HTML/CSS/JS. Unsplash source URLs for food photos. No build step.

---

## File Map

- **Modify:** `index.html`
  - CSS block (`<style>`): add day-selector + recipe card styles after line ~528
  - Nutrition HTML (lines 1057–1095): replace 4 static `.meal-card` elements with day-selector + 7 day sets
  - Script block (`<script>`): add `switchDay()` function + DOMContentLoaded auto-default

---

## Task 1: Add CSS

**Files:**
- Modify: `index.html` — `<style>` block, after `.protocol-sets` rule (~line 528)

- [ ] **Step 1: Insert day-selector and recipe card CSS**

Find the closing of `.protocol-sets` rule and insert after it:

```css
  /* ── DAY SELECTOR (Nutrition) ── */
  .day-selector {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
    padding: 16px 16px 8px;
  }

  .day-pill {
    border: none;
    border-radius: 4px;
    padding: 8px 2px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    background: var(--bg3);
    cursor: pointer;
    text-align: center;
    transition: background 0.15s, color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .day-pill.active {
    background: var(--accent);
    color: #000;
  }

  /* ── MEAL DAY SETS ── */
  .meal-day-set { display: none; }
  .meal-day-set.active { display: block; }

  /* ── RECIPE CARD ── */
  .recipe-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 6px;
    margin: 0 16px 10px;
    overflow: hidden;
  }

  .recipe-photo {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
    background: var(--bg3);
  }

  .recipe-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .recipe-header-left { display: flex; flex-direction: column; gap: 2px; }

  .recipe-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: 600;
  }

  .recipe-title {
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    line-height: 1.2;
  }

  .recipe-chevron {
    font-size: 12px;
    color: var(--muted);
    transition: transform 0.2s;
    flex-shrink: 0;
    margin-left: 10px;
  }

  .recipe-card.open .recipe-chevron { transform: rotate(180deg); }

  .recipe-body {
    display: none;
    padding: 0 14px 16px;
    border-top: 1px solid var(--border);
  }

  .recipe-card.open .recipe-body { display: block; }

  .recipe-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 12px 0 8px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 8px;
  }

  .recipe-body ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 12px;
  }

  .recipe-body ul li {
    font-size: 14px;
    color: var(--text);
    padding-left: 14px;
    position: relative;
    line-height: 1.35;
  }

  .recipe-body ul li::before {
    content: '·';
    position: absolute;
    left: 0;
    color: var(--muted);
  }

  .recipe-body ol {
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .recipe-body ol li {
    font-size: 14px;
    color: var(--text);
    line-height: 1.4;
  }
```

- [ ] **Step 2: Verify CSS parses with no errors**

Open `index.html` in a browser. Check DevTools console for CSS parse errors. Expect: none.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add day-selector and recipe card CSS to nutrition screen"
```

---

## Task 2: Replace static meal HTML with 7-day system

**Files:**
- Modify: `index.html` — Nutrition screen, lines 1057–1095 (the 4 static `.meal-card` divs)

- [ ] **Step 1: Remove the 4 static meal cards**

Delete lines 1057–1095 (from `<div class="meal-card">` Meal 1 through the closing `</div>` of the Snack card).

- [ ] **Step 2: Insert day-selector + 7 meal-day-sets in their place**

Insert the following HTML at that location. Day indices: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun.

```html
  <!-- Day selector pills -->
  <div class="day-selector">
    <button class="day-pill" style="background:var(--mon)" onclick="switchDay(0,this)">MON</button>
    <button class="day-pill" style="background:var(--tue)" onclick="switchDay(1,this)">TUE</button>
    <button class="day-pill" style="background:var(--wed)" onclick="switchDay(2,this)">WED</button>
    <button class="day-pill" style="background:var(--thu)" onclick="switchDay(3,this)">THU</button>
    <button class="day-pill" style="background:var(--fri)" onclick="switchDay(4,this)">FRI</button>
    <button class="day-pill" style="background:#2a4a1a" onclick="switchDay(5,this)">SAT</button>
    <button class="day-pill" style="background:var(--sun)" onclick="switchDay(6,this)">SUN</button>
  </div>

  <!-- ── MONDAY ── -->
  <div class="meal-day-set" id="meal-day-0">

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?eggs,avocado" loading="lazy" alt="Egg & Avocado Scramble">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 1 — 12:00 PM · Break Fast</div>
          <div class="recipe-title">Egg &amp; Avocado Scramble</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>3 large eggs + 2 egg whites</li>
          <li>1 ripe avocado, sliced</li>
          <li>½ cup cherry tomatoes, halved</li>
          <li>1 tbsp olive oil</li>
          <li>Salt, pepper, red pepper flakes, squeeze of lemon</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Heat olive oil in a non-stick pan over medium heat.</li>
          <li>Whisk eggs and egg whites together; season with salt and pepper.</li>
          <li>Pour into pan and stir gently with a spatula until just set, 2–3 min.</li>
          <li>Plate eggs alongside sliced avocado and cherry tomatoes.</li>
          <li>Finish with red pepper flakes and a squeeze of lemon.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?grilled,chicken,salad" loading="lazy" alt="Grilled Chicken Arugula Salad">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 2 — 3:00 PM</div>
          <div class="recipe-title">Grilled Chicken Arugula Salad</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>6 oz chicken breast</li>
          <li>2 cups arugula</li>
          <li>¼ cup Kalamata olives</li>
          <li>½ cup roasted red peppers, sliced</li>
          <li>¼ red onion, thinly sliced</li>
          <li>2 tbsp olive oil, 1 tbsp red wine vinegar, 1 tsp Dijon mustard</li>
          <li>Salt, pepper, dried oregano</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Season chicken with salt, pepper, and dried oregano.</li>
          <li>Grill or pan-sear over medium-high heat, 5–6 min per side until cooked through.</li>
          <li>Let rest 5 min, then slice.</li>
          <li>Toss arugula, olives, peppers, and red onion in a bowl.</li>
          <li>Whisk olive oil, vinegar, and Dijon; drizzle over salad.</li>
          <li>Top with sliced chicken and serve.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?salmon,herbs" loading="lazy" alt="Herb-Crusted Salmon">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 3 — 6:30 PM · Largest Meal</div>
          <div class="recipe-title">Herb-Crusted Salmon + Broccoli + White Beans</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>8 oz salmon fillet</li>
          <li>2 cups broccoli florets</li>
          <li>½ cup canned white beans, drained</li>
          <li>2 tbsp olive oil</li>
          <li>2 cloves garlic, minced</li>
          <li>Fresh dill, parsley, lemon zest, salt, pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Preheat oven to 400°F. Line a sheet pan with foil.</li>
          <li>Mix olive oil, garlic, dill, parsley, and lemon zest; rub over salmon.</li>
          <li>Toss broccoli in olive oil, salt, and pepper; spread on pan alongside salmon.</li>
          <li>Roast 12–15 min until salmon is flaky and broccoli is tender.</li>
          <li>Warm white beans in a small pan with olive oil and a pinch of salt.</li>
          <li>Plate salmon over white beans with broccoli on the side.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?yogurt,blueberries" loading="lazy" alt="Greek Yogurt + Blueberries">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Snack — Between Meals</div>
          <div class="recipe-title">Greek Yogurt + Blueberries</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>1 cup plain full-fat Greek yogurt</li>
          <li>½ cup fresh blueberries</li>
          <li>Pinch of cinnamon (optional)</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Scoop yogurt into a bowl.</li>
          <li>Top with blueberries.</li>
          <li>Dust with cinnamon if desired. Serve cold.</li>
        </ol>
      </div>
    </div>

  </div><!-- /meal-day-0 MON -->

  <!-- ── TUESDAY ── -->
  <div class="meal-day-set" id="meal-day-1">

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?shrimp,avocado" loading="lazy" alt="Shrimp & Avocado Plate">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 1 — 12:00 PM · Break Fast</div>
          <div class="recipe-title">Shrimp &amp; Avocado Plate</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>6 oz raw shrimp, peeled and deveined</li>
          <li>1 ripe avocado, sliced</li>
          <li>½ cup cucumber, sliced</li>
          <li>1 tbsp olive oil</li>
          <li>Lemon juice, salt, pepper, garlic powder</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Pat shrimp dry; season with salt, pepper, and garlic powder.</li>
          <li>Heat olive oil in a pan over medium-high heat.</li>
          <li>Cook shrimp 2 min per side until pink and opaque.</li>
          <li>Arrange shrimp alongside sliced avocado and cucumber.</li>
          <li>Drizzle with lemon juice and a little olive oil.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?shrimp,spinach" loading="lazy" alt="Shrimp & Spinach + Chickpeas">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 2 — 3:00 PM</div>
          <div class="recipe-title">Shrimp &amp; Spinach + Chickpeas</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>6 oz raw shrimp, peeled</li>
          <li>2 cups baby spinach</li>
          <li>½ cup canned chickpeas, drained</li>
          <li>2 cloves garlic, minced</li>
          <li>1 tbsp olive oil</li>
          <li>Lemon juice, red pepper flakes, salt</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Heat olive oil in a large pan over medium heat.</li>
          <li>Add garlic and red pepper flakes; sauté 1 min.</li>
          <li>Add shrimp; cook 2 min per side until pink. Remove and set aside.</li>
          <li>Add spinach and chickpeas; toss until spinach wilts, about 2 min.</li>
          <li>Return shrimp to pan; squeeze lemon juice over everything and toss.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?turkey,zucchini" loading="lazy" alt="Ground Turkey & Zucchini Skillet">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 3 — 6:30 PM · Largest Meal</div>
          <div class="recipe-title">Ground Turkey &amp; Zucchini Skillet</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>8 oz lean ground turkey</li>
          <li>2 medium zucchini, diced</li>
          <li>½ cup cherry tomatoes, halved</li>
          <li>1 red onion, diced</li>
          <li>2 cloves garlic, minced</li>
          <li>1 tbsp olive oil</li>
          <li>Dried oregano, cumin, salt, pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Heat olive oil in a skillet over medium-high heat.</li>
          <li>Add onion and garlic; sauté 2–3 min until softened.</li>
          <li>Add turkey; brown 5–6 min, breaking it up, until cooked through.</li>
          <li>Stir in zucchini, tomatoes, oregano, and cumin.</li>
          <li>Cook 4–5 min more until zucchini is tender. Season and serve.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?boiled,eggs,almonds" loading="lazy" alt="Hard-Boiled Eggs + Almonds">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Snack — Between Meals</div>
          <div class="recipe-title">Hard-Boiled Eggs + Almonds</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>2 large eggs</li>
          <li>¼ cup raw almonds</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Place eggs in a pot; cover with cold water by 1 inch.</li>
          <li>Bring to a boil; cover, remove from heat, and let sit 10–12 min.</li>
          <li>Transfer to ice water for 5 min. Peel and serve alongside almonds.</li>
        </ol>
      </div>
    </div>

  </div><!-- /meal-day-1 TUE -->

  <!-- ── WEDNESDAY ── -->
  <div class="meal-day-set" id="meal-day-2">

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?yogurt,parfait,walnuts" loading="lazy" alt="Yogurt Parfait + Walnuts">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 1 — 12:00 PM · Break Fast</div>
          <div class="recipe-title">Yogurt Parfait + Walnuts</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>1 cup plain full-fat Greek yogurt</li>
          <li>¼ cup walnuts, roughly chopped</li>
          <li>½ cup blueberries</li>
          <li>1 tbsp chia seeds</li>
          <li>½ avocado, sliced (daily non-negotiable)</li>
          <li>Cinnamon</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Spoon half the yogurt into a glass or bowl.</li>
          <li>Layer on half the berries and walnuts.</li>
          <li>Add remaining yogurt, top with remaining berries, walnuts, and chia seeds.</li>
          <li>Dust with cinnamon.</li>
          <li>Serve alongside sliced avocado.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?salmon,bowl,olives" loading="lazy" alt="Grilled Salmon & Olive Bowl">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 2 — 3:00 PM</div>
          <div class="recipe-title">Grilled Salmon &amp; Olive Bowl</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>6 oz salmon fillet</li>
          <li>2 cups mixed greens</li>
          <li>¼ cup Kalamata olives, halved</li>
          <li>½ cup cucumber, diced</li>
          <li>¼ cup roasted red peppers, sliced</li>
          <li>2 tbsp olive oil, 1 tbsp lemon juice, salt, pepper, dried thyme</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Season salmon with salt, pepper, and dried thyme.</li>
          <li>Grill or pan-sear 4–5 min per side until flaky.</li>
          <li>Arrange greens, olives, cucumber, and peppers in a bowl.</li>
          <li>Flake salmon over the top.</li>
          <li>Whisk olive oil and lemon juice; drizzle over bowl and serve.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?chicken,asparagus" loading="lazy" alt="Baked Chicken Thighs + Asparagus + Lentils">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 3 — 6:30 PM · Largest Meal</div>
          <div class="recipe-title">Baked Chicken Thighs + Asparagus + Lentils</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>2 bone-in skin-on chicken thighs</li>
          <li>1 bunch asparagus, trimmed</li>
          <li>½ cup canned green lentils, drained</li>
          <li>2 tbsp olive oil</li>
          <li>Garlic powder, dried rosemary, salt, pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Preheat oven to 425°F.</li>
          <li>Rub chicken thighs with olive oil, garlic powder, rosemary, salt, and pepper.</li>
          <li>Roast chicken on a sheet pan for 20 min.</li>
          <li>Add asparagus (drizzled with olive oil) to pan; roast 12–15 min more until chicken is golden (165°F internal).</li>
          <li>Warm lentils in a small pan with olive oil and a pinch of salt.</li>
          <li>Plate chicken over lentils with asparagus on the side.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?string,cheese,walnuts" loading="lazy" alt="String Cheese + Walnuts">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Snack — Between Meals</div>
          <div class="recipe-title">String Cheese + Walnuts</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>2 sticks string cheese</li>
          <li>¼ cup walnuts</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Peel string cheese into strips.</li>
          <li>Serve alongside walnuts. No cooking needed.</li>
        </ol>
      </div>
    </div>

  </div><!-- /meal-day-2 WED -->

  <!-- ── THURSDAY ── -->
  <div class="meal-day-set" id="meal-day-3">

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?shakshuka" loading="lazy" alt="Shakshuka + Avocado">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 1 — 12:00 PM · Break Fast</div>
          <div class="recipe-title">Shakshuka + Avocado</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>3 large eggs</li>
          <li>1 can (14 oz) crushed tomatoes</li>
          <li>1 ripe avocado, sliced</li>
          <li>½ red onion, diced</li>
          <li>2 cloves garlic, minced</li>
          <li>1 tsp cumin, 1 tsp paprika, pinch of cayenne</li>
          <li>1 tbsp olive oil, salt, pepper, fresh parsley</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Heat olive oil in an oven-safe skillet over medium heat.</li>
          <li>Sauté onion 3 min; add garlic, cumin, paprika, and cayenne; cook 1 min.</li>
          <li>Pour in crushed tomatoes; season with salt and pepper; simmer 5–7 min.</li>
          <li>Make 3 wells in sauce; crack an egg into each well.</li>
          <li>Cover and cook 5–7 min until whites are set and yolks are runny.</li>
          <li>Garnish with parsley; serve with sliced avocado on the side.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?salmon,arugula" loading="lazy" alt="Salmon & Arugula Bowl">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 2 — 3:00 PM</div>
          <div class="recipe-title">Salmon &amp; Arugula Bowl</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>6 oz salmon fillet</li>
          <li>2 cups arugula</li>
          <li>¼ cup Kalamata olives</li>
          <li>½ cup cherry tomatoes, halved</li>
          <li>¼ red onion, thinly sliced</li>
          <li>2 tbsp olive oil, 1 tbsp red wine vinegar, 1 tsp Dijon, fresh dill</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Season salmon with salt, pepper, and fresh dill.</li>
          <li>Pan-sear in olive oil over medium-high heat, 4–5 min per side.</li>
          <li>Let cool slightly, then flake into chunks.</li>
          <li>Combine arugula, olives, tomatoes, and red onion.</li>
          <li>Dress with olive oil, red wine vinegar, and Dijon; top with flaked salmon.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?shrimp,broccoli,stir+fry" loading="lazy" alt="Shrimp Stir-fry + Broccoli + Quinoa">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 3 — 6:30 PM · Largest Meal</div>
          <div class="recipe-title">Shrimp Stir-fry + Broccoli + Quinoa</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>8 oz raw shrimp, peeled</li>
          <li>2 cups broccoli florets</li>
          <li>½ cup dry quinoa (cook per package → ~1 cup cooked)</li>
          <li>2 cloves garlic, minced</li>
          <li>1 tbsp olive oil</li>
          <li>1 tbsp low-sodium soy sauce, few drops sesame oil, red pepper flakes</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Cook quinoa per package directions; set aside.</li>
          <li>Heat olive oil in a wok or large pan over high heat.</li>
          <li>Add garlic and broccoli; stir-fry 3–4 min until bright green.</li>
          <li>Add shrimp; cook 2 min per side until pink.</li>
          <li>Drizzle soy sauce and sesame oil; toss everything together.</li>
          <li>Serve over quinoa with red pepper flakes.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?protein,shake" loading="lazy" alt="Protein Shake">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Snack — Between Meals</div>
          <div class="recipe-title">Protein Shake</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>1 scoop whey or casein protein powder (&lt;5g sugar per serving)</li>
          <li>8–10 oz cold water or unsweetened almond milk</li>
          <li>Ice (optional)</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Add liquid to shaker cup.</li>
          <li>Add protein powder.</li>
          <li>Shake vigorously 20–30 seconds. Add ice if desired.</li>
        </ol>
      </div>
    </div>

  </div><!-- /meal-day-3 THU -->

  <!-- ── FRIDAY ── -->
  <div class="meal-day-set" id="meal-day-4">

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?sauteed,shrimp,avocado" loading="lazy" alt="Sautéed Shrimp & Avocado Plate">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 1 — 12:00 PM · Break Fast</div>
          <div class="recipe-title">Sautéed Shrimp &amp; Avocado Plate</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>6 oz raw shrimp, peeled and deveined</li>
          <li>1 ripe avocado, sliced</li>
          <li>1 cup baby spinach</li>
          <li>1 tbsp olive oil</li>
          <li>1 clove garlic, minced; lemon juice; paprika; salt; pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Season shrimp with paprika, salt, pepper, and minced garlic.</li>
          <li>Heat olive oil in a skillet over medium-high heat.</li>
          <li>Cook shrimp 2 min per side until pink. Remove from heat.</li>
          <li>Place spinach on plate; top with shrimp and avocado slices.</li>
          <li>Squeeze lemon juice over everything and serve.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?chicken,salad,mediterranean" loading="lazy" alt="Chicken Salad">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 2 — 3:00 PM</div>
          <div class="recipe-title">Chicken Salad (no croutons)</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>6 oz grilled chicken breast, sliced</li>
          <li>2 cups romaine lettuce, chopped</li>
          <li>½ cup cherry tomatoes</li>
          <li>½ cup cucumber, sliced</li>
          <li>¼ cup Kalamata olives</li>
          <li>2 tbsp olive oil, 1 tbsp red wine vinegar, dried oregano, salt, pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Season and grill or pan-sear chicken breast 5–6 min per side; rest and slice.</li>
          <li>Combine romaine, tomatoes, cucumber, and olives in a bowl.</li>
          <li>Whisk olive oil, vinegar, oregano, salt, and pepper.</li>
          <li>Drizzle dressing over salad and toss.</li>
          <li>Top with sliced chicken and serve.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?sea,bass,eggplant" loading="lazy" alt="Sea Bass + Roasted Eggplant + White Beans">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 3 — 6:30 PM · Largest Meal</div>
          <div class="recipe-title">Sea Bass + Roasted Eggplant + White Beans</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>8 oz sea bass fillet</li>
          <li>1 medium eggplant, cubed</li>
          <li>½ cup canned white beans, drained</li>
          <li>3 tbsp olive oil</li>
          <li>2 cloves garlic, minced</li>
          <li>Dried thyme, lemon zest, salt, pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Preheat oven to 425°F.</li>
          <li>Toss eggplant cubes in 2 tbsp olive oil, salt, pepper, and thyme; roast 20–25 min, flipping halfway.</li>
          <li>Season sea bass with salt, pepper, and lemon zest.</li>
          <li>Sear in 1 tbsp olive oil over medium-high heat, 4 min per side.</li>
          <li>Warm white beans with garlic in a small pan.</li>
          <li>Plate sea bass over white beans with roasted eggplant on the side.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?yogurt,strawberries" loading="lazy" alt="Greek Yogurt + Strawberries">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Snack — Between Meals</div>
          <div class="recipe-title">Greek Yogurt + Strawberries</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>1 cup plain full-fat Greek yogurt</li>
          <li>½ cup fresh strawberries, sliced</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Spoon yogurt into a bowl.</li>
          <li>Top with sliced strawberries and serve cold.</li>
        </ol>
      </div>
    </div>

  </div><!-- /meal-day-4 FRI -->

  <!-- ── SATURDAY ── -->
  <div class="meal-day-set" id="meal-day-5">

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?frittata,mediterranean" loading="lazy" alt="Mediterranean Frittata">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 1 — 12:00 PM · Break Fast</div>
          <div class="recipe-title">Mediterranean Frittata</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>4 large eggs + 2 egg whites</li>
          <li>¼ cup roasted red peppers, diced</li>
          <li>¼ cup Kalamata olives, sliced</li>
          <li>1 handful baby spinach</li>
          <li>1 tbsp olive oil</li>
          <li>Salt, pepper, dried oregano</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Preheat oven to 375°F.</li>
          <li>Whisk eggs and egg whites with salt, pepper, and oregano.</li>
          <li>Heat olive oil in an oven-safe skillet over medium heat.</li>
          <li>Sauté spinach 1 min until wilted; add peppers and olives.</li>
          <li>Pour egg mixture over vegetables; cook on stovetop 2 min until edges set.</li>
          <li>Transfer to oven; bake 8–10 min until puffed and set in the center.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?grilled,shrimp,avocado,bowl" loading="lazy" alt="Grilled Shrimp & Avocado Bowl">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 2 — 3:00 PM</div>
          <div class="recipe-title">Grilled Shrimp &amp; Avocado Bowl</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>6 oz raw shrimp, peeled</li>
          <li>1 ripe avocado, sliced</li>
          <li>2 cups mixed greens</li>
          <li>½ cup cherry tomatoes</li>
          <li>2 tbsp olive oil, 1 tbsp lemon juice</li>
          <li>1 clove garlic, minced; paprika; salt; pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Toss shrimp in olive oil, garlic, paprika, salt, and pepper.</li>
          <li>Grill or pan-sear 2 min per side until pink.</li>
          <li>Arrange greens, avocado, and tomatoes in a bowl.</li>
          <li>Top with shrimp; drizzle with lemon juice and olive oil.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?slow,roasted,salmon,asparagus" loading="lazy" alt="Slow-Roasted Salmon + Asparagus + Lentils">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 3 — 6:30 PM · Largest Meal</div>
          <div class="recipe-title">Slow-Roasted Salmon + Asparagus + Lentils</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>8 oz salmon fillet</li>
          <li>1 bunch asparagus, trimmed</li>
          <li>½ cup canned green lentils, drained</li>
          <li>3 tbsp olive oil</li>
          <li>1 lemon (juice + zest), fresh dill, garlic, salt, pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Preheat oven to 275°F.</li>
          <li>Rub salmon with 1 tbsp olive oil, lemon zest, dill, salt, and pepper.</li>
          <li>Roast salmon 25–30 min until just translucent in the center.</li>
          <li>Meanwhile, toss asparagus in olive oil; roast at 425°F for 12 min (use a separate pan).</li>
          <li>Warm lentils with garlic and olive oil in a small saucepan.</li>
          <li>Plate salmon over lentils with asparagus. Squeeze lemon over all.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?almonds,cheese,snack" loading="lazy" alt="Almonds + String Cheese">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Snack — Between Meals</div>
          <div class="recipe-title">Almonds + String Cheese</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>¼ cup raw almonds</li>
          <li>2 sticks string cheese</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>No prep needed. Serve almonds and string cheese together.</li>
        </ol>
      </div>
    </div>

  </div><!-- /meal-day-5 SAT -->

  <!-- ── SUNDAY ── -->
  <div class="meal-day-set" id="meal-day-6">

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?omelette,spinach,eggs" loading="lazy" alt="Egg White Omelette + Spinach">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 1 — 12:00 PM · Break Fast</div>
          <div class="recipe-title">Egg White Omelette + Spinach</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>5 egg whites + 1 whole egg</li>
          <li>1 cup baby spinach</li>
          <li>¼ cup roasted red peppers, diced</li>
          <li>½ avocado, sliced (daily non-negotiable)</li>
          <li>1 tbsp olive oil, salt, pepper, garlic powder</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Whisk egg whites and whole egg with salt, pepper, and garlic powder.</li>
          <li>Heat olive oil in a non-stick pan over medium heat.</li>
          <li>Add spinach; sauté until wilted, 1–2 min. Add peppers; stir briefly.</li>
          <li>Pour egg mixture over vegetables.</li>
          <li>Fold omelette in half once edges are set; cook 1 min more.</li>
          <li>Serve hot alongside sliced avocado.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?chickpea,chicken,salad" loading="lazy" alt="Chicken & Chickpea Salad">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 2 — 3:00 PM</div>
          <div class="recipe-title">Chicken &amp; Chickpea Salad</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>6 oz grilled chicken breast, sliced</li>
          <li>½ cup canned chickpeas, drained</li>
          <li>2 cups arugula</li>
          <li>½ cup cucumber, diced</li>
          <li>¼ red onion, thinly sliced</li>
          <li>2 tbsp olive oil, 1 tbsp lemon juice, 1 tsp Dijon, salt, pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Season and grill chicken 5–6 min per side; rest and slice.</li>
          <li>Combine chickpeas, arugula, cucumber, and red onion in a bowl.</li>
          <li>Whisk olive oil, lemon juice, and Dijon; season with salt and pepper.</li>
          <li>Pour dressing over salad and toss.</li>
          <li>Top with sliced chicken and serve.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?roasted,chicken,cauliflower" loading="lazy" alt="Herb-Roasted Chicken + Cauliflower + Chickpeas">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Meal 3 — 6:30 PM · Largest Meal</div>
          <div class="recipe-title">Herb-Roasted Chicken + Cauliflower + Chickpeas</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>2 bone-in chicken thighs or 1 large breast</li>
          <li>2 cups cauliflower florets</li>
          <li>½ cup canned chickpeas, drained and rinsed</li>
          <li>3 tbsp olive oil</li>
          <li>2 cloves garlic, minced</li>
          <li>Dried rosemary, thyme, paprika, salt, pepper</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Preheat oven to 425°F.</li>
          <li>Rub chicken with 1 tbsp olive oil, garlic, rosemary, thyme, paprika, salt, and pepper.</li>
          <li>Toss cauliflower and chickpeas in remaining 2 tbsp olive oil with salt and pepper; spread on sheet pan.</li>
          <li>Nestle chicken on top of vegetables.</li>
          <li>Roast 25–30 min until chicken is golden (165°F internal) and cauliflower is caramelized.</li>
          <li>Rest 5 min before serving.</li>
        </ol>
      </div>
    </div>

    <div class="recipe-card" onclick="toggleRecipe(this)">
      <img class="recipe-photo" src="https://source.unsplash.com/600x300/?eggs,walnuts,snack" loading="lazy" alt="Hard-Boiled Eggs + Walnuts">
      <div class="recipe-header">
        <div class="recipe-header-left">
          <div class="recipe-label">Snack — Between Meals</div>
          <div class="recipe-title">Hard-Boiled Eggs + Walnuts</div>
        </div>
        <span class="recipe-chevron">▼</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-section-label">Ingredients</div>
        <ul>
          <li>2 large eggs</li>
          <li>¼ cup walnuts</li>
        </ul>
        <div class="recipe-section-label">Steps</div>
        <ol>
          <li>Place eggs in a pot; cover with cold water by 1 inch.</li>
          <li>Bring to a boil; cover, remove from heat, and let sit 10–12 min.</li>
          <li>Transfer to ice water for 5 min. Peel and serve alongside walnuts.</li>
        </ol>
      </div>
    </div>

  </div><!-- /meal-day-6 SUN -->
```

- [ ] **Step 3: Verify all 7 day sets appear in source**

```bash
grep -c 'meal-day-set' index.html
```
Expected: 14 (7 opening divs + 7 closing comments)

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: replace static meal cards with 7-day meal system in nutrition screen"
```

---

## Task 3: Add switchDay JS + auto-default

**Files:**
- Modify: `index.html` — `<script>` block, after `toggleCheck` function

- [ ] **Step 1: Add switchDay function and DOMContentLoaded auto-default**

Insert after `function toggleCheck(el) { el.classList.toggle('checked'); }`:

```javascript
  function toggleRecipe(card) {
    card.classList.toggle('open');
  }

  function switchDay(idx, btn) {
    document.querySelectorAll('.meal-day-set').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
    document.getElementById('meal-day-' + idx).classList.add('active');
    if (btn) btn.classList.add('active');
  }

  // Auto-default nutrition to today's day on page load
  // JS getDay(): 0=Sun,1=Mon,...,6=Sat → our indices: Mon=0,Tue=1,...,Sun=6
  document.addEventListener('DOMContentLoaded', function() {
    const jsDay = new Date().getDay();
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sun→6, Mon→0, Tue→1...Sat→5
    const todayIdx = dayMap[jsDay];
    const pills = document.querySelectorAll('.day-pill');
    switchDay(todayIdx, pills[todayIdx]);
  });
```

- [ ] **Step 2: Open in browser and verify**

- Nutrition tab shows today's day pre-selected (pill highlighted gold)
- Tapping a different day pill swaps the meal cards
- Tapping a recipe card expands/collapses it with chevron rotation
- Photos load (may briefly show gray placeholder before Unsplash loads)
- All 7 days have 4 cards each

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add switchDay JS and auto-default to today for nutrition day selector"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Day selector pill row (MON–SUN) with day colors, active = gold accent
- ✅ Auto-defaults to today via `new Date().getDay()`
- ✅ 7 unique days × 4 meals = 28 recipe cards
- ✅ Each card: Unsplash photo, meal label + time, dish name, expandable accordion
- ✅ Accordion reuses open/close chevron pattern
- ✅ Avocado on every day (Mon M1, Tue M1, Wed M1 side, Thu M1, Fri M1, Sat M2, Sun M1 side)
- ✅ No tuna fish, no smoked salmon
- ✅ Hero, macros row, eating window, rules, back protocol all unchanged

**Placeholder scan:** None found.

**Type consistency:** `switchDay(idx, btn)` used consistently. `toggleRecipe(card)` used consistently. `meal-day-{0..6}` IDs match `switchDay` references.
