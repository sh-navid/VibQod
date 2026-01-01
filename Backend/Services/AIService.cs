using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using System.Text;
using Backend.Services;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface IAIService
    {
        Task<string?> GetCompletionAsync(string prompt);
    }

    public class AIService(IConfiguration configuration, IHttpClientFactory httpClientFactory, IAiProviderService aiProviderService, ApplicationDbContext context) : IAIService
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly IAiProviderService _aiProviderService = aiProviderService;
        private readonly ApplicationDbContext _context = context;

        public async Task<string?> GetCompletionAsync(string prompt)
        {
            try
            {
                // Retrieve the default AI provider
                var defaultProviderDto = await _aiProviderService.GetDefaultAiProviderAsync();

                if (defaultProviderDto == null)
                {
                    Console.WriteLine("No default AI provider configured.");
                    return null;
                }

                // Fetch the AI provider model to get detailed configuration
                var aiProvider = await _context.AiProviders.FirstOrDefaultAsync(p => p.Id == defaultProviderDto.Id);

                if (aiProvider == null)
                {
                    Console.WriteLine($"AI provider with ID {defaultProviderDto.Id} not found.");
                    return null;
                }

                var apiKey = aiProvider.ApiKey;
                var baseUrl = aiProvider.BaseUrl;
                var model = aiProvider.Model;


                if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(baseUrl) || string.IsNullOrEmpty(model))
                {
                    Console.WriteLine("AI configuration is missing. Please check your AI provider settings.");
                    return null;
                }

                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));


                var jsonBody = new JObject
                {
                    ["model"] = model,
                    ["messages"] = new JArray
                    {
                        new JObject { ["role"] = "system", ["content"] = "You are a helpful assistant." },
                        new JObject { ["role"] = "user", ["content"] = prompt }
                    }
                };
                var content = new StringContent(jsonBody.ToString(), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(baseUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"LLM request failed: HTTP {response.StatusCode} – {errorContent}");
                    return null;
                }

                var responseString = await response.Content.ReadAsStringAsync();
                var jsonResponse = JObject.Parse(responseString);
                var contentResponse = jsonResponse["choices"]?[0]?["message"]?["content"]?.ToString();
                return contentResponse;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"LLM processing error: {ex.Message}");
                return null;
            }
        }
    }
}
