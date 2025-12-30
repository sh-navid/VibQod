using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;

namespace Backend.Services
{
    public interface IAiProviderService
    {
        Task<AiProviderModel?> CreateAiProviderAsync(AiProviderModel model);
        Task<IEnumerable<AiProviderModel>> GetAllAiProvidersAsync();
    }

    public class AiProviderService(ApplicationDbContext context) : IAiProviderService
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<AiProviderModel?> CreateAiProviderAsync(AiProviderModel model)
        {
            _context.AiProviders.Add(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<IEnumerable<AiProviderModel>> GetAllAiProvidersAsync()
        {
            return await _context.AiProviders.ToListAsync();
        }
    }
}
