using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Data;
using Backend.Dtos;

namespace Backend.Services
{
    public interface IAiProviderService
    {
        Task<AiProviderModel?> CreateAiProviderAsync(AiProviderModel model);
        Task<IEnumerable<AiProviderDto>> GetAllAiProvidersAsync();
        Task<AiProviderModel?> GetAiProviderByIdAsync(int id);
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

        public async Task<IEnumerable<AiProviderDto>> GetAllAiProvidersAsync()
        {
            return await _context.AiProviders.Select(p => new AiProviderDto
            {
                Id = p.Id,
                DisplayName = p.DisplayName
            }).ToListAsync();
        }

        public async Task<AiProviderModel?> GetAiProviderByIdAsync(int id)
        {
            return await _context.AiProviders.FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
