import { recipeService } from '../services/recipeService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RecipeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('searchRecipesByIngredients', () => {
        it('should make correct API call and return recipes', async () => {
            const mockResponse = [{ id: 1, title: 'Test Recipe' }];
            mockedAxios.get.mockResolvedValue({ data: mockResponse });

            const result = await recipeService.searchRecipesByIngredients(['tomato', 'garlic']);
            
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.stringContaining('/findByIngredients'),
                expect.objectContaining({
                    params: expect.objectContaining({
                        ingredients: 'tomato,garlic'
                    })
                })
            );
            expect(result).toEqual(mockResponse);
        });

        it('should handle API errors', async () => {
            mockedAxios.get.mockRejectedValue(new Error('API Error'));

            await expect(
                recipeService.searchRecipesByIngredients(['tomato'])
            ).rejects.toThrow('Failed to fetch recipes');
        });
    });

    describe('getRecipeDetails', () => {
        it('should make correct API call and return recipe details', async () => {
            const mockRecipe = { id: 1, title: 'Test Recipe' };
            mockedAxios.get.mockResolvedValue({ data: mockRecipe });

            const result = await recipeService.getRecipeDetails(1);
            
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.stringContaining('/1/information'),
                expect.any(Object)
            );
            expect(result).toEqual(mockRecipe);
        });

        it('should handle API errors', async () => {
            mockedAxios.get.mockRejectedValue(new Error('API Error'));

            await expect(
                recipeService.getRecipeDetails(1)
            ).rejects.toThrow('Failed to fetch recipe details');
        });
    });
});