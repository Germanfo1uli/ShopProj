using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ShopBack.Models
{
    public class ProductReviews
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        [MaxLength(50)]
        public string Header { get; set; } = default!;

        [MaxLength(1000)]
        public string? Comment { get; set; }

        [MaxLength(1000)]
        public string? ModeratorComment { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ModeratedAt { get; set; }

        [Required]
        public bool Approved { get; set; } = true;

        public int? ModeratorId { get; set; }

        [ForeignKey("ProductId")]
        [JsonIgnore]
        public Products Product { get; set; } = default!;

        [ForeignKey("UserId")]
        public Users User { get; set; } = default!;

        [ForeignKey("ModeratorId")]
        public Users? Moderator { get; set; }
    }
}
