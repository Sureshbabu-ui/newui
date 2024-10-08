using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class VendorBranch
    {
        [Required(ErrorMessage = "validation_error_vendorbranchbranch_create_tenantoffice_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_code_required")]
        public string Code { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_name_required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_address_required")]
        public string Address { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_vendorid_required")]
        public int VendorId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_city_required")]
        public int CityId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_state_required")]
        public int StateId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_country_required")]
        public int CountryId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_pincode_required")]
        public string Pincode { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_contactname_required")]
        public string ContactName { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_primaryccode_required")]
        public string ContactNumberOneCountryCode { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_primarycname_required")]
        public string ContactNumberOne { get; set; }
        public string? ContactNumberTwoCountryCode { get; set; }
        public string? ContactNumberTwo { get; set; }
        public string? TollfreeNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_creditperiod_indays_required")]
        public string CreditPeriodInDays { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_gstno_required")]
        public string GstNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_gstvendortype_required")]
        public int GstVendorTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_gstarn_required")]
        public string GstArn { get; set; }
        public string? Remarks { get; set; }
    }
    public class VendorBranchUpdate
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_tenantoffice_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_code_required")]
        public string Code { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_name_required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_address_required")]
        public string Address { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_city_required")]
        public int CityId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_state_required")]
        public int StateId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_country_required")]
        public int CountryId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_pincode_required")]
        public string Pincode { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_contactname_required")]
        public string ContactName { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_primaryccode_required")]
        public string ContactNumberOneCountryCode { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_primarycname_required")]
        public string ContactNumberOne { get; set; }
        public string? ContactNumberTwoCountryCode { get; set; }
        public string? ContactNumberTwo { get; set; }
        public string? TollfreeNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_creditperiod_indays_required")]
        public int CreditPeriodInDays { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_gstno_required")]
        public string GstNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbranch_create_gstvendortype_required")]
        public int GstVendorTypeId { get; set; }
        public string GstArn { get; set; }
        public string? Remarks { get; set; }
        public bool IsActive { get; set; }
    }

    public class VendorBranchList
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int VendorId { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string ContactName { get; set; }
        public string ContactNumberOneCountryCode { get; set; }
        public string ContactNumberOne { get; set; }
        public string TenantLocation { get; set; }
        public bool IsActive { get; set; }
    }
}