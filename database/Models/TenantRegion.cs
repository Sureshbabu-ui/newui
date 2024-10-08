using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(Code), IsUnique = true)]
    [Microsoft.EntityFrameworkCore.Index(nameof(RegionName), IsUnique = true)]
    public class TenantRegion
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string  Code { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string RegionName { get; set; }
        public int TenantOfficeId { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")] 
        public DateTime? DeletedOn { get; set; }
    }
}
