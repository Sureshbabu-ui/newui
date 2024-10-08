namespace BeSureApi.Models
{
    public class ContractInvoiceCreate
    {
        public int ContractId { get; set; }
        public int ContractInvoiceScheduleId { get; set; }
        public string Description { get; set; }
        public decimal InvoiceAmount { get; set; }
        public decimal? DeductionAmount { get; set; }
        public string? DeductionDescription { get; set; }
        public decimal Sgst { get; set; }
        public decimal Cgst { get; set; }
        public decimal Igst { get; set; }
        public DateTime CollectionDueDate { get; set; }
        public int InvoiceStatus { get; set; }
    }

    public class ContractInvoiceWithDetail
    {
        public ContractInvoiceCreate ContractInvoice{ get; set; }
        public List<ContractInvoiceDetailCreate> ContractInvoiceDetails { get; set; }
    }

    public class ContractInvoiceView
    {
        public int Id { get; set; }
        public string? ContractNumber { get; set; }
        public string? Address { get; set; }
        public string? StateName { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? GstNumber { get; set; }
        public string? PanNumber { get; set; }
        public string InvoicePendingReason { get; set; }
        public DateTime ScheduledInvoiceDate { get; set; }
        public string? BilledToAddress { get; set; }
        public string? BilledToCityName { get; set; }
        public string? BilledToStateName { get; set; }
        public string? BilledToCountryName { get; set; }
        public string? BilledToPincode { get; set; }
        public string? BilledToGstNumber { get; set; }
        public string? ShippedToAddress { get; set; }
        public string? ShippedToCityName { get; set; }
        public string? ShippedToStateName { get; set; }
        public string? ShippedToCountryName { get; set; }
        public string? ShippedToPincode { get; set; }
        public string? ShippedToGstNumber { get; set; }
        public string? NameOnPrint { get; set; }
        public DateTime? ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
        public DateTime? BookingDate { get; set; }
        public string? AgreementType { get; set; }
        public DateTime? InvoiceStartDate { get; set; }
        public DateTime? InvoiceEndDate { get; set; }
        public string? TenantOfficeName { get; set; }
        public DateTime? InvoiceDueDate { get; set; }
        public string? PoNumber { get; set; }
        public double InvoiceAmount { get; set; }
        public double DeductionAmount { get; set; }
        public double Sgst { get; set; }
        public double Cgst { get; set; }
        public double Igst { get; set; }
        public string? BankName { get; set; }
        public string? Ifsc { get; set; }
        public string? AccountNumber { get; set; }
        public string? BankEmail { get; set; }
        public string? AckNo { get; set; }
        public DateTime? AckDate { get; set; }
    }

    public class ContractInvoiceViewWithDetail
    {
        public ContractInvoiceView ContractInvoice { get; set; }
        public List<ContractInvoiceDetailList> ContractInvoiceDetails { get; set; }
    }

    public class ContractInvoicePendingReasonAdd
    {
        public int ContractInvoiceId { get; set; }
        public string InvoicePendingReason { get; set; }
    }

    public class ShareInvoiceDetailPdf
    {
        public int Id { get; set; }
        public string To { get; set; }
        public string[] Cc { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceDate{ get; set; }
        public string ContractNumber { get; set; }
        public string PrimaryContactName { get; set; }
    }
}
