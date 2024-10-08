using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class Contract
    {
        public int Id { get; set; }
        public int TenantOfficeInfoId { get; set; }
        public string CustomerName { get; set; }
        public string BaseLocationName { get; set; }
        public string AgreementTypeName { get; set; }
        public string BookingTypeName { get; set; }
        public int BaseLocation { get; set; }
        public int AgreementType { get; set; }
        public int BookingType { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime BookingValueDate { get; set; }
        public string? QuotationReferenceNumber { get; set; }
        public string? PoNumber { get; set; }
        public DateTime PoDate { get; set; }
        public Decimal ContractValue { get; set; }
        public int ContractStatusId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndeDate { get; set; }
        public Boolean IsMultiSite { get; set; }
        public int ServiceMode { get; set; }
        public int PaymentMode { get; set; }
        public int PaymentFrequency { get; set; }
        public Boolean NeedPm { get; set; }
        public int PmFrequency { get; set; }
        public int SalesContactPerson { get; set; }
        public DateTime CallExpiryDate { get; set; }
        public DateTime CallStopDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string? CallStopReason { get; set; }
        public Boolean IsDeleted { get; set; }
    }

    public class ContractCreateDetails
    {
        [Required(ErrorMessage = "validation_error_contract_create_customer_name_required")]
        public int CustomerInfoId { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_accel_location_required")]
        public int AccelLocation { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_agreement_type_required")]
        public int AgreementTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_booking_type_required")]
        public int BookingType { get; set; }
        public DateTime? BookingDate { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_booking_value_date_required")]
        public DateTime BookingValueDate { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_contract_value_required")]
        public decimal ContractValue { get; set; }
        [Required(ErrorMessage = "validation_error_create_asset_amcvalue_required")]
        public decimal AmcValue { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_contract_value_required")]
        public decimal FmsValue { get; set; }
        public int? MarketingExecutive { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_start_date_required")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_end_date_required")]
        public DateTime EndDate { get; set; }
        public string? QuotationReferenceNumber { get; set; }
        public DateTime? QuotationReferenceDate { get; set; }
        public string? PoNumber { get; set; }
        public DateTime? PoDate { get; set; }
        public bool? IsMultiSite { get; set; }
        public bool? IsPAVNeeded { get; set; }
        public int? SiteCount { get; set; }
        public bool? IsPerformanceGuarentee { get; set; }
        public decimal? PerformanceGuaranteeAmount { get; set; }
        public bool? IsPreventiveMaintenanceNeeded { get; set; }
        public bool? IsStandByFullUnitRequired { get; set; }
        public bool? IsStandbyImpressStockRequired { get; set; }
        public bool? IsBackToBackAllowed { get; set; }
        public int? BackToBackScopeId { get; set; }
        public bool? IsSez { get; set; }
        public int? ServiceMode { get; set; }
        public int? PaymentMode { get; set; }
        public int? PaymentFrequency { get; set; }
        public int? CreditPeriod { get; set; }
        public int? ServiceWindow { get; set; }
        public int? PmFrequency { get; set; }
    }

    public class ContractInvoicePrerequisite
    {
        public int Id { get; set; }
        public string DocumentName  { get; set; }
        public string? Description  { get; set; }
    }
    public class ContractCreate
    {
        public ContractCreateDetails ContractDetails { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_po_details_not_empty")] 
        public List<ContractInvoicePrerequisite> ContractInvoicePrerequisite { get; set; }
    }
    public class ContractUpdateDetails
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_customer_name_required")]
        public int CustomerInfoId { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_accel_location_required")]
        public int AccelLocation { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_agreement_type_required")]
        public int AgreementTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_booking_type_required")]
        public int BookingTypeId { get; set; }
        public DateTime? BookingDate { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_booking_value_date_required")]
        public DateTime BookingValueDate { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_contract_value_required")]
        public decimal ContractValue { get; set; }
        public decimal AmcValue { get; set; }
        public decimal FmsValue { get; set; }
        public int? SalesContactPersonId { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_start_date_required")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_end_date_required")]
        public DateTime EndDate { get; set; }
        public string? QuotationReferenceNumber { get; set; }
        public DateTime? QuotationReferenceDate { get; set; }
        public string? PoNumber { get; set; }
        public DateTime? PoDate { get; set; }
        public bool? IsMultiSite { get; set; }
        public bool? IsPAVNeeded { get; set; }
        public int? SiteCount { get; set; }
        public bool? IsPerformanceGuaranteeRequired { get; set; }
        public decimal? PerformanceGuaranteeAmount { get; set; }
        public bool? IsPmRequired { get; set; }
        public bool? IsStandByFullUnitRequired { get; set; }
        public bool? IsStandByImprestStockRequired { get; set; }
        public bool? IsBackToBackAllowed { get; set; }
        public int? BackToBackScopeId { get; set; }
        public bool? IsSez { get; set; }
        public int? ServiceModeId { get; set; }
        public int? PaymentModeId { get; set; }
        public int? PaymentFrequencyId { get; set; }
        public int? CreditPeriod { get; set; }
        public int? ServiceWindowId { get; set; }
        public int? PmFrequencyId { get; set; }
    }
    public class ContractInvoicePrerequisiteUpdate
    {
        public int? Id { get; set; }
        public bool IsActive { get; set; }
        public int InvoicePrerequisiteId { get; set; }
        public string DocumentName { get; set; }
    }
    public class ContractUpdate
    {
        public ContractUpdateDetails ContractDetails { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_po_details_empty")]
        public List<ContractInvoicePrerequisiteUpdate> ContractInvoicePrerequisite { get; set; }
    }
    public class ContractsList
    {
            public int Id { get; set; }
            public int CreatedBy { get; set; }
            public string? ContractNumber { get; set; }
            public string CustomerName { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public decimal? ContractValue { get; set; }
            public string ContractStatus { get; set; }
    }

    public class ContractDetails
    {
        public int Id { get; set; }
        public int CustomerInfoId { get; set; }
        public int BaseLocation { get; set; }
        public int AgreementType { get; set; }
        public int BookingType { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime BookingValueDate { get; set; }
        public string? QuotationReferenceNumber { get; set; }
        public string? PoNumber { get; set; }
        public DateTime PoDate { get; set; }
        public Decimal PoValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndeDate { get; set; }
        public Boolean IsMultiSite { get; set; }
        public int ServiceMode { get; set; }
        public int PaymentMode { get; set; }
        public int PaymentFrequency { get; set; }
        public Boolean NeedPm { get; set; }
        public int PmFrequency { get; set; }
        public int SalesContactPerson { get; set; }
        public DateTime CallExpiryDate { get; }
        public DateTime CallStopDate { get; }
        public string? CallStopReason { get; set; }
        public Boolean IsDeleted { get; set; }
    }

    public class ContractRenewDetails
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_customer_name_required")]
        public int CustomerInfoId { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_accel_location_required")]
        public int AccelLocation { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_agreement_type_required")]
        public int AgreementTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_booking_type_required")]
        public int BookingTypeId { get; set; }
        public DateTime? BookingDate { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_booking_value_date_required")]
        public DateTime BookingValueDate { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_contract_value_required")]
        public decimal ContractValue { get; set; }
        public decimal AmcValue { get; set; }
        public decimal FmsValue { get; set; }
        public int? SalesContactPersonId { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_start_date_required")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_end_date_required")]
        public DateTime EndDate { get; set; }
        public string? QuotationReferenceNumber { get; set; }
        public DateTime? QuotationReferenceDate { get; set; }
        public string? PoNumber { get; set; }
        public DateTime? PoDate { get; set; }
        public bool? IsMultiSite { get; set; }
        public bool? IsPAVNeeded { get; set; }
        public int? SiteCount { get; set; }
        public bool? IsPerformanceGuaranteeRequired { get; set; }
        public decimal? PerformanceGuaranteeAmount { get; set; }
        public bool? IsPmRequired { get; set; }
        public bool? IsStandByFullUnitRequired { get; set; }
        public bool? IsStandByImprestStockRequired { get; set; }
        public bool? IsBackToBackAllowed { get; set; }
        public int? BackToBackScopeId { get; set; }
        public bool? IsSez { get; set; }
        public int? ServiceModeId { get; set; }
        public int? PaymentModeId { get; set; }
        public int? PaymentFrequencyId { get; set; }
        public int? CreditPeriod { get; set; }
        public int? ServiceWindowId { get; set; }
        public int? PmFrequencyId { get; set; }
    }
    public class ContractInvoicePrerequisiteRenew
    {
        public int? Id { get; set; }
        public bool IsActive { get; set; }
        public int InvoicePrerequisiteId { get; set; }
        public string DocumentName { get; set; }
    }
    public class ContractRenew
    {
        public ContractRenewDetails ContractDetails { get; set; }
        [Required(ErrorMessage = "validation_error_contract_create_po_details_not_empty")]
        public List<ContractInvoicePrerequisiteRenew> ContractInvoicePrerequisite { get; set; }
    }

    public class ContractsDetails
    {
        public int Id { get; set; }
        public string? ContractNumber { get; set; }
        public string BilledToAddress { get; set; }
        public string TenantOfficeName { get; set; }
        public string CustomerName { get; set; }
        public string? SalesContactPerson { get; set; }
        public string AgreementType { get; set; }
        public string AgreementTypeCode { get; set; }
        public decimal AmcValue{ get; set; }
        public decimal FmsValue { get; set; }
        public decimal ContractValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string BookingType { get; set; }
        public DateTime? BookingValueDate { get; set; }
        public DateTime? BookingDate { get; set; }
        public string? QuotationReferenceNumber { get; set; } 
        public DateTime? QuotationReferenceDate { get; set; }
        public string? PoNumber { get; set; }
        public DateTime? PoDate { get; set; }
        public bool? IsMultiSite { get; set; }
        public string? SiteCount { get; set; }
        public bool? IsPreAmcNeeded { get; set; }
        public bool? IsPerformanceGuaranteeRequired { get; set; }
        public int? PerformanceGuaranteeAmount { get; set; }
        public bool? IsSez { get; set; }
        public string? ServiceMode { get; set; }
        public string? PaymentMode { get; set; }
        public string? ServiceWindow { get; set; }
        public string? NeedPm { get; set; }
        public string? PmFrequency { get; set; }
        public bool? IsBackToBackAllowed { get; set; }
        public bool? IsStandByImprestStockRequired { get; set; }
        public string? BackToBackScope { get; set; }
	    public bool? IsStandByFullUnitRequired { get; set; }
        public int CustomerInfoId { get; set; }
        public string PaymentFrequency { get; set; }
        public string CreditPeriod { get; set; }
        public int ContractStatusId { get; set; }
        public DateTime? CallExpiryDate { get; set; }
        public DateTime? CallStopDate { get; set; }
        public string? CallStopReason { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedById { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public int AgreementTypeId { get; set; }
        public string CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        public string? FirstApprover { get; set; }
        public DateTime? FirstApprovedOn { get; set; }
        public int? FirstApproverId { get; set; }
        public string? SecondApprover { get; set; }
        public DateTime? SecondApprovedOn { get; set; }
        public int? SecondApproverId { get; set; }
        public string? ReviewComment { get; set; }
        public int TenantOfficeId { get; set; }
        public string ContractStatus { get; set; }
        public int? RenewContractId { get; set; }
        public string? ContractInvoicePrerequisite { get; set; }
        public string ContractStatusCode { get; set; }
    }
}