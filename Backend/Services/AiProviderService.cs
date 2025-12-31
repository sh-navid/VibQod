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
        Task<AiProviderDto?> GetAiProviderByIdAsync(int id);
        Task<AiProviderDto?> GetDefaultAiProviderAsync();
        Task<bool> SetDefaultAiProviderAsync(int id);
        Task<bool> DeleteAiProviderAsync(int id);
    }

    public class AiProviderService(ApplicationDbContext context) : IAiProviderService
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<AiProviderModel?> CreateAiProviderAsync(AiProviderModel model)
        {
            // If this is the first provider, set it as default
            if (!_context.AiProviders.Any())
            {
                model.IsDefault = true;
            }
            else
            {
                model.IsDefault = false;
            }

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

        public async Task<AiProviderDto?> GetAiProviderByIdAsync(int id)
        {
            return await _context.AiProviders.Where(p => p.Id == id).Select(p => new AiProviderDto
            {
                Id = p.Id,
                DisplayName = p.DisplayName
            }).FirstOrDefaultAsync();
        }

        public async Task<AiProviderDto?> GetDefaultAiProviderAsync()
        {
            return await _context.AiProviders.Where(p => p.IsDefault).Select(p => new AiProviderDto
            {
                Id = p.Id,
                DisplayName = p.DisplayName
            }).FirstOrDefaultAsync();
        }

        public async Task<bool> SetDefaultAiProviderAsync(int id)
        {
            // Check if record with this id exists
            if (!await _context.AiProviders.AnyAsync(p => p.Id == id))
            {
                return false;
            }

            // Reset existing defaults
            var existingDefaults = await _context.AiProviders.Where(p => p.IsDefault).ToListAsync();
            foreach (var existingDefault in existingDefaults)
            {
                existingDefault.IsDefault = false;
            }

            var newDefault = await _context.AiProviders.FirstOrDefaultAsync(p => p.Id == id);
            newDefault.IsDefault = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAiProviderAsync(int id)
        {
            var provider = await _context.AiProviders.FindAsync(id);

            if (provider == null)
            {
                return false; // Provider not found
            }

            _context.AiProviders.Remove(provider);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
