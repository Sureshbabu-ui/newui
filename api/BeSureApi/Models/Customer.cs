using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeSureApi.Models
{
    public class CustomerCreateApproval
    {
        public int? Id { get; set; }
        public int? CustomerId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_name_required")]
        public string? Name { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_nameonprint_required")]
        public string? NameOnPrint { get; set; }
        public int? CustomerGroupId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_industry_required")]
        public int CustomerIndustryId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_tenantofficeid_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtoaddress_required")]
        public string BilledToAddress { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtocityid_required")]
        public int? BilledToCityId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtostateid_required")]
        public int BilledToStateId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtocountryid_required")]
        public int BilledToCountryId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtopincode_required")]
        public string BilledToPincode { get; set; }
        public string? BilledToGstNumber { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_shippedtoaddress_required")]
        public string ShippedToAddress { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_shippedtocityid_required")]
        public int ShippedToCityId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_shippedtostateid_required")]
        public int ShippedToStateId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_shippedtocountryid_required")]
        public int ShippedToCountryId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_shippedtopincode_required")]
        public string ShippedToPincode { get; set; }
        public string? ShippedToGstNumber { get; set; }
        [Required(ErrorMessage = "validation_error_updatecustomer_iscontractcustomer_required")]
        public bool IsContractCustomer { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_contactname_required")]
        public string PrimaryContactName { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_contactemail_required")]
        public string PrimaryContactEmail { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_contactphone_required")]
        public string PrimaryContactPhone { get; set; }
        public string? SecondaryContactName { get; set; }
        public string? SecondaryContactEmail { get; set; }
        public string? SecondaryContactPhone { get; set; }
        public string? PanNumber { get; set; }
        public string? TinNumber { get; set; }
        public string? TanNumber { get; set; }
        public string? CinNumber { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_ismsme_required")]
        public bool? IsMsme { get; set; }
        public string? MsmeRegistrationNumber { get; set; }
        public string CaseId { get; set; }
        public int? GstTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_gsttypeid_required")]
        public int IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public string ReviewStatus { get; set; }
    }

    public class CustomerDraftCreate
    {
        public int? Id { get; set; }
        public int? CustomerId { get; set; }
        public string? Name { get; set; }
        public string? NameOnPrint { get; set; }
        public int? CustomerGroupId { get; set; }
        public int? CustomerIndustryId { get; set; }
        public int? TenantOfficeId { get; set; }
        public string? BilledToAddress { get; set; }
        public int? BilledToCityId { get; set; }
        public int? BilledToStateId { get; set; }
        public int? BilledToCountryId { get; set; }
        public string? BilledToPincode { get; set; }
        public string? BilledToGstNumber { get; set; }
        public string? ShippedToAddress { get; set; }
        public int? ShippedToCityId { get; set; }
        public int? ShippedToStateId { get; set; }
        public int? ShippedToCountryId { get; set; }
        public string? ShippedToPincode { get; set; }
        public string? ShippedToGstNumber { get; set; }
        public bool? IsContractCustomer { get; set; }
        public string? PrimaryContactName { get; set; }
        public string? PrimaryContactEmail { get; set; }
        public string? PrimaryContactPhone { get; set; }
        public string? SecondaryContactName { get; set; }
        public string? SecondaryContactEmail { get; set; }
        public string? SecondaryContactPhone { get; set; }
        public string? PanNumber { get; set; }
        public string? TinNumber { get; set; }
        public string? TanNumber { get; set; }
        public string? CinNumber { get; set; }
        public bool? IsMsme { get; set; }
        public string? MsmeRegistrationNumber { get; set; }
        public string? CaseId { get; set; }
        public int? GstTypeId { get; set; }
        public int? IsDeleted { get; set; }
        public int? CreatedBy { get; set; }
        public string? ReviewStatus { get; set; }
    }

    public class CustomerList
    {
        public int CustomerId { get; set; }
        public int CustomerInfoId {  get; set; }
        public string Name { get; set; }
        public string CustomerCode { get; set; }
        public string PrimaryContactEmail { get; set; }
        public string PrimaryContactPhone { get; set; }
        public int IsActive { get; set; }
        public int IsContractCustomer { get; set; }
        public int IsVerified { get; set; }
        public int CreatedBy { get; set; }
    }
    public class ExistingCustomerDetails
    {
        public string Name { get; set; }
        public string BilledToAddress { get; set; }
        public bool IsVerified { get; set; }
        public string CustomerCode { get; set; }
        public int SCORE { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class CustomerUpdate
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Name { get; set; }
        public string NameOnPrint { get; set; }
        public int? CustomerGroupId { get; set; }
        public int TenantOfficeId { get; set; }
        public string BilledToAddress { get; set; }
        public int BilledToCityId { get; set; }
        public int BilledToStateId { get; set; }
        public int BilledToCountryId { get; set; }
        public string BilledToPincode { get; set; }
        public string? BilledToGstNumber { get; set; }
        public string ShippedToAddress { get; set; }
        public int ShippedToCityId { get; set; }
        public int ShippedToStateId { get; set; }
        public int ShippedToCountryId { get; set; }
        public string ShippedToPincode { get; set; }
        public string? ShippedToGstNumber { get; set; }
        public bool IsContractCustomer { get; set; }
        public string PrimaryContactName { get; set; }
        public string PrimaryContactEmail { get; set; }
        public string PrimaryContactPhone { get; set; }
        public string? SecondaryContactName { get; set; }
        public string? SecondaryContactEmail { get; set; }
        public string? SecondaryContactPhone { get; set; }
        public string? PanNumber { get; set; }
        public string? TinNumber { get; set; }
        public string? TanNumber { get; set; }
        public string? CinNumber { get; set; }
        public int? GstTypeId { get; set; }
        public bool IsMsme { get; set; }
        public string? MsmeRegistrationNumber { get; set; }
        public int UpdatedBy { get; set;}
    }

    public class CustomerUpdateDetails
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public string CustomerCode { get; set; }
        public string Name { get; set; }
        public string NameOnPrint { get; set; }
        public int? CustomerGroupId { get; set; }
        public int? CustomerIndustryId { get; set; }
        public int TenantOfficeId { get; set; }
        public string BilledToAddress { get; set; }
        public int BilledToCityId { get; set; }
        public int BilledToStateId { get; set; }
        public int BilledToCountryId { get; set; }
        public string BilledToPincode { get; set; }
        public string? BilledToGstNumber { get; set; }
        public string ShippedToAddress { get; set; }
        public int ShippedToCityId { get; set; }
        public int ShippedToStateId { get; set; }
        public int ShippedToCountryId { get; set; }
        public string ShippedToPincode { get; set; }
        public string? ShippedToGstNumber { get; set; }
        public bool IsContractCustomer { get; set; }
        public string PrimaryContactName { get; set; }
        public string PrimaryContactEmail { get; set; }
        public string PrimaryContactPhone { get; set; }
        public string SecondaryContactName { get; set; }
        public string SecondaryContactEmail { get; set; }
        public string SecondaryContactPhone { get; set; }
        public string PanNumber { get; set; }
        public string TinNumber { get; set; }
        public string TanNumber { get; set; }
        public string CinNumber { get; set; }
        public bool IsMsme { get; set; }
        public string MsmeRegistrationNumber { get; set; }
    }
    public class Deletesite
    {
        public int Id { get; set; }
        public int DeletedBy { get; set; }
    }
    public class CustomerApprove
    {
        public int ApprovalRequestDetailId { get; set; }
        public string? ReviewComment { get; set; }
        public string FetchTime { get; set; }
    }
}
