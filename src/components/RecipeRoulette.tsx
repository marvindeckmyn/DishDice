"use client"
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChefHat, Trash2, Plus, Dice6, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { recipeService, SpoonacularRecipe } from '@/services/recipeService';

interface IngredientTagProps {
    ingredient: string;
    onRemove: () => void;
}

const IngredientTag: React.FC<IngredientTagProps> = ({ ingredient, onRemove }) => (
    <div className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-3 py-1 animate-fadeIn hover:shadow-md transition-all duration-200">
        <span className="capitalize text-gray-700">{ingredient}</span>
        <button
            onClick={onRemove}
            className="text-purple-500 hover:text-red-600 transition-colors"
            aria-label={`Remove ${ingredient}`}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
);

const RecipeDisplay: React.FC<{ recipe: SpoonacularRecipe }> = ({ recipe }) => (
    <div className="mt-4 p-6 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-md animate-fadeIn border border-blue-100">
        <div className="pb-4 flex items-start gap-6">
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-32 h-32 object-cover rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200"
                />
            )}
            <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{recipe.title}</h3>
                <div className="flex gap-4 mb-4">
                    <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">⏱️ {recipe.readyInMinutes} mins</span>
                    <span className="text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">👥 Serves {recipe.servings}</span>
                </div>
            </div>
        </div>

        <div className="mb-6">
            <h4 className="font-semibold mb-3 text-lg text-gray-800">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-2">
                {recipe.extendedIngredients.map((ing, index) => (
                    <li key={index} className="text-gray-700 hover:text-gray-900 transition-colors">
                        {ing.original}
                    </li>
                ))}
            </ul>
        </div>

        <div>
            <h4 className="font-semibold mb-3 text-lg text-gray-800">Instructions:</h4>
            <ol className="list-decimal space-y-3">
                {recipe.analyzedInstructions[0]?.steps.map((step) => (
                    <li key={step.number} className="text-gray-700 ml-6 pl-2 hover:text-gray-900 transition-colors">
                        {step.step}
                    </li>
                ))}
            </ol>
        </div>
    </div>
)

const RecipeRoulette: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [recipe, setRecipe] = useState<SpoonacularRecipe | null>(null);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] =  useState(false);

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

    const findRecipe = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const recipes = await recipeService.searchRecipesByIngredients(ingredients);

            if (recipes.length === 0) {
                setError('No recipes found with these ingredients. Try different ingredients!');
                setRecipe(null);
                return;
            }

            const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

            const fullRecipe = await recipeService.getRecipeDetails(randomRecipe.id);
            setRecipe(fullRecipe);
        } catch (err) {
            setError('Failed to fetch recipes. Please try again later.');
            setRecipe(null);
        } finally {
            setIsLoading(false);
        }
    }, [ingredients]);

    const isIngredientValid = useMemo(() =>
        currentIngredient.trim() !== '' && !ingredients.includes(currentIngredient.trim().toLowerCase()),
        [currentIngredient, ingredients]
    );

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <Card className="bg-gradient-to-br from-white to-blue-50 shadow-lg">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <ChefHat className="w-6 h-6 text-blue-600" />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                        DishDice
                    </span>
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
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        disabled={ingredients.length === 0 || isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w--4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Dice6 className="w-4 h-4 mr-2" />
                        )}
                        Find Random Dish
                    </Button>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {recipe && <RecipeDisplay recipe={recipe} />}
                </CardContent>
            </Card>
        </div>
    );
};

export default RecipeRoulette;