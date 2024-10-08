using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class VendorBankAccount
    {
        [Required(ErrorMessage = "validation_error_vendorbankaccount_create_vendorid_required")]
        public int VendorId { get; set; }
        public int? VendorBranchId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbankaccount_create_bankbranch_required")]
        public int BankBranchId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbankaccount_create_acctype_required")]
        public int BankAccountTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbankaccount_create_accnumber_required")]
        public string AccountNumber { get; set; }
    }
    public class VendorBankAccountUpdate
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbankaccount_create_vendorid_required")]
        public int VendorId { get; set; }
        public int? VendorBranchId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbankaccount_create_bankbranch_required")]
        public int BankBranchId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbankaccount_create_acctype_required")]
        public int BankAccountTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_vendorbankaccouunt_create_accnumber_required")]
        public string AccountNumber { get; set; }
        public bool IsActive { get; set; }
    }
    public class VendorBankAccountList
    {
        public int Id { get; set; }
        public string AccountNumber { get; set; }
        public string BankBranchName { get; set; }
        public string Ifsc { get; set; }
        public string? VendorBranchName { get; set; }
        public string AccountType { get; set; }
        public bool IsActive { get; set; }
    }
}