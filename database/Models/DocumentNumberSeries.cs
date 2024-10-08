using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class DocumentNumberSeries
    {
        public int Id { get; set; }
        [ForeignKey("DocumentTypeId")]
        public int DocumentTypeId { get; set; }
        public MasterEntityData? DocumentType { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int? TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [ForeignKey("StateId")]
        public int? StateId { get; set; }
        public State? State { get; set; }
        [ForeignKey("RegionId")]
        public int? RegionId { get; set; }
        public TenantRegion? TenantRegion { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string? Year { get; set; }
        [DefaultValue(0)]
        public int DocumentNumber { get; set; }
        [ForeignKey("DocumentNumberFormatId")]
        public int? DocumentNumberFormatId { get; set; }
        public DocumentNumberFormat? DocumentNumberFormat { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
    }
}
