using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShopBack.Models
{
    public class Products
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? OldPrice { get; set; }

        [Required]
        [Column(TypeName = "decimal(3,1)")]
        public decimal Rating { get; set; } = 0.0M;

        [Required]
        public int ReviewsNumber { get; set; } = 0;

        [Required]
        public int QuantityInStock { get; set; } = 0;

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public bool IsActive { get; set; } = true;

        [ForeignKey("CategoryId")]
        public Categories Category { get; set; }
        public ICollection<ProductImages> ProductImage { get; set; } = new List<ProductImages>();
        public ICollection<ProductSpecifications> ProductSpecification { get; set; } = new List<ProductSpecifications>();
        public ICollection<ProductReviews> ProductReview { get; set; } = new List<ProductReviews>();
        public ICollection<UserFavorites> UserFavorite { get; set; } = new List<UserFavorites>();
        public ICollection<ProductViewsHistory> ProductViewHistory { get; set; } = new List<ProductViewsHistory>();
    }
}
