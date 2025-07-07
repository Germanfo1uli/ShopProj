using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ShopBack.Models
{
    public class ProductSpecifications
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Key { get; set; }

        [Required]
        [MaxLength(255)]
        public string Value { get; set; }

        [ForeignKey("ProductId")]
        [JsonIgnore]
        public Products Product { get; set; }
    }
}
