using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShopBack.Models
{
    public class ProductImages
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [MaxLength(255)]
        public string ImageUrl { get; set; } = default!;

        [Required]
        public bool IsMain { get; set; } = false;

        [ForeignKey("ProductId")]
        public Products Product { get; set; } = default!;
    }
}
