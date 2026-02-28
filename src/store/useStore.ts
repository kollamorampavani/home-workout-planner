import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

interface User {
  id: number;
  email: string;
  name: string;
  goal: 'strength' | 'fat-loss' | 'flexibility' | null;
  level: 'beginner' | 'intermediate' | 'advanced' | null;
  time: number | null;
  onboarded: boolean;
  points: number;
}

interface WorkoutSession {
  id: number | string;
  date: string;
  workoutId: number | string;
  duration: number;
  caloriesBurned: number;
  completed: boolean;
  routine_name?: string;
}

interface MealEntry {
  id: number;
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

interface AppState {
  user: User | null;
  sessions: WorkoutSession[];
  mealDiary: MealEntry[];
  token: string | null;
  enrolledWorkouts: any[];
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchEnrolled: () => Promise<void>;
  joinWorkout: (id: string) => Promise<void>;
  leaveWorkout: (id: string) => Promise<void>;
  addSession: (session: Partial<WorkoutSession>) => Promise<void>;
  fetchMealDiary: () => Promise<void>;
  addMealToDiary: (meal: any) => Promise<void>;
  addPoints: (points: number) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      sessions: [],
      mealDiary: [],
      enrolledWorkouts: [],
      token: localStorage.getItem('token'),
      isLoading: false,

      setUser: (user) => set({ user }),

      setToken: (token) => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
        set({ token });
      },

      updateUser: async (updates) => {
        set({ isLoading: true });
        try {
          if (updates.onboarded) {
            await api.put('/user/onboard', {
              goal: updates.goal,
              level: updates.level,
              time: updates.time
            });
          }
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
            isLoading: false
          }));
        } catch (error) {
          console.error('Failed to update user', error);
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true });
        try {
          const { data } = await api.get('/user/profile');
          if (data) {
            set({
              user: {
                id: data.id,
                email: data.email,
                name: data.full_name,
                goal: data.fitness_goal,
                level: data.fitness_level,
                time: data.available_time,
                onboarded: !!data.onboarded,
                points: Number(data.points) || 0
              },
              isLoading: false
            });
          }
        } catch (error: any) {
          console.error('Failed to fetch profile', error);
          if (error.response?.status === 401) {
            get().logout();
          }
          set({ isLoading: false });
        }
      },

      fetchHistory: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const { data } = await api.get('/workouts/history');
          if (Array.isArray(data)) {
            const mappedSessions = data.map((s: any) => ({
              id: s.id,
              date: s.date,
              workoutId: s.routine_id,
              duration: Number(s.duration_mins) || 0,
              caloriesBurned: Number(s.calories_burned) || 0,
              completed: true,
              routine_name: s.routine_name
            }));
            set({ sessions: mappedSessions });
          }
        } catch (error: any) {
          console.error('Failed to fetch history', error);
          if (error.response?.status === 401) {
            get().logout();
          }
        }
      },

      fetchEnrolled: async () => {
        try {
          const { data } = await api.get('/workouts/enrolled');
          set({ enrolledWorkouts: data });
        } catch (error) {
          console.error('Failed to fetch enrolled workouts', error);
        }
      },

      joinWorkout: async (id) => {
        try {
          await api.post(`/workouts/join/${id}`);
          await get().fetchEnrolled();
        } catch (error) {
          console.error('Failed to join workout', error);
          throw error;
        }
      },

      leaveWorkout: async (id) => {
        try {
          await api.delete(`/workouts/leave/${id}`);
          await get().fetchEnrolled();
        } catch (error) {
          console.error('Failed to leave workout', error);
          throw error;
        }
      },

      addSession: async (session) => {
        try {
          await api.post('/workouts/complete', {
            routine_id: session.workoutId,
            duration_mins: session.duration,
            calories_burned: session.caloriesBurned
          });
          get().fetchHistory(); // Refresh history
        } catch (error) {
          console.error('Failed to save session', error);
        }
      },

      fetchMealDiary: async () => {
        try {
          const { data } = await api.get('/meals/diary');
          set({ mealDiary: data });
        } catch (error) {
          console.error('Failed to fetch meal diary', error);
        }
      },

      addMealToDiary: async (meal) => {
        try {
          await api.post('/meals/diary', {
            meal_name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat
          });
          get().fetchMealDiary(); // Refresh diary
        } catch (error) {
          console.error('Failed to add meal to diary', error);
          throw error;
        }
      },

      addPoints: (earned) => {
        set((state) => ({
          user: state.user ? { ...state.user, points: (state.user.points || 0) + earned } : null
        }));
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, sessions: [], enrolledWorkouts: [], token: null });
      },
    }),
    {
      name: 'workout-storage',
      partialize: (state) => ({ user: state.user, token: state.token }), // Only persist these
    }
  )
);
