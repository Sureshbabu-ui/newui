using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class Vendor
    {
        [Required(ErrorMessage = "validation_error_vendor_create_tenantoffice_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_name_required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_address_required")]
        public string Address { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_city_required")]
        public int CityId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_state_required")]
        public int StateId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_country_required")]
        public int CountryId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_pincode_required")]
        public string Pincode { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_contactname_required")]
        public string ContactName { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_primaryccode_required")]
        public string ContactNumberOneCountryCode { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_primarycname_required")]
        public string ContactNumberOne { get; set; }
        public string? ContactNumberTwoCountryCode { get; set; }
        public string? ContactNumberTwo { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_creditperiod_indays_required")]
        public string CreditPeriodInDays { get; set; }
        public string? GstNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_gstvendortype_required")]
        public int GstVendorTypeId { get; set; }
        public string? ArnNumber { get; set; }
        public string? EsiNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_panno_required")]
        public string PanNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_pantypeid_required")]
        public int PanTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_vendortypeid_required")]
        public int VendorTypeId { get; set; }
        public string? TanNumber { get; set; }
        public string? CinNumber { get; set; }
        public bool IsMsme { get; set; }
        public string? MsmeRegistrationNumber { get; set; }
        public string? MsmeCommencementDate { get; set; }
        public string? MsmeExpiryDate { get; set; }
    }
    public class VendorUpdate
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_tenantoffice_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_name_required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_address_required")]
        public string Address { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_city_required")]
        public int CityId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_state_required")]
        public int StateId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_country_required")]
        public int CountryId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_pincode_required")]
        public string Pincode { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_contactname_required")]
        public string ContactName { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_primaryccode_required")]
        public string ContactNumberOneCountryCode { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_primarycname_required")]
        public string ContactNumberOne { get; set; }
        public string? ContactNumberTwoCountryCode { get; set; }
        public string? ContactNumberTwo { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_creditperiod_indays_required")]
        public int CreditPeriodInDays { get; set; }
        public string? GstNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_gstvendortype_required")]
        public int GstVendorTypeId { get; set; }
        public string ArnNumber { get; set; }
        public string EsiNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_panno_required")]
        public string PanNumber { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_pantypeid_required")]
        public int PanTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_vendor_create_vendortypeid_required")]
        public int VendorTypeId { get; set; }
        public string TanNumber { get; set; }
        public string CinNumber { get; set; }
        public bool IsMsme { get; set; }
        public bool IsActive { get; set; }
        public string? MsmeRegistrationNumber { get; set; }
        public string? MsmeCommencementDate { get; set; }
        public string? MsmeExpiryDate { get; set; }
    }

    public class VendorList
    {
        public int Id { get; set; }
        public string VendorCode { get; set; }
        public int VendorId { get; set; }
        public string Name { get; set; }
        public string? VendorType { get; set; }
        public string City { get; set; }
        public string ContactName { get; set; }
        public string ContactNumberOneCountryCode { get; set; }
        public string ContactNumberOne { get; set; }
        public string TenantLocation { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
