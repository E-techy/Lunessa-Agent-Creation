# CSS Architecture Documentation

## Overview
The CSS has been reorganized into a modular structure for better maintainability and organization.

## File Structure

```
css/
├── variables.css           # CSS custom properties and color palette
├── base.css               # Reset styles and base typography
├── components/            # Reusable UI components
│   ├── header.css         # Header navigation styles
│   ├── card.css           # Card component styles
│   ├── progress.css       # Progress bar component
│   ├── forms.css          # Form elements and inputs
│   ├── buttons.css        # Button styles and variants
│   ├── items.css          # Item card components
│   ├── import.css         # File import section
│   └── footer.css         # Footer component
├── layouts/               # Page layout styles
│   ├── hero.css           # Hero section and dashboard mockup
│   └── main.css           # Main content container
└── utilities/             # Helper classes and utilities
    ├── animations.css     # All CSS animations and keyframes
    └── responsive.css     # Media queries and responsive styles

styles.css                 # Main entry point (imports all modules)
```

## Key Features

### 1. CSS Variables (variables.css)
- Centralized color palette
- Consistent spacing and typography scales
- Easy theme customization

### 2. Component-Based Architecture
Each component is self-contained with its own CSS file:
- **Header**: Navigation and logo styles
- **Card**: Professional card containers
- **Progress**: Progress bar indicators
- **Forms**: Input fields and form layouts
- **Buttons**: All button variants and states
- **Items**: Dynamic item card components
- **Import**: File upload and drag-drop interface
- **Footer**: Site footer styles

### 3. Layout Management
- **Hero**: Landing section with animations
- **Main**: Content container and page structure

### 4. Utilities
- **Animations**: All keyframe animations in one place
- **Responsive**: Mobile-first responsive design rules

## Usage

The main CSS file (`styles.css`) imports all modules in the correct order:

```css
/* Base Styles */
@import './css/variables.css';
@import './css/base.css';

/* Layout Styles */
@import './css/layouts/hero.css';
@import './css/layouts/main.css';

/* Component Styles */
@import './css/components/header.css';
/* ... other components ... */

/* Utility Styles */
@import './css/utilities/animations.css';
@import './css/utilities/responsive.css';
```

## Benefits

1. **Maintainability**: Easy to locate and modify specific components
2. **Scalability**: Add new components without affecting existing ones
3. **Reusability**: Components can be easily reused across projects
4. **Team Development**: Multiple developers can work on different components
5. **Performance**: Only load what you need (if using a build system)
6. **Organization**: Logical grouping makes codebase easier to understand

## Customization

To customize the design:

1. **Colors**: Modify `variables.css` to change the color palette
2. **Components**: Edit individual component files for specific changes
3. **Responsive**: Update `responsive.css` for mobile adjustments
4. **Animations**: Modify `animations.css` for motion effects

## Migration Notes

- The original `company_agent_detail.css` has been split into logical modules
- The HTML file now references `styles.css` as the main entry point
- All functionality remains intact - only organization has changed
- Easy to revert by switching back to the original CSS file if needed
