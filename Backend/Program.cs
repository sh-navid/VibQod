using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Backend.Services;
using Backend.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=VibQod.db";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend API", Version = "v1" });
});

builder.Services.AddScoped<IAiProviderService, AiProviderService>();
builder.Services.AddScoped<IParserService, ParserService>();
builder.Services.AddScoped<IAIService, AIService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost9099And9090",
        builder =>
        {
            builder.WithOrigins("http://localhost:9099", "http://localhost:9090") // Allow both 9099 and 9090
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend API v1"));
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowLocalhost9099And9090");

app.MapControllers();

app.MapGet("/api/v1/version", () => "1.0.1");

// Ensure the database is created. This can also be done via migrations.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated(); // Creates the SQLite database if it doesn't exist.  Consider using migrations in production.
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred creating the DB.");
    }
}


app.Run();
