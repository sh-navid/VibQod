using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AiProviderModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string ApiKey { get; set; }
        [Required]
        public required string BaseUrl { get; set; }
        [Required]
        public required string Model { get; set; }
        [Required]
        public required string DisplayName { get; set; }
        public bool IsDefault { get; set; } = false;
    }
}
