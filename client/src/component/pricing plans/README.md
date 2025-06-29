# MakeMyTrip-Style Event Customization UI

This directory contains the modern, user-friendly event customization interface inspired by MakeMyTrip's booking experience.

## 🎯 Features

### Modern Design
- **Gradient backgrounds** and modern color schemes
- **Card-based layouts** with hover effects and animations
- **Responsive design** that works on all devices
- **Smooth transitions** and micro-interactions

### User Experience
- **Step-by-step wizard** with progress indicators
- **Real-time price updates** as users make selections
- **Intuitive navigation** with clear call-to-action buttons
- **Mobile-first approach** with touch-friendly interfaces

### Event Types Supported
- 🎉 **Wedding** - Complete wedding planning with premium services
- 🎂 **Birthday** - Birthday celebrations and parties
- 💼 **Corporate** - Professional corporate events
- 👥 **Social** - Social gatherings and celebrations
- 🎵 **Concert** - Musical events and performances
- 💍 **Engagement** - Engagement ceremonies and celebrations

## 📁 Components

### Core Components

#### `CustomPackage.jsx`
The main component that orchestrates the entire event customization flow.

**Features:**
- Multi-step wizard interface
- Real-time price calculation
- Responsive layout with sidebar price summary
- Mobile-optimized with bottom sheet price summary

#### `EventBasics.jsx`
First step of the customization process - collecting basic event information.

**Features:**
- Event type selection with visual cards
- Date and time picker with intuitive interface
- Location selection dropdown
- Guest count slider with visual feedback
- Venue requirement selection

#### `PriceSummary.jsx`
Real-time price breakdown and summary component.

**Features:**
- Live price updates as selections change
- Detailed breakdown by service category
- Mobile-responsive with bottom sheet
- Savings badges for package deals
- Professional currency formatting

#### `ProgressBar.jsx`
Visual progress indicator for the multi-step process.

**Features:**
- Step-by-step progress visualization
- Completion percentage display
- Icon-based step indicators
- Animated progress transitions

### Supporting Components

#### `EventCustomizationDemo.jsx`
Landing page showcasing the event customization features.

**Features:**
- Hero section with call-to-action
- Feature highlights and benefits
- Event type statistics
- Modern landing page design

## 🎨 Design System

### Color Palette
- **Primary**: Pink (#ec4899) to Purple (#8b5cf6) gradient
- **Secondary**: Gray scale for text and backgrounds
- **Accent**: Green for success states, Blue for information

### Typography
- **Headings**: Bold, large fonts with gradient text effects
- **Body**: Clean, readable fonts with proper hierarchy
- **Responsive**: Font sizes that adapt to screen size

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, hover animations
- **Inputs**: Modern styling with focus states
- **Sliders**: Custom styled with gradient thumbs

## 🚀 Getting Started

### Prerequisites
- React 18+
- Tailwind CSS
- React Icons (Feather Icons)

### Installation
The components are already integrated into the project. To use them:

1. **Import the main component:**
```jsx
import CustomPackage from './component/pricing plans/CustomPackage';
```

2. **Use in your app:**
```jsx
function App() {
  return (
    <div>
      <CustomPackage />
    </div>
  );
}
```

### Demo Page
To see the full demo with landing page:

```jsx
import EventCustomizationDemo from './component/pricing plans/EventCustomizationDemo';
```

## 📱 Mobile Experience

### Responsive Features
- **Mobile-first design** with progressive enhancement
- **Touch-friendly** buttons and interactive elements
- **Bottom sheet** price summary for mobile devices
- **Optimized layouts** for different screen sizes

### Mobile-Specific Components
- Floating action button for price summary
- Swipeable cards and sections
- Mobile-optimized form inputs
- Touch-friendly sliders and pickers

## 🎯 User Flow

1. **Event Basics** - Select event type, date, time, location, and guest count
2. **Venue Selection** - Choose venue type and amenities (if needed)
3. **Service Selection** - Add catering, decor, photography, entertainment, and other services
4. **Review & Payment** - Review selections and proceed to payment

## 💰 Pricing System

### Transparent Pricing
- **Real-time calculations** as users make selections
- **Service fee breakdown** clearly displayed
- **Package savings** highlighted for better deals
- **Currency formatting** in Indian Rupees (INR)

### Pricing Categories
- **Basic** - Essential services at affordable rates
- **Standard** - Balanced quality and value
- **Premium** - High-end services and luxury options

## 🔧 Customization

### Adding New Event Types
1. Update the `CONFIG.eventTypes` array in `CustomPackage.jsx`
2. Add corresponding icons and colors
3. Update service fee percentages if needed

### Adding New Services
1. Add service configuration to the appropriate section in `CONFIG`
2. Update the price calculation logic in `calculateTotal()`
3. Add service display logic in `PriceSummary.jsx`

### Styling Customization
- Modify CSS classes in `App.css`
- Update Tailwind classes in components
- Customize color schemes and gradients

## 🎨 CSS Classes

### Custom Classes Added
- `.slider` - Custom styled range inputs
- `.card-hover` - Hover effects for cards
- `.gradient-text` - Gradient text effects
- `.btn-primary` - Primary button styling
- `.input-modern` - Modern input styling
- `.select-modern` - Modern select styling

### Animation Classes
- `.slide-in` - Slide in animation
- `.slide-out` - Slide out animation
- `.pulse` - Pulse animation
- `.bounce` - Bounce animation
- `.spinner` - Loading spinner

## 🔍 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📈 Performance

### Optimizations
- **Lazy loading** of components
- **Memoized calculations** for price updates
- **Efficient re-renders** with React hooks
- **Optimized animations** with CSS transforms

### Best Practices
- **Accessibility** features included
- **SEO-friendly** component structure
- **Progressive enhancement** approach
- **Mobile-first** responsive design

## 🤝 Contributing

When contributing to this component:

1. **Follow the existing design patterns**
2. **Maintain responsive behavior**
3. **Add proper accessibility features**
4. **Test on multiple devices**
5. **Update documentation** for new features

## 📄 License

This component is part of the DreamVentz project and follows the same licensing terms.

---

**Built with ❤️ for modern event planning experiences** 