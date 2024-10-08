using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace BeSureApi.Models
{
    public class InvoiceReconciliationList
    {
        public int Id { get; set; }
        public decimal NetInvoiceAmount{ get; set; }
        public decimal CollectedAmount { get; set; }
        public decimal OutstandingAmount { get; set; }
        public decimal TdsDeductedAmount { get; set; }
        public decimal TdsPaidAmount { get; set; }
        public decimal GstTdsDeductedAmount { get; set; }
        public decimal GstTdsPaidAmount { get; set; }
        public decimal PenaltyAmount { get; set; }
        public decimal SecurityDepositAmount { get; set; }
        public decimal CustomerExpenseAmount { get; set; }
        public decimal OtherDeductionAmount { get; set; }
        public string? OtherDeductionRemarks { get; set; }
        public decimal WriteOffAmount { get; set; }
        public string? WriteOffAmountRemarks { get; set; }
        public int PrimaryAccountableId { get; set; }
        public int SecondaryAccountableId { get; set; }
        public string InvoiceNumber { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string CustomerName { get; set; }
    }

    public class InvoiceReconciliationTdsUpload
    {
        public IFormFile CollectionFile { get; set; }
    }
}