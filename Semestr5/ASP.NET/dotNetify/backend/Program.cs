using dotNETify.Data;
using dotNETify.Persistance;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using dotNETify;
using Swashbuckle.AspNetCore.SwaggerUI;
using dotNETify.Models;
using dotNETify.Services;
using dotNETIFY.Persistance;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllersWithViews();

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders()
    .AddApiEndpoints();

builder.Services.AddScoped<IUserClaimsPrincipalFactory<User>, UserClaimsPrincipal>();

builder.Services.AddScoped<UsersRepository, UsersRepository>();
builder.Services.AddScoped<FriendshipRepository, FriendshipRepository>();
builder.Services.AddScoped<ISongsRepository, SongsRepository>();
builder.Services.AddScoped<IPlaylistRepository, PlaylistRepository>();
builder.Services.AddScoped<ILikedSongsRepository, LikedSongsRepository>();
builder.Services.AddScoped<ILikedArtistsRepository, LikedArtistsRepository>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true; // Ciasteczko tylko dla serwera
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Wymaga HTTPS
    options.Cookie.SameSite = SameSiteMode.None; // Obs³uga CORS
    options.LoginPath = "/login"; // Endpoint logowania
    options.ExpireTimeSpan = TimeSpan.FromHours(1); // Czas trwania ciasteczka
    options.SlidingExpiration = true; // Odœwie¿anie ciasteczka
});

builder.Services.AddAuthorizationBuilder();

var allowedOrigin = "http://localhost:3000";
var corsPolicyName = "AllowNextJsOrigin";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName,
        policy =>
        {
            policy.WithOrigins(allowedOrigin)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors(corsPolicyName);

app.MapIdentityApi<User>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
