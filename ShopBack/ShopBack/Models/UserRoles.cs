using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShopBack.Models
{
    public class UserRoles
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int RoleId { get; set; }

        [ForeignKey("UserId")]
        public Users User { get; set; }

        [ForeignKey("RoleId")]
        public Roles Role { get; set; }
    }
}
