import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import RecipeRoulette from '../components/RecipeRoulette';
import { recipeService } from '../services/recipeService';

jest.mock('../services/recipeService');
const mockedRecipeService = recipeService as jest.Mocked<typeof recipeService>;

const mockRecipe = {
    id: 1,
    title: "Test Recipe",
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: "http://test.com",
    image: "test.jpg",
    analyzedInstructions: [{
        steps: [
            { number: 1, step: "Step 1" },
            { number: 2, step: "Step 2" }
        ]
    }],
    extendedIngredients: [
        { original: "1 cup test ingredient", name: "test ingredient"}
    ]
};

describe('RecipeRoulette', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Ingredient Management', () => {
        it('should add ingredients when entered', async () => {
            render(<RecipeRoulette />);
            
            const input = screen.getByLabelText('Ingredient input');
            await userEvent.type(input, 'tomato{enter}');
            
            expect(screen.getByText('tomato')).toBeInTheDocument();
        });

        it('should remove ingredients when delete button is clicked', async () => {
            render(<RecipeRoulette />);
            
            const input = screen.getByLabelText('Ingredient input');
            await userEvent.type(input, 'tomato{enter}');
            
            const removeButton = screen.getByLabelText('Remove tomato');
            await userEvent.click(removeButton);
            
            expect(screen.queryByText('tomato')).not.toBeInTheDocument();
        });
    });

    describe('Recipe Search', () => {
        it('should display loading state while fetching recipe', async () => {
            mockedRecipeService.searchRecipesByIngredients.mockResolvedValue([{ id: 1 }] as any);
            mockedRecipeService.getRecipeDetails.mockResolvedValue(mockRecipe);

            render(<RecipeRoulette />);
            
            const input = screen.getByLabelText('Ingredient input');
            await userEvent.type(input, 'tomato{enter}');
            
            const searchButton = screen.getByText('Find Random Dish');
            await userEvent.click(searchButton);
            
            expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });

        it('should display recipe when found', async () => {
            mockedRecipeService.searchRecipesByIngredients.mockResolvedValue([{ id: 1 }] as any);
            mockedRecipeService.getRecipeDetails.mockResolvedValue(mockRecipe);

            render(<RecipeRoulette />);
            
            const input = screen.getByLabelText('Ingredient input');
            await userEvent.type(input, 'tomato{enter}');
            await userEvent.click(screen.getByText('Find Random Dish'));
            
            await waitFor(() => {
                expect(screen.getByText('Test Recipe')).toBeInTheDocument();
            });
        });

        it('should handle API errors gracefully', async () => {
            mockedRecipeService.searchRecipesByIngredients.mockRejectedValue(new Error('API Error'));

            render(<RecipeRoulette />);
            
            const input = screen.getByLabelText('Ingredient input');
            await userEvent.type(input, 'tomato{enter}');
            await userEvent.click(screen.getByText('Find Random Dish'));
            
            await waitFor(() => {
                expect(screen.getByText('Failed to fetch recipes. Please try again later.')).toBeInTheDocument();
            });
        });
    });

    describe('UI Interactions', () => {
        it('should disable search button when no ingredients are added', () => {
            render(<RecipeRoulette />);
            
            const searchButton = screen.getByText('Find Random Dish');
            expect(searchButton).toBeDisabled();
        });

        it('should enable search button when ingredients are added', async () => {
            render(<RecipeRoulette />);
            
            const input = screen.getByLabelText('Ingredient input');
            await userEvent.type(input, 'tomato{enter}');
            
            const searchButton = screen.getByText('Find Random Dish');
            expect(searchButton).not.toBeDisabled();
        });
    });
});