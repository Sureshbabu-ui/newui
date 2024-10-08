using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class CustomerSite
    {
        public class CustomerSiteCreate
        {
            [Required(ErrorMessage = "SiteName is required")]
            public string? SiteName { get; set; }
            public int CustomerId { get; set; }
            [Required(ErrorMessage = "Address is required")]
            public string? Address { get; set; }
            [Required(ErrorMessage = "City is required")]
            public int CityId { get; set; }
            [Required(ErrorMessage = "State is required")]
            public int StateId { get; set; }
            [Required(ErrorMessage = "Pincode is required")]
            public int Pincode { get; set; }
            public string? GeoLocation { get; set; }
            [Required(ErrorMessage = "Msp Location is required")]
            public int TenantOfficeId { get; set; }
            [Required(ErrorMessage = "PrimaryContactName is required")]
            public string PrimaryContactName { get; set; }
            [Required(ErrorMessage = "PrimaryContactPhone is required")]
            public string PrimaryContactPhone { get; set; }
            public string? PrimaryContactEmail { get; set; }
            public string? SecondaryContactName { get; set; }
            public string? SecondaryContactPhone { get; set; }
            public string? SecondaryContactEmail { get; set; }
        }

        public class CustomerSiteUpdate
        {
            public int Id { get; set; }

            [Required(ErrorMessage = "SiteName is required")]
            public string? SiteName { get; set; }
            public int CustomerId { get; set; }
            [Required(ErrorMessage = "Address is required")]
            public string? Address { get; set; }
            [Required(ErrorMessage = "City is required")]
            public int CityId { get; set; }
            [Required(ErrorMessage = "State is required")]
            public int StateId { get; set; }
            [Required(ErrorMessage = "Pincode is required")]
            public int Pincode { get; set; }
            public string? GeoLocation { get; set; }
            [Required(ErrorMessage = "Msp Location is required")]
            public int TenantOfficeId { get; set; }
            [Required(ErrorMessage = "PrimaryContactName is required")]
            public string PrimaryContactName { get; set; }
            [Required(ErrorMessage = "PrimaryContactPhone is required")]
            public string PrimaryContactPhone { get; set; }
            public string? PrimaryContactEmail { get; set; }
            public string? SecondaryContactName { get; set; }
            public string? SecondaryContactPhone { get; set; }
            public string? SecondaryContactEmail { get; set; }
        }
        public class CustomerSiteList
        {
            public int Id { get; set; }
            public int CustomerId { get; set; }
            public string? SiteName { get; set; }
            public string? Address { get; set; }
            public string? PrimaryContactName { get; set; }
            public string? PrimaryContactPhone { get; set; }
        }
        public class CustomerSiteBulkUploadPreview
        {
            public IFormFile? file { get; set; }
            public int? ContractId { get; set; }
        }
        public class CustomerSiteDetails
        {
            public int? SiteNameId { get; set; }
            public string? SiteName { get; set; }
            public int CustomerId { get; set; }
            public string Address { get; set; }
            public string? AddressOne { get; set; }
            public string? AddressTwo { get; set; }
            public string? AddressThree { get; set; }
            public int CityId { get; set; }
            public int StateId { get; set; }
            public string Pincode { get; set; }
            public string Telephone { get; set; }
            public int LocationId { get; set; }
            public string ContactPersonOne { get; set; }
            public string? ContactPersonTwo { get; set; }
            public string? EmailOne { get; set; }
            public string? EmailTwo { get; set; }
            public bool IsReRequiredId { get; set; }
        }
        public class CustomerSiteBulkUpload
        {
            public List<CustomerSiteDetails>? CustomerSites { get; set; }
            public int ContractId { get; set; }
        }
        public class ContractDetail
        {
            public string? ContractNumber { get; set; }
            public int CustomerId { get; set; }
            public int SiteCount { get; set; }
        }
        public class CustomerSiteColumnNamesMapping
        {
            public bool IsMandatory { get; set; }
            public string DbName { get; set; }
        }
        public class CustomerStates
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
        public class CustomerCities
        {
            public int Id { get; set; }
            public int StateId { get; set; }
            public string Name { get; set; }
            public int TenantOfficeId { get; set; }
        }
        public class CustomerSitNames
        {
            public int Id { get; set; }
            public string SiteName { get; set; }
        }

    }
}
