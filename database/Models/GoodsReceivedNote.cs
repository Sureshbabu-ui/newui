using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class GoodsReceivedNote
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string GrnNumber {  get; set; }
        [Column(TypeName = "datetime")]
        public DateTime GrnDate { get; set; }
        public int TransactionId { get; set; }
        [ForeignKey("MasterEntityData")]
        public int TransactionTypeId { get; set; }
        public MasterEntityData? TransactionType { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? ReferenceNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ReferenceDate { get; set; }
        public int ReceivedLocationId { get; set; }
        [ForeignKey("ReceivedLocationId")]
        public TenantOffice? ReceivedLocation { get; set; }
        public int ReceivedById { get; set; }
        [ForeignKey("ReceivedById")]
        public UserInfo? ReceivedBy { get; set; }
        public int? SourceLocationId { get; set; }
        [ForeignKey("SourceLocationId")]
        public TenantOffice? SourceLocation { get; set; }
        public int? SourceEngineerId { get; set; }
        [ForeignKey("SourceEngineerId")]
        public UserInfo? SourceEngineer { get; set; }
        public int? SourceVendorId { get; set; }
        [ForeignKey("SourceVendorId")]
        public Vendor? SourceVendor { get; set; }
        [DefaultValue(false)]
        public bool IsProcessed { get; set; }
        public string? Remarks { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
    }
}

