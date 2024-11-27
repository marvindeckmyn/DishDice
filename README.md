# 🎲 DishDice

DishDice is a web application that helps you discover recipes based on ingredients you have available. Simply input your ingredients and get recipe suggestions powered by the Spoonacular API!

## ✨ Features

- **Ingredient Management**: Add and remove ingredients with a clean, intuitive interface
- **Recipe Discovery**: Find recipes that match your available ingredients
- **Detailed Recipes**: Get comprehensive recipe information including:
  - Cooking time and servings
  - Complete ingredient list
  - Step-by-step instructions
  - Recipe images
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Error Handling**: Clear feedback for API issues and input validation
- **Modern UI**: Sleek interface with smooth animations and transitions

## 🛠️ Tech Stack

- **Frontend Framework**:
  - Next.js (App Router)
  - React 19
  - TypeScript
- **Styling**:
  - Tailwind CSS
  - Shadcn UI Components
- **API Integration**:
  - Spoonacular API
  - Axios for HTTP requests
- **Testing**:
  - Jest
  - React Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm
- Spoonacular API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/marvindeckmyn/DishDice.git
```

2. Install dependencies
```bash
cd DishDice
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory and add:
```env
NEXT_PUBLIC_SPOONACULAR_API_KEY=your_api_key_here
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running Tests
```bash
npm test        # Run tests once
npm test:watch  # Run tests in watch mode
```

## 📝 Code Structure

```
src/
├── app/                 # Next.js app router
├── components/         
│   ├── ui/             # Shadcn UI components
│   └── RecipeRoulette  # Main application component
├── services/
│   └── recipeService   # API integration
└── __tests__/          # Test files
```

## 🌟 Key Features Implemented

- **API Integration**: Connected to Spoonacular API for recipe data
- **Error Handling**: Comprehensive error states and loading indicators
- **Input Validation**: Prevents duplicate ingredients and empty submissions
- **Responsive Design**: Mobile-first approach with fluid layouts
- **Performance**: Optimized re-renders using React hooks (useCallback, useMemo)
- **Testing**: Unit and integration tests for core functionality

## 👨‍💻 Contributing

While this project is complete for its current scope, suggestions and feedback are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contact

Marvin Deckmyn - [GitHub Profile](https://github.com/marvindeckmyn)

Project Link: [https://github.com/marvindeckmyn/DishDice](https://github.com/marvindeckmyn/DishDice)