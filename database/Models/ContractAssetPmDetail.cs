using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractAssetPmDetail
    {
        public int Id { get; set; }
        [ForeignKey("ContractAssetDetailId")]
        public int ContractAssetDetailId { get; set; }
        public ContractAssetDetail? ContractAccetDetail { get; set; }
        [ForeignKey("PmScheduleId")]
        public int PmScheduleId { get; set; }
        public ContractPmSchedule? PmSchedule { get; set; }
        [Column(TypeName = "date")]
        public DateTime? PmDate { get; set; }
        [ForeignKey("PmEngineerId")]
        public int? PmEngineerId { get; set; }
        public UserInfo? PmEngineer { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string? PmNote { get; set; }
        [ForeignKey("VendorBranchId")]
        public int? VendorBranchId { get; set; }
        public VendorBranch? VendorBranch { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}
