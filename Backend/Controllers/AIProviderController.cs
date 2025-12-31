using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using Backend.Dtos;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AIProviderController(IAiProviderService aiProviderService) : ControllerBase
    {
        private readonly IAiProviderService _aiProviderService = aiProviderService;

        [HttpPost]
        public async Task<IActionResult> CreateAiProvider([FromBody] AiProviderModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdProvider = await _aiProviderService.CreateAiProviderAsync(model);
            if (createdProvider == null)
            {
                return StatusCode(500, "Failed to create AI provider.");
            }

            return CreatedAtAction(nameof(GetAiProviderById), new { id = createdProvider.Id }, createdProvider);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAiProviders()
        {
            var providers = await _aiProviderService.GetAllAiProvidersAsync();
            return Ok(providers);
        }

        // TODO: Think about this; Do we have to expose this
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAiProviderById(int id)
        {
            var provider = await _aiProviderService.GetAiProviderByIdAsync(id);
            if (provider == null)
            {
                return NotFound();
            }
            return Ok(provider);
        }

        [HttpGet("default")]
        public async Task<IActionResult> GetDefaultAiProvider()
        {
            var provider = await _aiProviderService.GetDefaultAiProviderAsync();
            if (provider == null)
            {
                return NotFound();
            }
            return Ok(provider);
        }

        [HttpPut("default/{id}")]
        public async Task<IActionResult> SetDefaultAiProvider(int id)
        {
            var success = await _aiProviderService.SetDefaultAiProviderAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAiProvider(int id)
        {
            var success = await _aiProviderService.DeleteAiProviderAsync(id);

            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
