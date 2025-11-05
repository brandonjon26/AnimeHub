using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace AnimeHub.Api.Entities.Ayami
{
    public class AyamiAccessory
    {
        public int AyamiAccessoryId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; }

        public bool IsWeapon { get; set; } = false;

        // Navigation property for the new many-to-many relationship
        public ICollection<AccessoryAttireJoin> AttireLinks { get; set; } = new List<AccessoryAttireJoin>(); 
    }
}
