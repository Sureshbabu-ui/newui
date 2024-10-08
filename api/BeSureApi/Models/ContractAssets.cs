using MimeKit.Encodings;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class ContractAssetsCreate
    {
        public int ContractId { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_customersite_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_asset_customersite_required")]
        public int CustomerSiteId { get; set; }
        public int DistanceToCustomerSite { get; set; }
        public string? MspAssetId { get; set; }
        public string? CustomerAssetId { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_asset_category_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_asset_asset_category_required")]
        public int ProductCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_assetmake_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_asset_assetmake_required")]
        public int ProductMakeId { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_asset_model_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_asset_asset_model_required")]
        public int ProductModelId { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_serielno_required")]
        public string? ProductSerialNumber { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_enterprise_asset_required")]
        public int IsEnterpriseProduct { get; set; }
        [Required(ErrorMessage = "Validation_error_create_asset_responsetime_required")]
        public float ResponseTimeInHours { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_resolutiontime_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_asset_resolutiontime_required")]
        public float ResolutionTimeInHours { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_standbytime_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_asset_standbytime_required")]
        public float StandByTimeInHours { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_slatype_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_asset_slatype_required")]
        public int SlaTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_vip_asset_required")]
        public int IsVipProduct { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_amcvalue_required")]
        public decimal AmcValue { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_outsourcing_required")]
        public int IsOutsourcingNeeded { get; set; }
        public DateTime? PreAmcStartDate { get; set; }
        public DateTime? PreAmcEndDate { get; set; }
        public int IsPreAmcCompleted { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_audited_asset_required")]
        public int AuditedProductFound { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_assets_condition_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_asset_assets_condition_required")]
        public int ProductCondition { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_preventive_maintenance_needed_required")]
        public int IsPreventiveMaintenanceNeeded { get; set; }
        [Required(ErrorMessage = "Validation_error_create_asset_pm_frequency_required")]
        [Range(1, int.MaxValue, ErrorMessage = "Validation_error_create_asset_pm_frequency_required")]
        public int PreventiveMaintenanceFrequency { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_pm_startdate_required")]
        public DateTime? PreventiveMaintenanceStartDate { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_pm_enddate_required")]
        public DateTime? PreventiveMaintenanceEndDate { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_assets_support_type_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_create_asset_assets_support_type_required")]
        public int ProductSupportType { get; set; }  
        public DateTime? WarrantyEndDate { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_amc_enddate_required")]
        public DateTime? AmcEndDate { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_amc_startdate_required")]
        public DateTime? AmcStartDate { get; set; }
    }

    public class ContractAssetsList
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public bool IsPreAmcCompleted { get; set; }
        public int CustomerSiteId { get; set; }
        public string? Location { get; set; }
        public string AssetModelNumber { get; set; }
        public string CustomerName { get; set; }
        public string? CustomerSiteName { get; set; }
        public string CategoryName { get; set; }
        public string ProductMake { get; set; }
        public string ModelName { get; set; }
        public string AssetAddedMode { get; set; }
        public string? ProductSerialNumber { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
    }

    public class AssetFilters
    {
        public bool IsPreAmcDone { get; set; }
        public bool IsPreAmcPending { get; set; }
        public int TenantRegionId { get; set; }
        public int TenantOfficeId { get; set; }
    }
    public class PreAmcPendingAssetList
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public bool IsOutSourcingNeeded { get; set; }
        public string? Location { get; set; }
        public int CustomerSiteId { get; set; }
        public string? VendorBranch { get; set; }
        public string AssetModelNumber { get; set; }
        public string CustomerName { get; set; }
        public string? CustomerSiteName { get; set; }
        public string CategoryName { get; set; }
        public string ProductMake { get; set; }
        public string ModelName { get; set; }
        public string AssetAddedMode { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? ContractNumber { get; set; }
    }
    public class ContractAssetsUpdate
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public string ProductSerialNumber { get; set; }
        public string IsPreAmcCompleted { get; set; }
        public string IsOutsourcingNeeded { get; set; }
        public string IsVipProduct { get; set; }
        public decimal AmcValue { get; set; }
        public string? PreAmcCompletedDate { get; set; }
        public int? PreAmcCompletedBy { get; set; }
        public string? AmcEndDate { get; set; }
        public string? AmcStartDate { get; set; }
    }
    public class ContractAssetBulkUploadPreview
    {
        public int? ContractId { get; set; }
        public IFormFile? file { get; set; }
    }
    public class ContractAssetColumnNamesMapping
    {
        public bool IsMandatory { get; set; }
        public string DbName { get; set; }
    }
    public class CountObject
    {
        public int Id { get; set; }
        public int Count { get; set; }
    }
    public class ContractAssetSiteTransfer
    {
        public string AssetIdList { get; set; }
        public int CustomerSiteId { get; set; }
    }
    public class ContractCustomerSites
    {
        public string? SiteName { get; set; }
        public int Id { get; set; }
        public int TenantOfficeId { get; set; }
    }
    public class ContractProductCategory
    {
        public int Id { get; set; }
        public string? CategoryName { get; set; }
    }
    public class ProductCategoryDetails
    {
        public int ProductCategoryId { get; set; }
        public int CountDifference { get; set; }
        public string CategoryName { get; set; }
    }
    public class ContractProductMake
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
    public class ContractProduct
    {
        public int Id { get; set; }
        public string? ModelName { get; set; }
    }
    public class MasterDataNames
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }
    public class TenantOfficeCodes
    {
        public int Id { get; set; }
        public string Code { get; set; }
    }
    public class ContractAssetDetails
    {
        public int? LocationId { get; set; }
        public int IsPreAmcCompleted { get; set; }
        public int ContractId { get; set; }
        public int SiteNameId { get; set; }
        public int DistanceToCustomerSite { get; set; }      
        public string? AccelAssetId { get; set; }
        public int? CallType { get; set; }
        public string? CustomerAssetId { get; set; }
        public int ProductCategoryId { get; set; }
        public int ProductMakeId { get; set; }
        public int ProductId { get; set; }
        public string? AssetSerialNumber { get; set; }
        public int IsEnterpriseAssetId { get; set; }
        public float ResponseTimeInHours { get; set; }
        public float ResolutionTimeInHours { get; set; }
        public float StandByTimeInHours { get; set; }
        public int SlaTypeId { get; set; }
        public int IsVipAssetId { get; set; }
        public int IsRenewedAsset { get; set; }
        public string AmcValue { get; set; }
        public int IsOutSourcingNeededId { get; set; }
        public DateTime? PreAmcCompletedDate { get; set; }
        public int? PreAmcCompletedBy { get; set; }
        public int? AssetConditionId { get; set; }
        public int IsPreventiveMaintenanceNeededId { get; set; }
        public int? PreventiveMaintenanceFrequencyId { get; set; }
        public int AssetSupportTypeId { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public DateTime AmcEndDate { get; set; }
        public DateTime AmcStartDate { get; set; }
    }
    public class ContractAssetsBulkUpload
    {
        [Required(ErrorMessage = "validation_error_create_asset_asset_required")]
        public List<ContractAssetDetails>? Assets { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_contractid_required")]
        public int ContractId { get; set; }
    }

    public class AssetEditDetails
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public int ProductCategoryId { get; set; }
        public int ProductMakeId { get; set; }
        public int ProductModelId { get; set; }
        public string ProductSerialNumber { get; set; }
        public string MspAssetId { get; set; }
        public string CustomerAssetId { get; set; }
        public DateTime AmcEndDate { get; set; }
        public DateTime AmcStartDate { get; set; }
        public int AmcValue { get; set; }
        public string IsEnterpriseProduct { get; set; }
        public string IsOutSourcingNeeded { get; set; }
        public string IsPreAmcCompleted { get; set; }
        public string IsPreventiveMaintenanceNeeded { get; set; }
        public int ResolutionTimeInHours { get; set; }
        public int ResponseTimeInHours { get; set; }
        public int StandByTimeInHours { get; set; }
        public int ProductConditionId { get; set; }
        public DateTime WarrantyEndDate { get; set; }
        public int CustomerSiteId { get; set; }
        public int ProductSupportTypeId { get; set; }
        public DateTime? PreAmcCompletedDate { get; set; }
        public int? PreAmcCompletedBy { get; set; }
        public int PreventiveMaintenanceFrequencyId { get; set; }
        public string IsVipProduct { get; set; }
    }
    public class AssetExistDetails
    {
        public int? AssetId { get; set; }
        public bool? IsRegularAssetExist { get; set; }
        public bool? IsInterimAssetExist { get; set; }
        public bool? IsCallOpen { get; set; }
        public string? WorkOrderNumber {  get; set; }
    }
    public class AssetDetailsForSme
    {
        public string? MspAssetId { get; set; }
        public string? CustomerAssetId { get; set; }
        public string? AssetProductCategory { get; set; }
        public string? Make { get; set; }
        public string? ModelName { get; set; }
        public string? ProductSerialNumber { get; set; }
        public string? WarrantyEndDate { get; set; }
        public string? CustomerSite { get; set; }
        public string? AmcValue { get; set; }
        public string? ContractNumber { get; set; }
        public string? ResolutionTimeInHours { get; set; }
        public string? ResponseTimeInHours { get; set; }
        public string? StandByTimeInHours { get; set; }
        public string? IsOutSourcingNeeded { get; set; }
        public string? IsPreAmcCompleted { get; set; }
        public string? AmcStartDate { get; set; }
        public string? AmcEndDate { get; set; }
    }
    public class DeactivatedAssetList
    {
        public string AssetIdList { get; set; }
    }
    public class AssetDeactivationValidation
    {
        public string? ProductSerialNumber { get; set; }
    }
    public class PreAmcAssetContract
    {
        public string? ContractNumber { get; set; }
        public string? CustomerName { get; set; }
        public int? ContractId { get; set; }
        public int? TotalSite { get; set; }
        public int? TotalAsset { get; set; }
        public int? PreAmcPendingAssets { get; set; }
        public int? PreAmcCompletedAssets { get; set; }
    }

    public class SiteNameWisePreAmcAssets
    {
        public string SiteName { get; set; }
        public int SiteId { get; set; }
        public int TotalAsset { get; set; }
        public int PreAmcPendingAssets { get; set; }
        public int PreAmcCompletedAssets { get; set; }
    }
    public class PreAmcUpdateDetails
    {
        public int Id { get; set; }
        public bool IsPreAmcCompleted { get; set; }
        public string PreAmcCompletedDate { get; set; }
        public int EngineerId { get; set; }
    }
    public class BulkPreAmcUpdateAssets
    {
        public string AssetIdList { get; set; }
        public string PreAmcCompletedDate { get; set; }
        public int EngineerId { get; set; }
    }
    public class ContractAssetsSerialNumber
    {
        public int Id { get; set; }
        public string ProductSerialNumber { get; set; }
    }
    public class BackToBackVendorsList
    {
        public int Id { get; set; }
        public string VendorBranch { get; set; }
    }
    public class BackToBackAssetDetails
    {
        public int AssetId { get; set; }
        public int VendorBranchId { get; set; }
        public string? Email { get; set; }
        public string? VendorContractNumber { get; set; }
    }
    public class BackToBackAssetBulkUpload
    {
        public List<BackToBackAssetDetails>? AssetDetails { get; set; }
    }
    public class PreAmcCompletedEngineers
    {
        public int Id { get; set; }
        public string FullName { get; set; }
    }
    public class PreAmcDoneAssetDetails
    {
        public int AssetId { get; set; }
        public int? PreAmcCompletedById { get; set; }
        public int? PreAmcVendorBranchId { get; set; }
        public DateTime? PreAmcCompletedDate { get; set; }
    }
    public class PreAmcDoneAssetBulkUpload
    {
        public List<PreAmcDoneAssetDetails>? AssetDetails { get; set; }
    }
    public class PmScheduleNumbers
    {
        public int Id { get; set; }
        public string PmScheduleNumber { get; set; }
    }
    public class PreAmcVendorList
    {
        public int Id { get; set; }
        public string VendorBranch { get; set; }
    }
}