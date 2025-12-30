using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AIController(IParserService parserService, IAIService aiService, IConfiguration configuration) : ControllerBase
    {
        private readonly IAIService _aiService = aiService;
        private readonly IParserService _parserService = parserService;
        private static readonly List<string> _conversationHistory = [];
        private readonly string _defaultSystemPrompt = string.Join("\n", configuration.GetSection("Prompt").Get<string[]>() ?? Array.Empty<string>());

        [HttpPost("ask")]
        public async Task<IActionResult> GetCompletion([FromBody] Request request)
        {
            if (request == null || string.IsNullOrEmpty(request.Prompt))
            {
                return BadRequest("Prompt is required.");
            }

            // Build the prompt, including conversation history and the user's current prompt
            var fullPrompt = $"{_defaultSystemPrompt}\n{string.Join("\n", _conversationHistory)}\nUser: {request.Prompt}";
            var completion = await _aiService.GetCompletionAsync(fullPrompt);

            if (completion == null)
            {
                return StatusCode(500, "Failed to get a completion from the AI service.");
            }

            // Append to the conversation history
            _conversationHistory.Add($"User: {new Chat { Blocks = [new Block { Type = "PROMPT", SubType = "prompt", Data = request.Prompt }], Data = "", Owner = ChatOwnerType.USER }}");
            _conversationHistory.Add($"AI: {completion}");

            // return Ok(completion);
            return Ok(_parserService.ParseData(completion));
        }

        [HttpGet("history")]
        public IActionResult GetConversationHistory()
        {
            var history = _conversationHistory.ToList();
            return Ok(history);
        }

        [HttpGet("history/parsed")]
        public IActionResult GetParsedConversationHistory()
        {
            var history = _conversationHistory.ToList();
            var result = new List<Chat>();
            foreach (var item in history)
            {
                result.Add(_parserService.ParseData(item));
            }
            return Ok(result);
        }

        [HttpPost("clear")]
        public IActionResult ClearConversation()
        {
            _conversationHistory.Clear();
            return Ok("Conversation history cleared and default prompt reloaded.");
        }
    }
}
