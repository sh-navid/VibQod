using System.Collections.Generic;
using Backend.Models;
using System.Linq;

public interface IParserService
{
    Chat ParseData(string rawData);
}

public class ParserService : IParserService
{
    public Chat ParseData(string rawData)
    {
        var blocks = new List<Block>();
        var rawBlockStrings = rawData.Split("```", StringSplitOptions.RemoveEmptyEntries);

        foreach (var rawBlockString in rawBlockStrings)
        {
            var trimmedRawBlockString = rawBlockString.Trim();
            if (string.IsNullOrWhiteSpace(trimmedRawBlockString)) continue;

            var parts = trimmedRawBlockString.Split("|!|");
            if (parts.Length != 3) continue;

            string type = parts[0].Trim();
            string subType = parts[1].Trim();
            string data = parts[2].Trim();

            blocks.Add(new Block
            {

                Type = type,
                SubType = subType,
                Data = data
            });
        }

        return new Chat
        {
            Data = rawData,
            Blocks = blocks,
            Owner = rawData.StartsWith("AI:") ? ChatOwnerType.AI : ChatOwnerType.USER,
        };
    }
}
