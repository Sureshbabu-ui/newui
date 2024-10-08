using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class BankBranchDetails
    {
        public int Id { get; set; }
        public int BankId { get; set; }
        public string BankName { get; set; }
        public string BranchCode { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public string Address { get; set; }
        public int CityName { get; set; }
        public int StateName { get; set; }
        public int CountryId { get; set; }
        public string Pincode { get; set; }
        public string ContactPerson { get; set; }
        public string ContactNumberOneCountryCode { get; set; }
        public string ContactNumberOne { get; set; }
        public string? ContactNumberTwoCountryCode { get; set; }
        public string? ContactNumberTwo { get; set; }
        public string Email { get; set; }
        public string Ifsc { get; set; }
        public string MicrCode { get; set; }
        public string SwiftCode { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
        public string CreatedByFullName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? UpdatedByFullName { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
    public class BankBranchList
    {
        public int Id { get; set; }
        public string BankName { get; set; }
        public string BranchName { get; set; }
        public string CityName { get; set; }
        public string StateName { get; set; }
        public string Ifsc { get; set; }
        public string CreatedByFullName { get; set; }
        public DateTime CreatedOn { get; set; }
    }
    public class BankBranchCreate
    {
        [Required(ErrorMessage = "validation_error_bankbranch_create_bank_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_bankbranch_create_bank_required")]
        public int BankId { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_code_required")]
        public string BranchCode { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_name_required")]
        public string BranchName { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_address_required")]
        public string Address { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_city_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_bankbranch_create_city_required")]
        public int CityId { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_state_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_bankbranch_create_state_required")]
        public int StateId { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_country_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_bankbranch_create_country_required")]
        public int CountryId { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_pincode_required")]
        public string Pincode { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_contactperson_required")]
        public string ContactPerson { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_contact1countrycode_required")]
        public string ContactNumberOneCountryCode { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_contact1_required")]
        public string ContactNumberOne { get; set; }
        public string? ContactNumberTwoCountryCode { get; set; }
        public string? ContactNumberTwo { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_ifsc_required")]
        public string Ifsc { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_micrcode_required")]
        public string MicrCode { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_swiftcode_required")]
        public string SwiftCode { get; set; }
        public int CreatedBy { get; set; }
    }

    public class BankBranchEdit
    {
        public int Id { get; set; }
        public int BranchId { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_code_required")]
        public string BranchCode { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_name_required")]
        public string BranchName { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_address_required")]
        public string Address { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_city_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_bankbranch_create_city_required")]
        public int CityId { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_state_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_bankbranch_create_state_required")]
        public int StateId { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_country_required")]
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_bankbranch_create_country_required")]
        public int CountryId { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_pincode_required")]
        public string Pincode { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_contactperson_required")]
        public string ContactPerson { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_contact1countrycode_required")]
        public string ContactNumberOneCountryCode { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_contact1_required")]
        public string ContactNumberOne { get; set; }
        public string? ContactNumberTwoCountryCode { get; set; }
        public string? ContactNumberTwo { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_ifsc_required")]
        public string Ifsc { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_micrcode_required")]
        public string MicrCode { get; set; }
        [Required(ErrorMessage = "validation_error_bankbranch_create_swiftcode_required")]
        public string SwiftCode { get; set; }
    }
}
