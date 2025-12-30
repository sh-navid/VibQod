namespace Backend.Models
{
    public enum ChatOwnerType
    {
        [System.ComponentModel.Description("AI")]
        AI,

        [System.ComponentModel.Description("User")]
        USER
    }

    public class Chat
    {
        public required ChatOwnerType Owner { get; set; }
        public required string Data { get; set; }
        public required List<Block> Blocks { get; set; }

        public override string ToString()
        {
            return $"```{string.Join("``` ```", Blocks)}```";
        }
    }

    public class Block
    {
        public required string Type { get; set; }
        public required string SubType { get; set; }
        public required string Data { get; set; }

        public override string ToString()
        {
            return $"{Type}|!|{SubType}|!|{Data}";
        }
    }
}
