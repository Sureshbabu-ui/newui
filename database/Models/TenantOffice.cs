using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(Code), IsUnique = true)]
    [Microsoft.EntityFrameworkCore.Index(nameof(OfficeName), IsUnique = true)]
    public class TenantOffice
    {
        public int Id { get; set; }
        [ForeignKey("TenantId")]
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string Code { get; set; }
        [ForeignKey("OfficeTypeId")]
        public int OfficeTypeId { get; set; }
        public MasterEntityData? OfficeType { get; set; }
        public int? RegionId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)] 
        public string OfficeName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? GeoLocation { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [ForeignKey("RegionId")]
        public TenantRegion? TenantRegion { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
    }
}
