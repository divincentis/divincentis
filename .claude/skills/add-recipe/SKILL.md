---
name: add-recipe
description: Add a new recipe page to divincentis.com. Use when the user gives a recipe (pasted text, a link, a photo, or rough notes) and asks for it to be added to the site, or asks to update an existing recipe page.
---

# Adding a recipe to divincentis.com

The site is plain static HTML on GitHub Pages: no build step, no framework. Pushing to `main` publishes it. Every recipe is one hand-written page in `recipes/`, listed by hand in `recipes.html`.

## Steps

1. **Read an existing recipe first** (e.g. `recipes/chickenchili.html` for a simple one, `recipes/creamyrosemarypotatoes.html` for one with phased instructions) and copy its structure exactly.
2. **Create `recipes/<name>.html`**: lowercase, no spaces or hyphens, e.g. `bursttomatopasta.html`.
3. **Add a card to `recipes.html`** in the right section (see "Index entry").
4. **Check it in a browser** at phone width (375px). Serve the repo root locally (`python3 -m http.server 8765` from this folder, or the `site` config in `/home/matt/projects/divincentis/.claude/launch.json` if it exists), open `/recipes/<name>.html`, and confirm nothing overflows horizontally and the checkboxes work.
5. **Tell the user what you assumed** (conversions you calculated, times you estimated, tags you chose), then ask before committing or pushing. Pushing to `main` deploys the live site.

## Page template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../styles.css">
    <title>Recipe Name 🍲</title>
</head>
<body>
    <div class="site-corner">divincentis.com</div>
    <nav>
        <ul>
            <li><a href="../recipes.html">Home</a></li>
            <li><a href="../recipes.html">Recipes</a></li>
            <li><a href="../about.html">About</a></li>
        </ul>
    </nav>

    <article class="recipe-card">
        <h1>Recipe Name 🍲</h1>

        <div class="meta">
            Prep Time: 10 mins | Cook Time: 20 mins | Yield: 4 servings
            <button type="button" class="reset-button">Reset Checkboxes</button>
        </div>

        <p class="text-muted">One or two sentences describing the dish.</p>

        <h2>Equipment Needed</h2>
        <ul class="checklist">
            <li><label><input type="checkbox">Large skillet</label></li>
        </ul>

        <h2>Ingredients</h2>

        <h3>Group Name</h3>
        <ul class="checklist">
            <li><label><input type="checkbox">240g (2 cups) all-purpose flour</label></li>
        </ul>

        <h2>Instructions</h2>
        <ol class="checklist">
            <li><label><input type="checkbox"><span>Whisk <span class="qty">240g (2 cups)</span> flour with ...</span></label></li>
        </ol>

        <h2>Notes</h2>
        <ul>
            <li>Tips, make-ahead and storage info, substitutions.</li>
        </ul>
    </article>

    <footer class="text-center text-muted">
        <hr>
        <p class="text-small">Recipe adapted from Source Name</p>
    </footer>

    <script src="../recipe.js"></script>
</body>
</html>
```

### Rules for each part

- **Title**: the same text in `<title>` and `<h1>`, ending with one fitting food emoji.
- **Meta line**: `Prep Time | Cook Time | Yield`, separated by ` | `. Add extra stages where they matter (`Marinate: 4 hrs`, `Chill Time: ...`, `Rest Time: ...`). Keep the reset button inside the meta div.
- **Equipment, Ingredients, Instructions**: all are `checklist` lists, and every item uses `<li><label><input type="checkbox">...</label></li>`. `recipe.js` saves checkbox progress for 12 hours, keeps the screen awake, and runs the reset button, so always include the script tag.
- **Ingredient groups**: use `<h3>` subheadings (e.g. "Dry Ingredients", "For the Sauce", "For Serving") when the recipe has distinct parts. Leave them out for short recipes.
- **Notes**: a plain `<ul>` (no checkboxes). Add `<h2>Variations</h2>` the same way if the recipe has them.
- **Footer**: credit the source (`Recipe adapted from ...`). If there's no source, use `Recipe adapted for the family collection`.

### Amounts and units

- **Use both units** in the ingredient list, usually grams first for baking (`240g (2 cups) flour`) and the natural unit first for cooking (`1 can (14 oz / 414ml) chicken broth`). Spoon amounts of small things (spices, extracts) and counts (`2 cloves garlic`, `4 large eggs`) need only one unit.
- **If the source gives only one unit, add the conversion.** `ingredientweights.html` has a volume/grams/ounces table for common ingredients, so use it before estimating. Round sensibly (450g for 1 lb, 240ml for 1 cup).
- **Write tablespoon and teaspoon in full in the ingredient list**, and as `tbsp` / `tsp` in the steps.

### Instruction steps (important)

Each step repeats the amount of every ingredient it uses, so cooks don't scroll back up to the ingredient list:

- Wrap **the whole step text** in a plain `<span>`. The label is a flex container, so without this wrapper every inline element becomes its own column.
- Wrap **each amount** in `<span class="qty">`, giving both units the same way the ingredient list does:
  `<span>Add <span class="qty">1 can (14 oz / 414ml)</span> chicken broth and <span class="qty">2 tsp</span> cumin.</span>`
- Mark only the amount, not the ingredient name. Steps that don't add an ingredient ("Bake for 20 minutes") get no `qty`.
- When an ingredient is split across steps, give each step its share (`half the onion`, `the remaining <span class="qty">50g (½ cup)</span> Parmesan`).
- **The amounts in the steps must add up to what's in the ingredient list.** Check this before you finish. If the source recipe contradicts itself, ask the user rather than guessing.
- Optional step labels go at the start of a step: `Make the sauce: ...` or `<strong>Make the sauce:</strong> ...` (match whichever style you use across the page).
- **Long recipes with distinct phases**: put an `<h3>` before each phase's `<ol class="checklist">`, and continue numbering with `start`, e.g. `<ol class="checklist" start="4">`. See `recipes/creamyrosemarypotatoes.html` and `recipes/sundaysauce.html`.

## Index entry (`recipes.html`)

Add a card inside the matching section's `<div class="recipe-grid">`. The sections are Breakfast, Main Dishes, Side Dishes, Desserts, and Beverages.

```html
<div class="recipe-item" data-tags="main,quick">
    <h3><a href="recipes/<name>.html">Recipe Name</a></h3>
    <p class="text-muted">Short one-line description</p>
    <div class="recipe-tags">
        <span class="tag">main</span>
        <span class="tag">quick</span>
    </div>
</div>
```

- Choose tags only from the filter buttons at the top of `recipes.html`: currently `breakfast`, `main`, `side`, `dessert`, `beverage`, `quick`, `vegetarian`, `grill`. Recheck that list before tagging, because it's the source of truth. `data-tags` is comma-separated with no spaces, and each tag needs a matching `<span class="tag">`.
- `quick` means about 30 minutes or less in total. `vegetarian` means no meat or fish, including the broth.
- The card title can be shorter than the page title, without the emoji.

## Don'ts

- Don't add frameworks, build tools, external scripts or fonts, or new CSS files. Put any new style in `styles.css` using the existing colour variables (`--accent`, `--muted`, etc.) so dark mode keeps working.
- Don't copy a source's long story or commentary. Keep the description to a sentence or two.
- Don't commit or push without the user's go-ahead.
