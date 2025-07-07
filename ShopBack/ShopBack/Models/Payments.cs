using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ShopBack.Models
{
    public class Payments
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Order")]
        public int OrderId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        [Required]
        [ForeignKey("PayMethod")]
        public int PaymentMethodId { get; set; } 

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } 

        [MaxLength(100)]
        public string? TransactionId { get; set; }

        [ForeignKey("OrderId")]
        [JsonIgnore]
        public virtual Orders? Order { get; set; }

        [ForeignKey("PaymentMethodId")]
        public virtual PayMethods? PayMethod { get; set; }
    }
}
