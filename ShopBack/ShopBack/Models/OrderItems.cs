using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ShopBack.Models
{
    public class OrderItems
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Order")]
        public int OrderId { get; set; }

        [Required]
        [ForeignKey("Product")]
        public int ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [ForeignKey("OrderId")]
        [JsonIgnore]
        public virtual Orders Order { get; set; } = default!;

        [ForeignKey("ProductId")]
        public virtual Products Product { get; set; } = default!;
    }
}
