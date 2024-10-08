using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class TenantOfficeInfo
    {
    }
    public class TenantOfficeInfoList
    {
        public int Id { get; set; }
        public string OfficeName { get; set; }
        public string Address { get; set; }
        public string CityName { get; set; }
        public string StateName { get; set; }
        public string Pincode{ get; set; }
        public string ManagerName { get; set; }
        public string? RegionName { get; set; }
        public bool IsVerified{ get; set; }
    }
    public class TenantOfficeLocationCreate
    {
        public int TenantId { get; set; }
        [Required(ErrorMessage = "validation_error_tenant_office_code_required")]
        [Range(3, int.MaxValue, ErrorMessage = "validation_error_tenant_office_code_max_required")]
        public string Code { get; set; }
        public string OfficeName { get; set; }
        public int OfficeTypeId { get; set; }
        public int? RegionId { get; set; }
        public string? GeoLocation { get; set; }
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
        public string Tin { get; set; }
    }

    public class TenantOfficeLocationUpdate
    {
        public int Id { get; set; }
        public int TenantOfficeId { get; set; }
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
        public string Tin { get; set; }
    }
}