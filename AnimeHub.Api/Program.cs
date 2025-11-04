using AnimeHub.Api.Data;
using AnimeHub.Api.Endpoints;
using AnimeHub.Api.Mapping;
using AnimeHub.Api.Repositories;
using AnimeHub.Api.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Retrieve the connection string from configuration (Secret Manager in Development)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
const string CorsPolicyName = "AllowReactClient";

// Only load Key Vault secrets in non-development environments
if (!builder.Environment.IsDevelopment())
{
    // Logic here for Key Vault access
}

// Add services to the container.

// Register the DbContext to use SQL Server
builder.Services.AddDbContext<AnimeHubDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// Register AutoMapper
builder.Services.AddAutoMapper((IServiceProvider serviceProvider, IMapperConfigurationExpression config) =>
{
    // config.AddMaps(typeof(Program).Assembly); // This is the preferred way, but we will use the explicit profile

    // Explicitly add your profile to the configuration
    config.AddProfile<AnimeMappingProfile>();
}, new Type[] { });

// Register the Anime Repository (Scoped lifetime is standard for repositories)
builder.Services.AddScoped<IAnimeRepository, AnimeRepository>();
builder.Services.AddScoped<IGalleryRepository, GalleryRepository>();
builder.Services.AddScoped<IGalleryCategoryRepository, GalleryCategoryRepository>();

// Register the Anime Service (Scoped lifetime is standard for services)
builder.Services.AddScoped<AnimeInterface, AnimeService>();
builder.Services.AddScoped<GalleryInterface, GalleryService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS Service
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CorsPolicyName,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Allow your frontend's exact origin
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors(CorsPolicyName);

app.UseAuthorization();

app.MapControllers(); // Leave for now but will most likely delete later

app.MapAnimeEndpoints();
app.MapGalleryEndpoints();

app.Run();
