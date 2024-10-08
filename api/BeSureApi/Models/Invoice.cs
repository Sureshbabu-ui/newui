namespace BeSureApi.Models
{
    public class InvoiceScheduleList
    {
            public int Id { get; set; }
            public int ContractId { get; set; }
            public string ContractNumber { get; set; }
            public string CustomerName { get; set; }
            public string InvoiceNumber { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public DateTime ScheduledInvoiceDate { get; set; }
            public decimal ScheduledInvoiceAmount { get; set; }
            public decimal? NetInvoiceAmount { get; set; }
            public decimal? CollectedAmount { get; set; }
            public int ContractInvoiceId { get; set; }
            public bool IsInvoiceApproved { get; set; }
    }

    public class InvoiceCollectionDetail
    {
        public int Id { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal NetInvoiceAmount { get; set; }
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
        public string ContractNumber { get; set; }
    }

    public class ReceiptListForInvoice
    {
        public decimal MappedAmount { get; set; }
        public string ReceiptNumber { get; set; }
        public decimal InvoiceAmount { get; set; }
        public decimal ReceiptAmount { get; set; }
        public DateTime ReceiptDate { get; set; }
    }
    public class InvoiceCollectionViewWithReceipt
    {
        public InvoiceCollectionDetail InvoiceDetail { get; set; }
        public List<ReceiptListForInvoice>? InvoiceReceiptList { get; set; }
    }
}
