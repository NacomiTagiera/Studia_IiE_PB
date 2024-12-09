# School Schedule Generator

This project implements a genetic algorithm to automatically generate school class schedules while avoiding teacher conflicts and satisfying various constraints.

## Project Overview

The program generates schedules for 6 classes (1a, 1b, 2a, 2b, 3a, 3b) across 5 days of the week, handling 4 subjects:
- Early Education
- Religion
- Physical Education
- English

Each subject has specific weekly hour requirements and a designated number of teachers.

## How It Works

The program uses a genetic algorithm with the following components:

1. **Initial Population Generation**
   - Creates random schedules that attempt to avoid teacher conflicts
   - Each schedule ensures proper distribution of subjects across the week

2. **Fitness Function**
   - Evaluates schedules based on the number of teacher conflicts
   - Higher fitness scores indicate fewer conflicts

3. **Selection**
   - Selects parent schedules for crossover based on their fitness scores
   - Better schedules have a higher chance of being selected

4. **Crossover**
   - Combines two parent schedules to create new child schedules
   - Exchanges class schedules between parents

5. **Mutation**
   - Randomly modifies schedules to introduce variety
   - Moves lessons to different days with a 10% probability

## Requirements

The project requires the following Python packages:
- pandas
- tabulate

## Usage

Run the program using:
```bash
python main.py
```

The program will:
1. Generate an initial population of schedules
2. Run the genetic algorithm for 200 generations
3. Output the best schedule to 'schedule.txt'

## Output

The generated schedule is saved in 'schedule.txt', showing:
- Daily schedules for each class
- Teacher assignments for each subject
- A clear tabular format for easy reading