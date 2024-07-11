library(GA)

# ustawiamy parametry algorytmu ewolucyjnego
min_X_Y = -2
max_X_Y = 2
pop_size = 1000
pc = 0
pm = 0.3
maxiter = 1000
seed = 123
sleep = 0.1

# funkcja optymalizowana
funkcja <- function(x, y)
{
  (x^2 - y^2) - (1 - x)^2
}

# funkcja dopasowania
# używamy kodowania wartościami i każdy osobnik (chromosom) jest punktem (ciągiem) o 2 wartościach (współrzędnych):
# Pierwsza wartość to współrzędna x
# Druga wartość to współrzędna y
fitness <- function(chr)
{
  # chr[1] - współrzędna x chromosomu
  # chr[2] - współrzędna y chromosomu
  funkcja(chr[1], chr[2])
}

# uruchamiamy algorytm ewolucyjny
GA <- ga(
  type = "real-valued", # używa kodowania wartościami
  fitness = fitness, # zdefiniowana powyżej funkcja dopasowania
  lower = c(min_X_Y, min_X_Y), # dolna granica dziedziny, w której szukamy maksimum funkcji dopasowania; w przypadku funkcji 2 zmiennych granica jest wektorem, którego kolejne współrzędne określają granicę dziedzin poszczególnych zmiennych funkcji
  upper = c(max_X_Y, max_X_Y), # górna granica dziedziny, w której szukamy maksimum funkcji dopasowania
  popSize = pop_size, # liczba osobników w każdym pokoleniu
  pcrossover = pc, # prawdopodobieństwo krzyżowania
  pmutation = pm, # prawdopodobieństwo mutacji
  maxiter = maxiter, # maksymalna liczba pokoleń do zakończenia algorytmu
  keepBest = TRUE, # czy zachowywać najlepiej dopasowane osobniki z każdego pokolenia w polu "bestSol" obiektu GA
  seed = seed # ziarno generatora liczb pseudolosowych
)

summary(GA) #wyświetlamy podsumowanie

# może być kilka najlepiej dopasowanych osobników, dlatego korzystamy z pętli
i = 1
while (i <= nrow(GA@solution))
{
  best_chromosome = GA@solution[i, ]
  best_fitness = fitness(best_chromosome)
  best_function_value = funkcja(best_chromosome[1], best_chromosome[2])
  
  cat("Najlepiej dopasowany osobnik: ", best_chromosome); cat("\n")
  cat("Jego dopasowanie: ", best_fitness); cat("\n")
  cat("Wartość optymalizowanej funkcji z nim jako parametrem: ", best_function_value); cat("\n\n")
  i = i + 1
}

plot(GA) # wyświetlamy wykres dopasowania w kolejnych pokoleniach