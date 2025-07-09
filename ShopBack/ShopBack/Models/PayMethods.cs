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
        public string CardLastFourDigits { get; set; }  // Пример: "4242"

        [Required]
        [MaxLength(50)]
        public string CardBrand { get; set; }  // Пример: "Visa", "Mastercard"

        [Required]
        public int ExpiryMonth { get; set; }  // Пример: 12

        [Required]
        public int ExpiryYear { get; set; }   // Пример: 2025

        // Токен от платежного провайдера (Stripe, PayPal и т.д.)
        [Required]
        [MaxLength(255)]
        public string PaymentProviderToken { get; set; }

        public string? StripeCustomerId { get; set; }

        [Required]
        public bool IsDefault { get; set; } = false;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public virtual Users User { get; set; }

        public virtual ICollection<Payments> Payments { get; set; } = new List<Payments>();
    }
}
