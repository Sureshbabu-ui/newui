using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class PendingApprovals
    {
        public int ApprovalRequestId { get; set; }
        public int ApprovalRequestDetailId { get; set; }
        public int CaseId { get; set; }
        public string EventCode { get; set; }
        public DateTime? FetchTime { get; set; }
        public string Content { get; set; }
        public int ReviewedBy { get; set; }
        public DateTime? ReviewedOn { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public string ReviewComment { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedUserName { get; set; }
        public string ReviewedUserName { get; set; }
    }

    public class PendingApprovalList
    {
        public int ApprovalRequestId { get; set; }
        public int ApprovalRequestDetailId { get; set; }
        public int CaseId { get; set; }
        public string EventCode { get; set; }
        public string EventName { get; set; }

        public DateTime? FetchTime { get; set; }
        public string Content { get; set; }
        public int ReviewedBy { get; set; }
        public DateTime? ReviewedOn { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public string ReviewComment { get; set; }
        public string CreatedUserName { get; set; }
        public string ReviewedUserName { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class DraftList
    {
        public int ApprovalRequestId { get; set; }
        public int CaseId { get; set; }
        public string EventCode { get; set; }
        public string EventName { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public int CreatedBy { get; set; }

        public DateTime? CreatedOn { get; set; }
        public string CreatedUserName { get; set; }
        public string Content { get; set; }
    }
    public class PendingApprovalDetail
    {

        public int ApprovalRequestId { get; set; }
        public int ApprovalRequestDetailId { get; set; }
        public int CaseId { get; set; }
        public string TableName { get; set; }
        public DateTime FetchTime { get; set; }
        public string Content { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedUserName { get; set; }
    }

    public class ApprovalRequestReviewDetail
    {
        public int Id { get; set; }
        public int Sequence { get; set; }
        public string? ReviewedBy { get; set; }
        public string Role { get; set; }
        public DateTime? ReviewedOn { get; set; }
        public string ReviewStatusCode { get; set; }
        public string ReviewStatusName { get; set; }
        public string? ReviewComment { get; set; }
    }
    public class ApprovalRequestDetailWithReview
    {
        public PendingApprovalDetail ApprovalRequestDetail { get; set; }
        public IEnumerable<ApprovalRequestReviewDetail> ApprovalRequestReviewList { get; set; }
    }

    public class CustomerEditDetails
    {
        public int Id { get; set; }
        public string Content { get; set; }
         public string ReviewStatus { get; set; }
    }
    public class ApprovalReviewDetails
    {
        public int? Id { get; set; }
        public int? UserId { get; set; }
        public string? ReviewComment { get; set; }
        public string? ReviewedBy { get; set; }
        public string? ReviewStatus { get; set; }
        public string? CreatedOn { get; set; }
    }

    //public class BankDetails
    //{
    //    public int? ApprovalFlowId { get; set; }
    //    public string BankCode { get; set; }
    //    public string BankName { get; set; }
    //    public string CaseId { get; set; }
    //    public int IsDeleted { get; set; }
    //    public int CreatedBy { get; set; }
    //    public string CreatedOn { get; set; }
    //    public string UpdatedBy { get; set; }
    //    public string UpdatedOn { get; set; }
    //    public string ApprovedBy { get; set; }
    //    public string ApprovedOn { get; set; }
    //    public string ReviewStatus { get; set; }

    //}
    public class BankApprovalRequest
    {
        public int ApprovalRequestDetailId { get; set; }
        public string? ReviewComment { get; set; }
        [Required(ErrorMessage = "validation_error_bank_request_review_reviewstatus_required")]
        public string ReviewStatus { get; set; }
        public string FetchTime { get; set; }
    }
    public class RejectApprovalRequest
    {
        public int ApprovalRequestDetailId { get; set; }
        [Required(ErrorMessage = "validation_error_request_review_reviewstatus_required")]
        public string ReviewComment { get; set; }
    }
    public class RequestChangeApprovalRequest
    {
        public int ApprovalRequestDetailId { get; set; }
        [Required(ErrorMessage = "validation_error_bank_request_review_reviewcomment_required")]
        public string ReviewComment { get; set; }
        [Required(ErrorMessage = "validation_error_bank_request_review_reviewstatus_required")]
        public string ReviewStatus { get; set; }
    }

 
    public class UserEditApprovalRequest
    {
        public UserApprovalDetails ContentParsed { get; set; }
        public int Id { get; set; }
    }

    public class ApprovalRequestDetails
    {
        public int Id { get; set; }
    }

    public class DeleteCustomerRequest
    {
        public int Id { get; set; }
        public int DeletedBy { get; set; }
    }

    public class CustomerDetails
    {
        public int? Id { get; set; }
        public int? CustomerId { get; set; }
        public int? ApprovalFlowId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_name_required")]
        public string? Name { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_nameonprint_required")]
        public string? NameOnPrint { get; set; }
        public int? CustomerGroupId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_tenantofficeid_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_industry_required")]
        public int CustomerIndustryId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtoaddress_required")]
        public string BilledToAddress { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtocityid_required")]
        public int BilledToCityId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtostateid_required")]
        public int BilledToStateId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtocountryid_required")]
        public int BilledToCountryId { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtopincode_required")]
        public string BilledToPincode { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_billedtogstnumber_required")]
        public string BilledToGstNumber { get; set; }
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
        [Required(ErrorMessage = "validation_error_createcustomer_shippedtgstnumber_required")]
        public string ShippedToGstNumber { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_iscontractcustomer_required")]
        public bool IsContractCustomer { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_contactname_required")]
        public string PrimaryContactName { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_contactemail_required")]
        public string PrimaryContactEmail { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_contactphone_required")]
        public string PrimaryContactPhone { get; set; }
        public string? SecondaryContactName { get; set; }
        public string? SecondaryContactPhone { get; set; }
        public string? SecondaryContactEmail { get; set; }
        public string? PanNumber { get; set; }
        public string? TinNumber { get; set; }
        public string? TanNumber { get; set; }
        public string? CinNumber { get; set; }
        [Required(ErrorMessage = "validation_error_createcustomer_ismsme_required")]
        public bool? IsMsme { get; set; }
        public string? MsmeRegistrationNumber { get; set; }
        public string CaseId { get; set; }
        public int IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
        public string ApprovedBy { get; set; }
        public string ApprovedOn { get; set; }
    }

    public class CustomerApprovalRequest
    {
        public CustomerDetails ContentParsed { get; set; }
        public List<ApprovalReviewDetails> ReviewDetails { get; set; }
        [Required(ErrorMessage = "validation_error_bank_request_review_reviewstatus_required")]
        public string ReviewStatus { get; set; }
        public string FetchTime { get; set; }
    }

    public class PartCodificationApprovalCreate
    {
        [Required(ErrorMessage = "validation_error_api_approvalrequestpart_productcategory_required")]
        public int ProductCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_api_approvalrequestpart_partcategory_required")]
        public int PartCategoryId { get; set; }
        public int? PartSubCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_api_approvalrequestpart_make_required")]
        public int MakeId { get; set; }
        public string? HsnCode { get; set; }
        [Required(ErrorMessage = "validation_error_api_approvalrequestpart_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_api_approvalrequestpart_name_max")]
        public string PartName { get; set; }
        public string? OemPartNumber { get; set; }
    }

    public class PartApprovalRequest
    {
        public PartCreate ContentParsed { get; set; }
        public PartApprovalReviewDetails ReviewDetails { get; set; }
        [Required(ErrorMessage = "validation_error_bank_request_review_reviewstatus_required")]
        public string ReviewStatus { get; set; }
        public string FetchTime { get; set; }
    }
    public class UserCreateWithoutFile
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string PassCode { get; set; }
        public string? UserCategoryId { get; set; }
        public int EngagementTypeId { get; set; }
        public string EmployeeCode { get; set; }
        public int DivisionId { get; set; }
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public int TenantOfficeId { get; set; }
        public int GenderId { get; set; }
        public int? ReportingManagerId { get; set; }
        public string UserRoles { get; set; }
        public int? EngineerCategory { get; set; }
        public string? EngineerGeolocation { get; set; }
        public string? EngineerAddress { get; set; }
        public int? EngineerCityId { get; set; }
        public int? EngineerCountryId { get; set; }
        public string? EngineerPincode { get; set; }
        public int? EngineerStateId { get; set; }
        public int? EngineerLevel { get; set; }
        public int? EngineerType { get; set; }
        public bool IsConcurrentLoginAllowed { get; set; }
        public string BusinessUnits { get; set; }
        public DateTime? UserExpiryDate { get; set; }
        public string? DocumentUrl { get; set; }
        public Decimal? BudgetedAmount { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? StartDate { get; set; }
        public Decimal? CustomerAgreedAmount { get; set; }
        public int? CustomerSiteId { get; set; }
        public int? ContractId { get; set; }
        public long? DocumentSize { get; set; }
        public int? UserGradeId { get; set; }
    }

    public class PartApprovalDetail
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public string TableName { get; set; }
        public DateTime FetchTime { get; set; }
        public string Content { get; set; }
        public string ProductCategoryName { get; set; }
        public string PartCategoryName { get; set; }
        public string? PartSubCategoryName { get; set; }
        public string MakeName { get; set; }
        public int ReviewedBy { get; set; }
        public DateTime? ReviewedOn { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public string ReviewComment { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedUserName { get; set; }
        public string ReviewedUserName { get; set; }
    }
    public class UserApprovalDetails
    {
        public string? CaseId { get; set; }
        public int ApprovalFlowId { get; set; }
        public string FullName { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_email_required")]
        [EmailAddress(ErrorMessage = "validation_error_valid_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_phone_required")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$",
                ErrorMessage = "validation_error_invalid_phone")]
        public string Phone { get; set; }
        public string PassCode { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_category_required")]
        public string UserCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_engagement_type_required")]
        public int EngagementTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_forgot_password_empcode_required")]
        public string EmployeeCode { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_division_required")]
        public int DivisionId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_department_required")]
        public int DepartmentId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_division_required")]
        public int DesignationId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_tenant_office_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_gender_required")]
        public int GenderId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_reporting_manager_required")]
        public int? ReportingManagerId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_role_required")]
        public string UserRoles { get; set; }
        public int? EngineerCategory { get; set; }
        public string? EngineerGeolocation { get; set; }
        public string? EngineerAddress { get; set; }
        public int? EngineerCityId { get; set; }
        public int? EngineerCountryId { get; set; }
        public string? EngineerPincode { get; set; }
        public int? EngineerStateId { get; set; }
        public int? EngineerLevel { get; set; }
        public int? EngineerType { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public string? DocumentUrl { get; set; }
        public int? DocumentSize { get; set; }
        public string BusinessUnits { get; set; }
        public bool IsConcurrentLoginAllowed { get; set; }
        public string? BudgetedAmount { get; set; }
        public string? EndDate { get; set; }
        public string? StartDate { get; set; }
        public string? CustomerAgreedAmount { get; set; }
        public int? CustomerSiteId { get; set; }
        public int? ContractId { get; set; }
        public int? CustomerInfoId { get; set; }
        public string? UserExpiryDate { get; set; }
    }

    public class ApprovalReviewDetail
    {
        public int? Id { get; set; }
        public string? UserId { get; set; }
        public string? ReviewComment { get; set; }
        public string? ReviewedBy { get; set; }
        public string? ReviewStatus { get; set; } 
        public DateTime? CreatedOn { get; set; }
    }

    public class UserApprovalRequest
    {
       public int ApprovalRequestDetailId { get; set; }
        public string? ReviewComment { get; set; }
        public string FetchTime { get; set; }
    }
}