import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

interface IngredientSearchResponse {
    id: number;
    title: string;
    image: string;
    imageType: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
    missedIngredients: any[];
    usedIngredients: any[];
    unusedIngredients: any[];
    likes: number;
}

export interface SpoonacularRecipe {
    id: number;
    title: string;
    readyInMinutes: number;
    servings: number;
    sourceUrl: string;
    image: string;
    analyzedInstructions: {
        steps: {
            number: number;
            step: string;
        }[];
    }[];
    extendedIngredients: {
        original: string;
        name: string;
    }[];
}

class RecipeService {
    async searchRecipesByIngredients(ingredients: string[]): Promise<IngredientSearchResponse[]> {
        try {
            const response = await axios.get<IngredientSearchResponse[]>(`${BASE_URL}/findByIngredients`, {
                params: {
                    apiKey: API_KEY,
                    ingredients: ingredients.join(','),
                    number: 100,
                    ranking: 2,
                    ignorePantry: true
                }
            });

            return response.data;
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
            throw new Error('Failed to fetch recipes');
        }
    }

    async getRecipeDetails(id: number): Promise<SpoonacularRecipe> {
        try {
            const response = await axios.get<SpoonacularRecipe>(`${BASE_URL}/${id}/information`, {
                params: {
                    apiKey: API_KEY
                }
            });

            return response.data;
        } catch (error) {
            console.error('Failed to fetch recipe details:', error);
            throw new Error('Failed to fetch recipe details');
        }
    }
}

export const recipeService = new RecipeService();