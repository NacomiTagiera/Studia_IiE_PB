import copy 
import random
import pandas as pd 
from tabulate import tabulate

# Definicja danych wejściowych
klasy = ['1a', '1b', '2a', '2b', '3a', '3b'] 
przedmioty = ['Ed Wczesn', 'Religia', 'W-F', 'Angielski']  
dni_tygodnia = ['Poniedzialek', 'Wtorek', 'Sroda', 'Czwartek', 'Piatek'] 

# Liczba godzin każdego przedmiotu w tygodniu dla każdej klasy
godziny_przedmiotow = {
    'Ed Wczesn': 10,
    'Religia': 2,
    'W-F': 3,
    'Angielski': 2
}

# Liczba nauczycieli dla każdego przedmiotu
nauczyciele_przedmiotow = {
    'Ed Wczesn': 6,
    'Religia': 1,
    'W-F': 2,
    'Angielski': 2
}

# Generowanie listy nauczycieli dla każdego przedmiotu
nauczyciele = {}
for przedmiot, ilosc in nauczyciele_przedmiotow.items():
    nauczyciele[przedmiot] = [f"{przedmiot}_Nauczyciel_{i+1}" for i in range(ilosc)]

# Przypisanie nauczycieli do klas dla każdego przedmiotu
nauczyciele_klas = {klasa: {} for klasa in klasy}
for przedmiot in przedmioty:
    nauczyciel_idx = 0
    for klasa in klasy:
        nauczyciele_klas[klasa][przedmiot] = nauczyciele[przedmiot][nauczyciel_idx]
        nauczyciel_idx = (nauczyciel_idx + 1) % len(nauczyciele[przedmiot])

# Funkcja generująca początkową populację planów zajęć
def generate_initial_population(population_size):
    population = []
    for _ in range(population_size):
        individual = {klasa: {dzien: [] for dzien in dni_tygodnia} for klasa in klasy}
        for przedmiot, godziny in godziny_przedmiotow.items():
            for _ in range(godziny):
                for klasa in klasy:
                    dzien = random.choice(dni_tygodnia)
                    nauczyciel = nauczyciele_klas[klasa][przedmiot]
                    
                    # Sprawdzenie czy nauczyciel nie jest zajęty w tym dniu
                    zajety_nauczyciel = any(nauczyciel in individual[kl][dzien] for kl in klasy)
                    while zajety_nauczyciel:
                        dzien = random.choice(dni_tygodnia)
                        zajety_nauczyciel = any(nauczyciel in individual[kl][dzien] for kl in klasy)
                    
                    # Dodanie przedmiotu i nauczyciela do planu zajęć
                    individual[klasa][dzien].append((przedmiot, nauczyciel))
        # Dodanie indywidualnego planu do populacji
        population.append(individual)
    return population

# Funkcja oceniająca plan zajęć (liczba konfliktów nauczycieli)
def fitness(individual):
    conflicts = 0
    for dzien in dni_tygodnia:
        nauczyciele_zajeci = set()
        for klasa in klasy:
            for przedmiot, nauczyciel in individual[klasa][dzien]:
                if nauczyciel in nauczyciele_zajeci:
                    conflicts += 1  # Konflikt, jeśli nauczyciel jest już zajęty
                else:
                    nauczyciele_zajeci.add(nauczyciel)
    # Maksymalna liczba punktów fitness to liczba zajęć bez konfliktów
    max_fitness = len(klasy) * len(dni_tygodnia) * sum(godziny_przedmiotow.values())
    return max_fitness - conflicts

# Funkcja wybierająca rodziców do krzyżowania na podstawie ich wartości fitness
def selection(population):
    weights = [fitness(ind) for ind in population]
    return random.choices(population, k=2, weights=weights)

# Funkcja krzyżowania
def crossover(parent1, parent2):
    child1, child2 = copy.deepcopy(parent1), copy.deepcopy(parent2)
    for klasa in klasy:
        if random.random() < 0.5:
            # Wymiana planów zajęć między rodzicami
            child1[klasa], child2[klasa] = child2[klasa], child1[klasa]
    return child1, child2

# Funkcja mutacji planu zajęć
def mutate(individual):
    for klasa in klasy:
        for dzien in dni_tygodnia:
            if random.random() < 0.1 and individual[klasa][dzien]:
                # Losowy wybór przedmiotu i nauczyciela do przeniesienia
                przedmiot, nauczyciel = random.choice(individual[klasa][dzien])
                nowy_dzien = random.choice(dni_tygodnia)
                
                # Usunięcie zajęć z bieżącego dnia i dodanie do nowego dnia
                individual[klasa][dzien].remove((przedmiot, nauczyciel))
                individual[klasa][nowy_dzien].append((przedmiot, nauczyciele_klas[klasa][przedmiot]))
    return individual

# Główna funkcja algorytmu genetycznego
def genetic_algorithm(population_size, generations):
    population = generate_initial_population(population_size)
    for _ in range(generations):
        new_population = []
        for _ in range(population_size // 2):
            parent1, parent2 = selection(population)
            child1, child2 = crossover(parent1, parent2)
            new_population.append(mutate(child1))
            new_population.append(mutate(child2))
        population = new_population
    best_individual = max(population, key=fitness)
    return best_individual

# Funkcja zapisująca plan zajęć do pliku
def display_schedule(schedule, filename=None):
    for klasa, plan in schedule.items():
        output = f"\nPlan zajec dla klasy {klasa}:\n"
        df = pd.DataFrame(columns=dni_tygodnia)
        for dzien in dni_tygodnia:
            zajecia = [f"{przedmiot} ({nauczyciel})" for przedmiot, nauczyciel in plan[dzien]]
            if not zajecia:
                zajecia = ['Brak']
            df[dzien] = pd.Series(zajecia)
        output += tabulate(df.fillna('Brak'), headers='keys', tablefmt='grid') + "\n"

        if filename:
            with open(filename, 'a') as f:
                f.write(output)
        else:
            print(output)

# Parametry algorytmu genetycznego
population_size = 200
generations = 200

# Uruchomienie algorytmu
best_schedule = genetic_algorithm(population_size, generations)

# Wyświetlenie najlepszego planu zajęć
display_schedule(best_schedule, 'schedule.txt')