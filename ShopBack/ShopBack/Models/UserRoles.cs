using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ShopBack.Models
{
    public class UserRoles
    {
        public int UserId { get; set; }

        public int RoleId { get; set; }

        [ForeignKey("UserId")]
        public Users User { get; set; }

        [ForeignKey("RoleId")]
        public Roles Role { get; set; }
    }
}
