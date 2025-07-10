using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShopBack.Models
{
    public class PayMethods
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        [MaxLength(20)]
        public string CardLastFourDigits { get; set; } = default!;

        [Required]
        [MaxLength(50)]
        public string CardBrand { get; set; } = default!;

        [Required]
        public int ExpiryMonth { get; set; } = default!;

        [Required]
        public int ExpiryYear { get; set; } = default!;

        [Required]
        [MaxLength(255)]
        public string PaymentProviderToken { get; set; } = default!;

        public string? StripeCustomerId { get; set; }

        [Required]
        public bool IsDefault { get; set; } = false;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public virtual Users User { get; set; } = default!;

        public virtual ICollection<Payments> Payments { get; set; } = [];
    }
}
