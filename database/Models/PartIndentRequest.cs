using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(IndentRequestNumber), IsUnique = true)]
    public class PartIndentRequest
    {
        public int Id { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string IndentRequestNumber { get; set; }
        [ForeignKey("ServiceRequestId")]
        public int ServiceRequestId { get; set; }
        public ServiceRequest? ServiceRequest { get; set; }
        [ForeignKey("ProductCategoryId")]
        public int AssetProductCategoryId { get; set; }
        public AssetProductCategory? AssetProductCategory { get; set; }
        public int RequestedBy { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Remarks { get; set; }
        [DefaultValue(false)]
        public bool IsProcessed { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [DefaultValue(null)]
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}
