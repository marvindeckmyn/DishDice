"use client"
import React, { useState } from 'react';

interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string;
    cookingTime: string;
}

const RecipeRoulette = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    const mockRecipes = [
        {
            title: "Pasta Primavera",
            ingredients: ["pasta", "tomato", "zucchini", "garlic"],
            instructions: "1. Cook pasta\n2. Sauté vegetables\n3. Combine and serve",
            cookingTime: "20 mins"
        },
        {
            title: "Quick Stir Fry",
            ingredients: ["rice", "carrot", "soy sauce", "chicken"],
            instructions: "1. Cook rice\n2. Stir fry ingredient\n3. Add sauce",
            cookingTime: "15 mins"
        }
    ];

    const addIngredient = () => {
        if (currentIngredient.trim()) {
            setIngredients([...ingredients, currentIngredient.trim().toLowerCase()]);
            setCurrentIngredient('');
        }
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            Hello World
        </div>
    );
};

export default RecipeRoulette;