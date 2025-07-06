using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopBack.Models
{
    public class Users
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; }

        [Required]
        [MaxLength(100)]
        public string Salt { get; set; }

        [MaxLength(50)]
        public string? FirstName { get; set; }

        [MaxLength(50)]
        public string? MiddleName { get; set; }

        [MaxLength(50)]
        public string? LastName { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public bool IsActive { get; set; } = true;

        public ICollection<RefreshTokens> RefreshToken { get; set; } = new List<RefreshTokens>();
        public ICollection<ProductReviews> ProductReview { get; set; } = new List<ProductReviews>();
        public ICollection<ProductReviews> ModeratedReview { get; set; } = new List<ProductReviews>();
        public ICollection<UserFavorites> UserFavorite { get; set; } = new List<UserFavorites>();
        public ICollection<ProductViewsHistory> ProductViewHistory { get; set; } = new List<ProductViewsHistory>();
        public ICollection<PayMethods> PayMethods { get; set; } = new List<PayMethods>();
        public ICollection<Orders> Orders { get; set; } = new List<Orders>();
        public UserRoles UserRole { get; set; }
    }
}
