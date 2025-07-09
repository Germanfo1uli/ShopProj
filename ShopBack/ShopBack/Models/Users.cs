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
        public string Email { get; set; } = default!;

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = default!;

        [Required]
        [MaxLength(100)]
        public string Salt { get; set; } = default!;

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

        public ICollection<RefreshTokens> RefreshToken { get; set; } = [];
        public ICollection<ProductReviews> ProductReview { get; set; } = [];
        public ICollection<ProductReviews> ModeratedReview { get; set; } = [];
        public ICollection<UserFavorites> UserFavorite { get; set; } = [];
        public ICollection<ProductViewsHistory> ProductViewHistory { get; set; } = [];
        public ICollection<PayMethods> PayMethods { get; set; } = [];
        public ICollection<Orders> Orders { get; set; } = [];
        public UserRoles UserRole { get; set; } = default!;
    }
}
