using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace BeSureApi.Models
{
    public class TenantRegion
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string RegionName { get; set; }
        public int TenantRegionId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsActive { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedOn { get; set; }
    }

    public class TenantRegionsList
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string RegionName { get; set; }
        public string TenantLocation { get; set; }
        public string RegionAddress { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CityName { get; set; }
        public string StateName { get; set; }
        public string Pincode { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class TenantRegionCreate
    {
        [Required(ErrorMessage = "validation_error_tenantregion_code_required")]
        [Range(2, int.MaxValue, ErrorMessage = "validation_error_tenant_region_code_max_required")]
        public string Code { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_name_required")]
        public string RegionName { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_tenantid_required")]
        public int TenantId { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_tenantRegion_name_required")]
        public string OfficeName { get; set; }
        public string? GeoLocation { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_tenantRegion_address_required")]
        public string Address { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_city_required")]
        public int CityId { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_state_required")]
        public int StateId { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_country_required")]
        public int CountryId { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_pincode_required")]
        public string Pincode { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_phone_required")]
        public string Phone { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_mobile_required")]
        public string Mobile { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_manager_required")]
        public int ManagerId { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_gstno_required")]
        public string GstNumber { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_gststate_required")]
        public int GstStateId { get; set; }
        public string? Tin { get; set; }
        public int CreatedBy { get; set; }
    }

    public class TenantRegionUpdate
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "validation_error_tenantregion_code_required")]
        public string Code { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_name_required")]
        public string RegionName { get; set; }
        [Required(ErrorMessage = "validation_error_tenantregion_tenantRegionid_required")]
        public int TenantOfficeId { get; set; }
        public int TenantOfficeInfoId { get; set; }
        public string Address { get; set; }
        public int CityId { get; set; }
        public int StateId { get; set; }
        public int CountryId { get; set; }
        public string Pincode { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public int ManagerId { get; set; }
        public string GstNumber { get; set; }
        public int GstStateId { get; set; }
        public string? Tin { get; set; }

        public bool IsActive { get; set; }
        public int UpdatedBy { get; set; }
    }
}
