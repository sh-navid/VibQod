using Microsoft.OpenApi.Models;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend API", Version = "v1" });
});

builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<IParserService, ParserService>();

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend API v1"));
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Use CORS policy
app.UseCors("AllowLocalhost9099And9090"); // Apply the updated policy

app.MapControllers();

app.MapGet("/api/v1/version", () => "1.0.1");

app.Run();
