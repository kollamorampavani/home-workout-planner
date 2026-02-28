-- Seeding routines
INSERT INTO routines (id, name, goal, level, duration) VALUES 
('starter-strength', 'Starter Strength', 'strength', 'beginner', 20),
('fat-burn-hiit', 'Fat Burn HIIT', 'fat-loss', 'intermediate', 30),
('yoga-flow', 'Morning Yoga Flow', 'flexibility', 'beginner', 20)
ON CONFLICT (id) DO NOTHING;

-- Seeding exercises
INSERT INTO exercises (id, name, description, muscle_groups) VALUES 
('pushups', 'Pushups', '3 sets of 10', '["Chest", "Triceps"]'::jsonb),
('squats', 'Squats', '3 sets of 15', '["Quads", "Glutes"]'::jsonb),
('plank', 'Plank', '3 sets of 30s', '["Core"]'::jsonb),
('burpees', 'Burpees', '3 sets of 10', '["Full Body"]'::jsonb),
('jumping-jacks', 'Jumping Jacks', '3 mins', '["Cardio"]'::jsonb),
('downward-dog', 'Downward Dog', '1 min', '["Flexibility"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Linking routines and exercises
INSERT INTO routine_exercises (routine_id, exercise_id, position) VALUES 
('starter-strength', 'pushups', 1),
('starter-strength', 'squats', 2),
('starter-strength', 'plank', 3),
('fat-burn-hiit', 'jumping-jacks', 1),
('fat-burn-hiit', 'burpees', 2),
('fat-burn-hiit', 'pushups', 3),
('fat-burn-hiit', 'squats', 4),
('yoga-flow', 'downward-dog', 1),
('yoga-flow', 'plank', 2)
ON CONFLICT DO NOTHING;
