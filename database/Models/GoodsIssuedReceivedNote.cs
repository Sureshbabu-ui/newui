using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class GoodsIssuedReceivedNote
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? GinNumber { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? GinDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime AllocatedOn { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        public int? RecipientUserId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ReceivedOn { get; set; }
        [ForeignKey("PartIndentDemandId")]
        public int? PartIndentDemandId { get; set; }
        public PartIndentDemand? PartIndentDemand { get; set; }
        [ForeignKey("DeliveryChallanId")] 
        public int? DeliveryChallanId { get; set; }
        public DeliveryChallan? DeliveryChallan { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Remarks { get; set; }
        public int CreatedBy {  get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn {  get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
    }
}
