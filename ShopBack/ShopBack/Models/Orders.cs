using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ShopBack.Models
{
    public class Orders
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        public DateTime? OrderTime { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; } = 0;

        [Required]
        [MaxLength(500)]
        public string? ShippingAddress { get; set; }

        [Required]
        [MaxLength(20)]
        public string? ContactPhone { get; set; }

        [Required]
        [MaxLength(1000)]
        public string? Notes { get; set; }

        [Required]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public virtual ICollection<OrderItems> OrderItem { get; set; } = new List<OrderItems>();

        [JsonIgnore]
        public virtual ICollection<Payments> Payment { get; set; } = new List<Payments>();

        [ForeignKey("UserId")]
        [JsonIgnore]
        public virtual Users? User { get; set; }
    }
}
