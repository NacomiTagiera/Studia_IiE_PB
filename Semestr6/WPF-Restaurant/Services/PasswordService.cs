using BCrypt.Net;

namespace WpfRestaurant.Services
{
    public class PasswordService
    {
        private const int WorkFactor = 12; // Zgodnie z PRD - min. 12 rund

        /// <summary>
        /// Hashuje hasło za pomocą BCrypt
        /// </summary>
        /// <param name="password">Hasło do zahashowania</param>
        /// <returns>Zahashowane hasło</returns>
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
        }

        /// <summary>
        /// Weryfikuje hasło z jego hashem
        /// </summary>
        /// <param name="password">Hasło do weryfikacji</param>
        /// <param name="hashedPassword">Hash z bazy danych</param>
        /// <returns>True jeśli hasło jest poprawne</returns>
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

        /// <summary>
        /// Sprawdza czy hasło spełnia wymagania bezpieczeństwa
        /// </summary>
        /// <param name="password">Hasło do sprawdzenia</param>
        /// <returns>True jeśli hasło spełnia wymagania</returns>
        public static bool IsPasswordValid(string password)
        {
            // Zgodnie z PRD - min. 8 znaków
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
                return false;

            // Dodatkowe wymagania bezpieczeństwa (opcjonalne)
            bool hasLetter = password.Any(char.IsLetter);
            bool hasDigit = password.Any(char.IsDigit);

            return hasLetter && hasDigit;
        }

        /// <summary>
        /// Zwraca listę błędów walidacji hasła
        /// </summary>
        /// <param name="password">Hasło do sprawdzenia</param>
        /// <returns>Lista błędów lub pusta lista jeśli hasło jest poprawne</returns>
        public static List<string> ValidatePassword(string password)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(password))
            {
                errors.Add("Hasło nie może być puste");
                return errors;
            }

            if (password.Length < 8)
                errors.Add("Hasło musi mieć minimum 8 znaków");

            if (!password.Any(char.IsLetter))
                errors.Add("Hasło musi zawierać przynajmniej jedną literę");

            if (!password.Any(char.IsDigit))
                errors.Add("Hasło musi zawierać przynajmniej jedną cyfrę");

            return errors;
        }
    }
} 