"use client"
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChefHat, Trash2, Plus, Dice6 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Recipe {
    id: string;
    title: string;
    ingredients: string[];
    instructions: string[];
    cookingTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
    servings: number;
}

interface IngredientTagProps {
    ingredient: string;
    onRemove: () => void;
}

const MOCK_RECIPES: Recipe[] = [
    {
        id: '1',
        title: "Pasta Primavera",
        ingredients: ["pasta", "tomato", "zucchini", "garlic"],
        instructions: [
            "Boil water and cook pasta according to package instructions",
            "Dice vegetables while pasta cooks",
            "Sauté garlic until fragrant",
            "Add vegetables and cook until tender",
            "Combine with pasta and serve hot"
        ],
        cookingTime: "20 mins",
        difficulty: "easy",
        servings: 4
    },
    {
        id: '2',
        title: "Quick Stir Fry",
        ingredients: ["rice", "carrot", "soy sauce", "chicken"],
        instructions: [
            "Cook rice in rice cooker or pot",
            "Cut chicken into bite-sized pieces",
            "Stir fry chicken until golden",
            "Add vegetables and cook until tender",
            "Season with soy sauce and serve over rice"
        ],
        cookingTime: "15 mins",
        difficulty: "medium",
        servings: 2
    }
];

const IngredientTag: React.FC<IngredientTagProps> = ({ ingredient, onRemove }) => (
    <div className="flex items-center gap-1 bg-blue-100 rounded-full px-3 py-1 animate-fadeIn">
        <span className="capitalize">{ingredient}</span>
        <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label={`Remove ${ingredient}`}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
);

const RecipeDisplay: React.FC<{ recipe: Recipe }> = ({ recipe }) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
        <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
        <div className="flex gap-4 mb-4">
            <span className="text-sm text-gray-600">⏱️ {recipe.cookingTime}</span>
            <span className="text-sm text-gray-600">👥 Serves {recipe.servings}</span>
            <span className="text-sm text-gray-600">
                📊 {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
            </span>
        </div>
        <div className="mb-4">
            <h4 className="font-semibold mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-1">
                {recipe.ingredients.map((ing, index) => (
                    <li key={index} className="text-gray-700 capitalize">
                        {ing}
                    </li>
                ))}
            </ul>
        </div>
        <div>
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ol className="space-y-2">
                {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700 ml-4">
                        {instruction}
                    </li>
                ))}
            </ol>
        </div>
    </div>
)

const RecipeRoulette: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [error, setError] = useState<string>('');

    const handleIngredientAdd = useCallback(() => {
        const trimmedIngredient = currentIngredient.trim().toLowerCase();
        if (!trimmedIngredient) {
            setError('Please enter an ingredient');
            return;
        }
        if (ingredients.includes(trimmedIngredient)) {
            setError('This ingredient is already added');
            return;
        }
        setIngredients(prev => [...prev, trimmedIngredient]);
        setCurrentIngredient('');
        setError('');
    }, [currentIngredient, ingredients]);

    const handleIngredientRemove = useCallback((index: number) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    }, []);

    const findRecipe = useCallback(() => {
        const matchedRecipes = MOCK_RECIPES.filter(recipe =>
            recipe.ingredients.some(ing =>
                ingredients.includes(ing.toLowerCase())
            )
        );

        if (matchedRecipes.length === 0) {
            setError('No recipes found with these ingredients. Try different ingredients!');
            setRecipe(null);
            return;
        }

        const randomRecipe = matchedRecipes[Math.floor(Math.random() * matchedRecipes.length)];
        setRecipe(randomRecipe);
        setError('');
    }, [ingredients]);

    const isIngredientValid = useMemo(() =>
        currentIngredient.trim() !== '' && !ingredients.includes(currentIngredient.trim().toLowerCase()),
        [currentIngredient, ingredients]
    );

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ChefHat className="w-6 h-6"/>
                            DishDice
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={currentIngredient}
                            onChange={(e) => setCurrentIngredient(e.target.value)}
                            placeholder ="Enter an ingredient"
                            onKeyDown={(e) => e.key === 'Enter' && isIngredientValid && handleIngredientAdd()}
                            aria-label="Ingredient input"
                        />
                        <Button 
                            onClick={handleIngredientAdd}
                            disabled={!isIngredientValid}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {ingredients.map((ing, index) => (
                           <IngredientTag
                                key={ing}
                                ingredient={ing}
                                onRemove={() => handleIngredientRemove(index)}
                           />
                        ))}
                    </div>

                    <Button
                        onClick={findRecipe}
                        className="w-full"
                        disabled={ingredients.length === 0}
                    >
                        <Dice6 className="w-4 h-4 mr-2" />
                        Find Random Dish
                    </Button>

                    {recipe && <RecipeDisplay recipe={recipe} />}
                </CardContent>
            </Card>
        </div>
    );
};

export default RecipeRoulette;