using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class BankCollectionList
    {
        public int Id { get; set; }
        public string Particulars { get; set; } 
        public DateTime TransactionDate { get; set; }
        public decimal TransactionAmount { get; set; }
        public int TenantBankAccountId { get; set; }
        public DateTime? ChequeRealizedOn { get; set; }
        public DateTime? ChequeReturnedOn { get; set; }
        public string? ChequeReturnedReason { get; set; }
        public decimal TotalReceiptAmount { get; set; }
        public string ClaimedBy { get; set; }
        public int? CustomerInfoId { get; set; }
        public string? CustomerName { get; set; }
        public string? PaymentMethodCode { get; set; }
        public DateTime CreatedOn { get; set; }
    }
    public class BankCollectionUpload
    {
      public IFormFile? BankCollectionFile { get; set; }
     public string TenantBankAccountId { get; set; } 
    }

    public class BankCollectionProcess
    {
        public int Id { get; set; }
        public string Particulars { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TransactionAmount { get; set; }
        public int TenantBankAccountId { get; set; }
        public int CustomerInfoId { get; set; }
        public string? TransactionReferenceNumber { get; set; }
        public int PaymentMethodId { get; set; }
    }
    public class BankCollectionProcessWithDetail
    {
        public BankCollectionProcess BankCollection { get; set; }
        public List<InvoiceReceiptDetailCreate>? InvoiceReceiptDetails { get; set; }
    }

    public class ChequeCollectionUpload
    {
        [Required(ErrorMessage = "validation_error_chequeexcelupload_file_required")]
        public IFormFile ChequeCollectionFile { get; set; }
        public string TenantBankAccountId { get; set; }
    }

    public class BankCollectionCancelClaim
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "bankcollectioncancelclaim_validation_error_cancelreason_required")]
        public string CancelReason { get; set; }
    }

    public class BankCollectionDetail
    {
        public int Id { get; set; }
        public string? TransactionReferenceNumber { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TransactionAmount { get; set; }
        public DateTime? ChequeRealizedOn { get; set; }
        public DateTime? ChequeReturnedOn { get; set; }
        public string? ChequeReturnedReason { get; set; }
        public decimal TotalReceiptAmount { get; set; }
        public string ClaimedBy { get; set; }
        public string? CustomerName { get; set; }
        public string? PaymentMethodCode { get; set; }
        public string? PaymentMethodName { get; set; }
    }

    public class CollectionReceiptList
    {
        public int Id { get; set; }
        public int ReceiptId { get; set; }
        public string ReceiptNumber { get; set; }
        public decimal ReceiptAmount { get; set; }
    }

    public class  BankCollectionDetailWithReceiptList
    {
        public BankCollectionDetail BankCollectionDetail { get; set; }
        public List<CollectionReceiptList>? CollectionReceiptList { get; set; }
    }
}