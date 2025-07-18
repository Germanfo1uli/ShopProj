﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace ShopBack.Models
{
    public class Categories
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = default!;

        [MaxLength(500)]
        public string? Description { get; set; }

        public int? ParentCategoryId { get; set; }

        [ForeignKey("ParentCategoryId")]
        
        public Categories? ParentCategory { get; set; }

        public ICollection<Categories> ChildCategories { get; set; } = [];

        [JsonIgnore]
        public ICollection<Products> Products { get; set; } = [];
    }
}
