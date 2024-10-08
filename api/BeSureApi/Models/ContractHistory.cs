namespace BeSureApi.Models
{
    public class ContractHistory
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public string? ContractNumber { get; set; }
        public string CustomerName { get; set; }
        public string AccelLocation { get; set; }
        public string AgreementType { get; set; }
        public string BookingType { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime BookingValueDate { get; set; }
        public string? QuotationReferenceNumber { get; set; }
        public DateTime? QuotationReferenceDate { get; set; }
        public string? PoNumber { get; set; }
        public DateTime PoDate { get; set; }
        public Decimal ContractValue { get; set; }
        public Decimal AmcValue { get; set; }
        public Decimal FmsValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Boolean IsMultiSite { get; set; }
        public Boolean IsBackToBackAllowed { get; set; }
        public Boolean IsPmRequired { get; set; }
        public Boolean IsStandByFullUnitRequired { get; set; }
        public Boolean IsStandByImprestStockRequired { get; set; }
        public Boolean IsPreAmcNeeded { get; set; }
        public Boolean IsSez { get; set; }
        public Boolean IsPerformanceGuaranteeRequired { get; set; }
        public string ServiceMode { get; set; }
        public string PaymentMode { get; set; }
        public string PaymentFrequency { get; set; }
        public int SiteCount { get; set; }
        public decimal PerformanceGuaranteeAmount { get; set; }
        public string ServiceWindow { get; set; }
        public string BackToBackScope { get; set; }
        public Boolean NeedPm { get; set; }
        public string PmFrequency { get; set; }
        public string SalesContactPerson { get; set; }
        public DateTime? CallExpiryDate { get; }
        public DateTime? CallStopDate { get; }
        public string? CallStopReason { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime EffectiveFrom{ get; set; }
        public DateTime EffectiveTo { get; set; }
    }

    public class CurrentContract
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public string CustomerName { get; set; }
        public string BaseLocation { get; set; }
        public string AgreementType { get; set; }
        public string BookingType { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime BookingValueDate { get; set; }
        public string? QuotationReferenceNumber { get; set; }
        public string? PoNumber { get; set; }
        public DateTime PoDate { get; set; }
        public Decimal PoValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Boolean IsMultiSite { get; set; }
        public string ServiceMode { get; set; }
        public string PaymentMode { get; set; }
        public string PaymentFrequency { get; set; }
        public Boolean NeedPm { get; set; }
        public string PmFrequency { get; set; }
        public string SalesContactPerson { get; set; }
        public DateTime CallExpiryDate { get; }
        public DateTime CallStopDate { get; }
        public string? CallStopReason { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
