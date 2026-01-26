using AnimeHub.Api.Data;
using AnimeHub.Api.Endpoints;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Infrastructure.Logging;
using AnimeHub.Api.Mapping;
using AnimeHub.Api.Repositories;
using AnimeHub.Api.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Context;
using Serilog.Sinks.MSSqlServer;
using System.Collections.ObjectModel;
using System.Data;
using System.Diagnostics;
using System.Reflection;
using System.Text;
using FluentValidation;


var builder = WebApplication.CreateBuilder(args);


#region Serilog Congiguration

// --- START SERILOG CONFIGURATION ---

#if DEBUG
    // Only show Serilog's internal errors in the console during local debugging
    Serilog.Debugging.SelfLog.Enable(msg => Console.WriteLine($"Serilog Error: {msg}"));
#endif

ColumnOptions columnOptions = new ColumnOptions();
columnOptions.Store.Remove(StandardColumn.Level);
columnOptions.Store.Remove(StandardColumn.Properties);
columnOptions.Store.Remove(StandardColumn.MessageTemplate);
columnOptions.Store.Remove(StandardColumn.Id);
columnOptions.Store.Remove(StandardColumn.Exception); // We use our custom split fields

// Map standard Serilog properties to your LogEntry columns
columnOptions.TimeStamp.ColumnName = "Timestamp";
columnOptions.Message.ColumnName = "Message";

// Define your custom columns to match LogEntry.cs
columnOptions.AdditionalColumns = new Collection<SqlColumn>
{
    new SqlColumn { ColumnName = "LogLevelId", DataType = SqlDbType.Int, AllowNull = false },
    new SqlColumn { ColumnName = "LogSourceId", DataType = SqlDbType.Int, AllowNull = false },
    new SqlColumn { ColumnName = "ExceptionType", DataType = SqlDbType.NVarChar, DataLength = 256, AllowNull = true },
    new SqlColumn { ColumnName = "ExceptionMessage", DataType = SqlDbType.NVarChar, DataLength = -1, AllowNull = true },
    new SqlColumn { ColumnName = "StackTrace", DataType = SqlDbType.NVarChar, DataLength = -1, AllowNull = true },
    new SqlColumn { ColumnName = "TraceId", DataType = SqlDbType.NVarChar, DataLength = 100, AllowNull = true },
    new SqlColumn { ColumnName = "Payload", DataType = SqlDbType.NVarChar, DataLength = -1, AllowNull = true },
    new SqlColumn { ColumnName = "UserId", DataType = SqlDbType.NVarChar, DataLength = 450, AllowNull = true }
};

builder.Host.UseSerilog((context, loggerConfiguration) => loggerConfiguration
    .ReadFrom.Configuration(context.Configuration)
    .Enrich.FromLogContext()
    .Enrich.With<LogLevelEnricher>() // Translates Serilog levels to my 0-7 Enum
    .WriteTo.Console()
    .WriteTo.MSSqlServer(
        connectionString: context.Configuration.GetConnectionString("DefaultConnection"),
        sinkOptions: new MSSqlServerSinkOptions 
        { 
            TableName = "LogEntry", 
            AutoCreateSqlTable = false 
        },
        columnOptions: columnOptions
    ));

// --- END SERILOG CONFIGURATION ---

#endregion


// Configure Kestrel to increase the maximum request body size (e.g., to 100MB)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // 104,857,600 bytes = 100 MB. Choose an appropriate size.
    serverOptions.Limits.MaxRequestBodySize = 104857600;
});

// Retrieve the connection string from configuration (Secret Manager in Development)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
const string CorsPolicyName = "AllowReactClient";

// Only load Key Vault secrets in non-development environments
if (!builder.Environment.IsDevelopment())
{
    // Logic here for Key Vault access
}

// Register the DbContext to use SQL Server
builder.Services.AddDbContext<AnimeHubDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// Identity Service Configuration
builder.Services.AddIdentity<IdentityUser, IdentityRole>() // Use default IdentityUser and IdentityRole
    .AddEntityFrameworkStores<AnimeHubDbContext>()         // Configure Identity to use our DbContext
    .AddDefaultTokenProviders();                          // Enables things like password reset tokens

// Add services to the container
// Register AutoMapper
builder.Services.AddAutoMapper((IServiceProvider serviceProvider, IMapperConfigurationExpression config) =>
{
    // config.AddMaps(typeof(Program).Assembly); // This is the preferred way, but we will use the explicit profile

    // Explicitly add your profile to the configuration
    config.AddProfile<AnimeMappingProfile>();
    config.AddProfile<GalleryMappingProfile>();
    config.AddProfile<CharacterMappingProfile>();
    config.AddProfile<AuthMappingProfile>();
}, new Type[] { });


#region Add Scoped Services

// Register the Repositories (Scoped lifetime is standard for repositories)
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IAnimeRepository, AnimeRepository>();
builder.Services.AddScoped<IGalleryRepository, GalleryRepository>();
builder.Services.AddScoped<IGalleryCategoryRepository, GalleryCategoryRepository>();
builder.Services.AddScoped<ICharacterRepository, CharacterRepository>();
builder.Services.AddScoped<IUserProfileRepository, UserProfileRepository>();

// Register the Services (Scoped lifetime is standard for services)
builder.Services.AddScoped<AnimeInterface, AnimeService>();
builder.Services.AddScoped<GalleryInterface, GalleryService>();
builder.Services.AddScoped<CharacterInterface, CharacterService>();
builder.Services.AddScoped<AuthInterface, AuthService>();
builder.Services.AddScoped<UserProfileInterface, UserProfileService>();

#endregion


builder.Services.AddControllers();

// Register all validators rather than each individually
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Define the security scheme for JWT Bearer tokens
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });

    // Apply the security scheme globally to all API requests in Swagger
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure CORS Service
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CorsPolicyName,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Allow your frontend's exact origin
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Required for cookies/JWT in certain setups
        });
});

// Configure Authentication and Authorization services (Middleware registration is below)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Get the JWT key from configuration
    var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});


builder.Services.AddAuthorization(options =>
{
    // Define a policy for Admin-level access using our custom roles
    options.AddPolicy("AdminAccess", policy =>
        policy.RequireRole(Roles.Administrator, Roles.Mage));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors(CorsPolicyName);

// Bypass authorization for OPTIONS preflight requests
app.Use(async (context, next) =>
{
    // Check if the request is an OPTIONS request
    if (context.Request.Method == "OPTIONS")
    {
        // Respond with a 204 No Content to confirm preflight success
        context.Response.StatusCode = 204;
        await context.Response.CompleteAsync(); // End the request pipeline for OPTIONS
        return;
    }
    await next(); // Proceed with the pipeline for all other requests (GET, POST, etc.)
});

// CRITICAL: Must be called BEFORE UseAuthorization
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers(); // Leave for now but will most likely delete later


#region Map Endpoints

app.MapAnimeEndpoints();
app.MapGalleryEndpoints();
app.MapCharacterEndpoints();
app.MapAuthEndpoints();
app.MapUserProfileEndpoints();
// app.MapSystemEndpoints();

#endregion


// Data Seeding using a Scoped Service Provider (Development Only)
if (app.Environment.IsDevelopment())
{
    // Scoped creation ensures the DbContext is properly disposed
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;

        // Use ILogger<Program> to ensure proper logging
        var logger = services.GetRequiredService<ILogger<Program>>();

        try
        {
            var context = services.GetRequiredService<AnimeHubDbContext>();

            // Get the role/user managers for seeding/initial setup
            var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            // context.Database.Migrate(); // Uncomment if you want migrations run on startup

            // Call the static SeedDatabase method
            await SeedData.SeedDatabaseAsync(context, userManager, roleManager, services);
        }
        catch (Exception ex)
        {
            // Log errors if seeding fails
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}

app.Run();
