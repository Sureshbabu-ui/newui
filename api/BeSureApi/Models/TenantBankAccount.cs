using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace BeSureApi.Models
{
    public class TenantBankAccountCreate
    {
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_tenantbankaccountcreate_bankid_required")]
        public int TenantId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_tenantbankaccountcreate_bankbranchinfoid_required")]
        public int BankBranchInfoId { get; set; }
        [Required(ErrorMessage = "validation_error_tenantbankaccountcreate_relationshipmanager_required")]
        [StringLength(32, ErrorMessage = "validation_error_tenantbankaccountcreate_relationshipmanager_max_required")]
        public string RelationshipManager { get; set; }
        [Required(ErrorMessage = "validation_error_tenantbankaccountcreate_contactnumber_required")]
        [StringLength(16, ErrorMessage = "validation_error_tenantbankaccountcreate_contactnumber_max_required")]
        public string ContactNumber { get; set; }
        [Required(ErrorMessage = "validation_error_tenantbankaccountcreate_email_required")]
        [StringLength(64, ErrorMessage = "validation_error_tenantbankaccountcreate_email_max_required")]
        public string Email { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "validation_error_tenantbankaccountcreate_bankaccounttypeid_required")]
        public int BankAccountTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_tenantbankaccountcreate_accountnumber_required")]
        [StringLength(32, ErrorMessage = "validation_error_tenantbankaccountcreate_accountnumber_max_required")]
        public string AccountNumber { get; set; }
    }

    public class TenantBankAccountDetails
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int BankBranchInfoId { get; set; }
        public string RelationshipManager { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public int BankAccountTypeId { get; set; }
        public string AccountNumber { get; set; }
        public string? BankAccountTypeName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedUserName { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdatedUserName { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedOn { get; set; }
    }

    public class TenantBankAccountList
    {
        public int Id { get; set; }
        public string? BranchName { get; set; }
        public string RelationshipManager { get; set; }
        public string ContactNumber { get; set; }
        public string AccountNumber { get; set; }
    }

    public class TenantBankAccountNames
    {
        public int Id { get; set; }
        public string BranchName { get; set; }
        public string BankName { get; set; }
    }
}
