export interface Meal {
    id: string;
    name: string;
    goal: 'strength' | 'fat-loss' | 'flexibility';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    recipe: string[];
}

export const meals: Meal[] = [
    {
        id: 'protein-oats',
        name: 'Protein Overnight Oats',
        goal: 'strength',
        calories: 450,
        protein: 30,
        carbs: 50,
        fat: 12,
        recipe: ['1/2 cup oats', '1 scoop protein powder', '1 cup almond milk', 'Top with berries']
    },
    {
        id: 'quinoa-salad',
        name: 'Quinoa Veggie Bowl',
        goal: 'fat-loss',
        calories: 350,
        protein: 15,
        carbs: 45,
        fat: 10,
        recipe: ['1 cup cooked quinoa', 'Mixed greens', 'Cucumber', 'Lemon dressing']
    },
    {
        id: 'grilled-chicken',
        name: 'Grilled Chicken & Broccoli',
        goal: 'strength',
        calories: 500,
        protein: 45,
        carbs: 30,
        fat: 15,
        recipe: ['150g chicken breast', 'Large bowl of broccoli', '1/2 cup brown rice']
    }
];
