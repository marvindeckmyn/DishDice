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

const RecipeDisplay: React.FC<{ recipe: SpoonacularRecipe }> = ({ recipe }) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
        <div className="pb-4 flex items-start gap-4">
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-32 h-32 object-cover rounded-lg"
                />
            )}
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                <div className="flex gap-4 mb-4">
                    <span className="text-sm text-gray-600">⏱️ {recipe.readyInMinutes} mins</span>
                    <span className="text-sm text-gray-600">👥 Serves {recipe.servings}</span>
                </div>                
            </div>
        </div>

        <div className="mb-4">
            <h4 className="font-semibold mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-1">
                {recipe.extendedIngredients.map((ing, index) => (
                    <li key={index} className="text-gray-700">
                        {ing.original}
                    </li>
                ))}
            </ul>
        </div>

        <div>
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ol className="list-decimal space-y-2">
                {recipe.analyzedInstructions[0]?.steps.map((step) => (
                    <li key={step.number} className="text-gray-700 ml-6 pl-2">
                        {step.step}
                    </li>
                ))}
            </ol>
        </div>

        {recipe.sourceUrl && (
            <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-blue-600 hover:text-blue-800 inline-block"
            >
                View Original Recipe
            </a>
        )}
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