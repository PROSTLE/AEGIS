```markdown
# Design System Strategy: The Sovereign Intelligence Engine

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Sovereign Intelligence Engine."** 

This system moves away from the cluttered, grid-heavy dashboard of the past toward a high-end editorial experience. It is designed to feel like a premium command center—authoritative, deep, and illuminated. We achieve this by rejecting "template-style" symmetry. Instead, we use intentional white space (negative space) and overlapping layers to create a sense of momentum. Data isn't just displayed; it is showcased on a stage of deep ink and glass, utilizing high-contrast typography to ensure that critical Indian market insights are felt, not just read.

## 2. Colors
Our palette is rooted in the depth of a midnight sky, punctuated by the vibrant "glow" of intelligence.

*   **Background (`#0e0e0e`):** The foundation. It is an infinite canvas that allows accent colors to pop with neon-like intensity.
*   **Primary (`primary` / `#85adff`):** Our Electric Blue. Used for primary actions and "active" states of intelligence modules.
*   **Secondary (`secondary` / `#69f6b8`):** Our Cyber Green. Reserved strictly for growth metrics, success scores, and "Live" indicators.
*   **Tertiary (`tertiary` / `#c180ff`):** The AI Purple. A signature hue used exclusively for "AI Guide" or predictive features.

### The "No-Line" Rule
Standard UI relies on 1px borders to separate content. **This design system prohibits 1px solid borders for sectioning.** Boundaries must be defined through:
*   **Tonal Shifts:** Placing a `surface-container-high` card against a `surface` background.
*   **Spacing:** Using large gaps (Scale `12` to `20`) to define hierarchy.
*   **Glows:** A soft `secondary` outer glow can define a high-score card without a single line being drawn.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `surface`
*   **Sub-sections:** `surface-container-low`
*   **Interactive Cards:** `surface-container-highest` or semi-transparent Glassmorphism.
By nesting a `surface-container-lowest` element inside a `surface-container-high` card, you create "recessed" depth that feels sophisticated and intentional.

## 3. Typography
We use a tri-font system to create a high-contrast, editorial feel.

*   **Display & Headlines (Manrope):** Chosen for its modern, geometric structure. Used in `display-lg` and `headline-md` to make bold statements.
*   **Body & Titles (Inter):** The workhorse. Inter provides maximum legibility for dense startup data.
*   **Data & Labels (Space Grotesk):** A "tech-flavoured" sans-serif used for scores, timestamps, and CAP-table values (`label-md`). Its idiosyncratic letterforms signal that this is a "high-tech" platform.

**Editorial Tip:** Use `display-sm` for key numbers. A "74/100" score should be massive and authoritative, dwarfing the surrounding labels to create a clear visual entry point.

## 4. Elevation & Depth
Depth is the difference between a "flat app" and a "premium platform."

*   **The Layering Principle:** Stack `surface-container` tiers to create a natural lift. A card shouldn't just "sit" on the background; it should feel like it's floating at a specific altitude.
*   **Glassmorphism:** For mobile-first overlays and navigation bars, use semi-transparent surface colors with a `20px` to `40px` backdrop blur. This allows the vibrant green and blue "glows" from background data to bleed through, maintaining a sense of place.
*   **Ambient Shadows:** Use `on-surface` color for shadows at `4-8%` opacity with a blur radius of `32px` or higher. Avoid hard black shadows; we want the "ambient light" of the screen to feel natural.
*   **The Ghost Border:** For accessibility, you may use a `10%` opacity `outline-variant`. It should be felt more than seen—a "whisper" of a container.

## 5. Components

### Buttons
*   **Primary:** A gradient transition from `primary` to `primary-container`. High roundedness (`full`). No border.
*   **Secondary:** Glassmorphic background with a `Ghost Border`.
*   **AI Action:** A subtle `tertiary` (purple) outer glow to signify the "AI Guide" is active.

### Cards & Intelligence Modules
*   **Strictly no dividers.** Use the Spacing Scale `6` (1.5rem) to separate internal card elements. 
*   **Header:** Use `title-sm` in `on-surface-variant` for metadata, and `headline-sm` for the primary metric.
*   **Rounding:** Apply `md` (0.75rem) to standard cards and `xl` (1.5rem) to main hero containers to create a "nested" visual language.

### Input Fields
*   **State:** Use `surface-container-highest` for the field background. 
*   **Focus:** Instead of a thick border, use a subtle `primary` outer glow and shift the background to `surface-bright`.

### Additional Component: The "Pulse" Indicator
For "Live India Data," use a `secondary` (green) dot with a radiating, semi-transparent ripple effect. This adds "life" to the dashboard without adding clutter.

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Place a large score on the left and a small trend line on the right. Let the layout breathe.
*   **Use High Contrast:** Ensure `on-surface` (white) text sits on `surface` (near-black) backgrounds for that "premium OLED" look.
*   **Prioritize Mobile Flow:** Stack cards vertically with generous `spacing-8` between them to avoid the "cluttered dashboard" feel of the reference image.

### Don't:
*   **Don't use 100% opaque borders.** It breaks the "Sovereign Engine" illusion and makes the UI look like a 2015-era template.
*   **Don't crowd the viewport.** If a screen feels busy, increase the spacing values or move secondary data into a "Deep Dive" sheet.
*   **Don't use "Standard" Grey.** Every neutral should be tinted with a hint of navy (the `surface` and `surface-variant` tokens) to maintain the "high-tech" dark mode theme.
*   **Don't use Dividers.** If you feel the need for a line, use a background color shift instead. Consistency in this rule is what defines the signature identity.```