USE masai;

-- Drop in reverse order of dependencies
DROP TABLE IF EXISTS workout_history;
DROP TABLE IF EXISTS routine_exercises;
DROP TABLE IF EXISTS meal_diary;
DROP TABLE IF EXISTS meal_plans;
DROP TABLE IF EXISTS routines;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fitness_goal ENUM('strength', 'fat-loss', 'flexibility'),
    fitness_level ENUM('beginner', 'intermediate', 'advanced'),
    available_time INT,
    onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercises (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('cardio', 'strength', 'yoga'),
    muscle_groups JSON,
    equipment ENUM('none', 'dumbbells', 'bands'),
    video_url VARCHAR(255),
    intensity ENUM('low', 'medium', 'high'),
    default_reps INT,
    default_sets INT,
    default_duration INT
);

CREATE TABLE routines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal ENUM('strength', 'fat-loss', 'flexibility'),
    level ENUM('beginner', 'intermediate', 'advanced'),
    duration INT
);

CREATE TABLE routine_exercises (
    routine_id VARCHAR(50),
    exercise_id VARCHAR(50),
    position INT,
    PRIMARY KEY (routine_id, exercise_id),
    FOREIGN KEY (routine_id) REFERENCES routines(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE workout_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    routine_id VARCHAR(50),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_mins INT,
    calories_burned INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (routine_id) REFERENCES routines(id)
);

CREATE TABLE meal_diary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    meal_name VARCHAR(255),
    calories INT,
    protein INT,
    carbs INT,
    fat INT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
