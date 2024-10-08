namespace BeSureApi.Models
{
    public class ManPowerCreate
    {
        public int ContractId { get; set; }
        public int CustomerSiteId { get; set; }
        public int MspLocationId { get; set; }
        public int DistanceToCustomerSite { get; set; }
        public int DistanceUnitId { get; set; }
        public int EngineerTypeId { get; set; }
        public int EngineerLevelId { get; set; }
        public int BudgetedCost { get; set; }
        public int EmployeeId { get; set; }
        public DateTime EmployeeReportedOn { get; set; }
        public int EmployeeBillingRate { get; set; }
    }

    public class ManPowerSummaryCreate
    {
        public int ContractId { get; set; }
        public int CustomerSiteId { get; set; }
        public int TenantOfficeInfoId { get; set; }
        public int EngineerTypeId { get; set; }
        public int EngineerLevelId { get; set; }
        public decimal EngineerMonthlyCost { get; set; }
        public decimal EngineerCount { get; set; }
        public decimal DurationInMonth { get; set; }
        public decimal CustomerAgreedAmount { get; set; }
        public string? Remarks { get; set; }
        public int CreatedBy { get; set; }
    }

    public class ManPowerSummaryList
    {
        public int Id { get; set; }
        public string CustomerSite { get; set; }
        public string TenantOffice { get; set; }
        public string EngineerType { get; set; }
        public string EngineerLevel { get; set; }
        public int EngineerMonthlyCost { get; set; }
        public int EngineerCount { get; set; }
        public int DurationInMonth { get; set; }
        public decimal BudgetedAmount { get; set; }
        public decimal CustomerAgreedAmount { get; set; }
        public decimal MarginAmount { get; set; }
        public string? Remarks { get; set; }
    }

    public class ManPowerList
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public string CustomerSiteName { get; set; }
        public string MspLocationName { get; set; }
        public int CustomerSiteId { get; set; }
        public int MspLocationId { get; set; }
        public int EmployeeId { get; set; }
        public int DistanceToCustomerSite { get; set; }
        public int DistanceUnitId { get; set; }
        public int EngineerTypeId { get; set; }
        public int EngineerLevelId { get; set; }
        public int BudgetedCost { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string EmployeeName { get; set; }
        public DateTime EmployeeReportedOn { get; set; }
        public int EmployeeBillingRate { get; set; }
        public DateTime EmployeeLastSiteWorkingDate { get; set; }
        public string CreatedUserName { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedOn { get; set; }
        public string ModifiedUserName { get; set; }
        public Boolean IsDeleted { get; set; }
    }

    public class ManPowerUpdate
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public int CustomerSiteId { get; set; }
        public int MspLocationId { get; set; }
        public int DistanceToCustomerSite { get; set; }
        public int DistanceUnitId { get; set; }
        public int EngineerTypeId { get; set; }
        public int EngineerLevelId { get; set; }
        public int BudgetedCost { get; set; }
        public int EmployeeId { get; set; }
        public int EmployeeBillingRate { get; set; }
    }

    public class ManPowerSummaryDetails
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public int CustomerSiteId { get; set; }
        public int TenantOfficeInfoId { get; set; }
        public int EngineerTypeId { get; set; }
        public int EngineerLevelId { get; set; }
        public decimal EngineerMonthlyCost { get; set; }
        public decimal EngineerCount { get; set; }
        public decimal DurationInMonth { get; set; }
        public decimal CustomerAgreedAmount { get; set; }
        public string? Remarks { get; set; }
    }

    public class ManPowerSummaryUpdate
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public int CustomerSiteId { get; set; }
        public int TenantOfficeInfoId { get; set; }
        public int EngineerTypeId { get; set; }
        public int EngineerLevelId { get; set; }
        public decimal EngineerMonthlyCost { get; set; }
        public decimal EngineerCount { get; set; }
        public decimal DurationInMonth { get; set; }
        public decimal CustomerAgreedAmount { get; set; }
        public string? Remarks { get; set; }
        public int ModifiedBy { get; set; }
    }
    public class IsAgreedAmountExceeded
    {
        public bool IsValueExceeded { get; set; }
    }
    public class IsSummaryAmountExceeded
    {
        public bool IsAmcValueExceeded { get; set; }
        public bool IsFmsValueExceeded { get; set; }

    }
}
