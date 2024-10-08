using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class ContractAssetSummaryList
    {
        public int Id { get; set; }
        public string? PartCategoryNames { get; set; }
        public string CategoryName { get; set; }
        public int ProductCountAtBooking { get; set; }
        public int AmcValue { get; set; }
        public int PendingAssetCount { get; set; }
        public int PreAmcAssetCount { get; set; }
        public int InterimAssetCount { get; set; }
        public int AssetProductCategoryId { get; set; }
    }

    public class ContractAssetSummaryCreate
    {
        public int ContractId { get; set; }
        public string? PartCategoryId { get; set; }
        public int ProductCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_summary_productcount_required")]
        public string ProductCountAtBooking { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_summary_amc_value_required")]
        public string AmcValue { get; set; }
        public int CreatedBy { get; set; }
    }

    public class ContractAssetSummaryUpdate
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public string PartCategoryList { get; set; }
        public int ProductCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_summary_productcount_required")]
        public int ProductCountAtBooking { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_summary_amc_value_required")]
        public decimal AmcValue { get; set; }
        public int UpdatedBy { get; set; }
    }
    public class ContractPartCategoryNames
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public bool IsActive { get; set; }
    }
    public class PartsNotCovered
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class ContractAssetSummarySiteWiseList
    {
        public string? TenantOfficeName { get; set; }
        public string? SiteName { get; set; }
        public string? CategoryName { get; set; }
        public int AssetCount { get; set; }
       }
}