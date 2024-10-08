using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractAssetDetail
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        [ForeignKey("AssetId")]
        public int? AssetId { get; set; }
        public Asset Asset { get; set; }
        [DefaultValue(0)]
        public float ResolutionTimeInHours { get; set; }
        [DefaultValue(0)]
        public float ResponseTimeInHours { get; set; }
        [DefaultValue(0)]
        public float StandByTimeInHours { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string AssetWarrantyTypeCode { get; set; }
        [DefaultValue(false)]
        public bool IsEnterpriseProduct { get; set; }
        [DefaultValue(false)]
        public bool IsVipProduct { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal AmcValue { get; set; }
        [DefaultValue(false)]
        public bool IsOutSourcingNeeded { get; set; }
        [ForeignKey("OutsourcedVendorBranchId")]
        public int? OutsourcedVendorBranchId { get; set; }
        public VendorBranch? OutsourcedVendorBranch { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string? VendorContractNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime? PreAmcCompletedDate { get; set; }
        public int? PreAmcCompletedBy { get; set; }
        [DefaultValue(0)]
        public bool IsPreAmcCompleted { get; set; }
        [ForeignKey("PreAmcVendorBranchId")]
        public int? PreAmcVendorBranchId { get; set; }
        public VendorBranch? PreAmcVendorBranch { get; set; }

        [ForeignKey("ContractInterimAssetId")]
        public int? ContractInterimAssetId { get; set; }
        public ContractInterimAsset? ContractInterimAsset { get; set; }
        [ForeignKey("AssetAddModeId")]
        public int AssetAddModeId { get; set; }
        public MasterEntityData? AssetAddMode { get; set; }
        [ForeignKey("ProductConditionId")]
        public int? ProductConditionId { get; set; }
        public MasterEntityData? ProductCondition { get; set; }
        [DefaultValue(false)]
        public bool IsRenewedAsset { get; set; }
        [DefaultValue(false)]
        public bool IsPreventiveMaintenanceNeeded { get; set; }
        [ForeignKey("PreventiveMaintenanceFrequencyId")]
        public int? PreventiveMaintenanceFrequencyId { get; set; }
        public MasterEntityData? PreventiveMaintenanceFrequency { get; set; }
        [Column(TypeName = "date")]
        public DateTime? LastPmDate { get; set; }
        [ForeignKey("ProductSupportTypeId")]
        public int? ProductSupportTypeId { get; set; }
        public MasterEntityData? ProductSupportType { get; set; }
        [Column(TypeName = "date")]
        public DateTime? AmcStartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? AmcEndDate { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
    }
}