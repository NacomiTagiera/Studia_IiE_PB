using Microsoft.Extensions.Configuration;
using System.IO;

namespace WpfRestaurant.Services
{
    public static class ConfigurationService
    {
        private static IConfiguration? _configuration;

        public static IConfiguration Configuration
        {
            get
            {
                if (_configuration == null)
                {
                    InitializeConfiguration();
                }
                return _configuration!;
            }
        }

        private static void InitializeConfiguration()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            _configuration = builder.Build();
        }

        /// <summary>
        /// Pobiera connection string z appsettings.json
        /// </summary>
        /// <param name="name">Nazwa connection string (domyślnie "DefaultConnection")</param>
        /// <returns>Connection string</returns>
        public static string GetConnectionString(string name = "DefaultConnection")
        {
            var connectionString = Configuration.GetConnectionString(name);
            
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException($"Connection string '{name}' nie został znaleziony w appsettings.json");
            }

            return connectionString;
        }

        /// <summary>
        /// Pobiera wartość konfiguracji
        /// </summary>
        /// <param name="key">Klucz konfiguracji (np. "Application:Name")</param>
        /// <returns>Wartość konfiguracji</returns>
        public static string? GetConfigurationValue(string key)
        {
            return Configuration[key];
        }

        /// <summary>
        /// Pobiera sekcję konfiguracji
        /// </summary>
        /// <param name="sectionName">Nazwa sekcji</param>
        /// <returns>Sekcja konfiguracji</returns>
        public static IConfigurationSection GetSection(string sectionName)
        {
            return Configuration.GetSection(sectionName);
        }
    }
} 