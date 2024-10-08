using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace BeSureApi.Models
{
    public class ReceiptList
    {
            public int Id { get; set; }
            public string ReceiptNumber { get; set; }
            public decimal ReceiptAmount { get; set; }
         public string? CustomerName { get; set; }
        public string? PaymentMethod { get; set; }
        public DateTime? ReceiptDate { get; set; }
        
                  
    }

    public class ReceiptDetail
    {
        public int Id { get; set; }
        public string ReceiptNumber { get; set; }
        public decimal ReceiptAmount { get; set; }

    }

    public class InvoiceReceiptDetailCreate
    {
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
    }

    public class ReceiptViewDetail
    {
        public int id { get; set; }
        public string ReceiptNumber { get; set; }
        public DateTime? ReceiptDate { get; set; }
        public string? CustomerName { get; set; }
        public string PaymentMethod { get; set; }
        public decimal? CollectedAmount { get; set; }
        public string? TransactionReferenceNumber { get; set; }
        public DateTime? ChequeDate { get; set; }
        public decimal? ChequeAmount { get; set; }
        public string? ChequePayeeName { get; set; }
        public string? ChequeBank { get; set; }
        public string? ChequeBranch { get; set; }
        public DateTime? ChequeReturnedOn { get; set; }
        public string? ChequeReturnedReason { get; set; }
        public DateTime? ChequeReceivedOn { get; set; }
        public string? TenantBankAccount { get; set; }
        public DateTime? ReceiptAmountRealisedOn { get; set; }
        public decimal ReceiptAmount { get; set; }
    }

    public class InvoiceReceiptList
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public string InvoiceNumber { get; set; }
        public decimal InvoiceAmount { get; set; }
        public decimal ReceiptAmount { get; set; }
    }

    public class ReceiptViewWithDetail
    {
        public ReceiptViewDetail Receipt { get; set; }
        public List<InvoiceReceiptList>? InvoiceReceiptList { get; set; }
    }
}
