namespace BeSureApi.Models
{
    public class BankGuaranteeDetails
    {
        public int ContractId { get; set; }
        public int GuaranteeType { get; set; }
        public string GuaranteeNumber { get; set; }
        public int BankBranchInfoId { get; set; }
        public string GuaranteeStartDate { get; set; }
        public string GuaranteeEndDate { get; set; }
        public Decimal GuaranteeAmount { get; set; }
        public string Remarks { get; set; }
        public int GuaranteeClaimPeriodInDays { get; set; }
    }
    public class BankGuaranteeUpdateDetails
    {
        public int Id { get; set; }
        public int GuaranteeType { get; set; }
        public string GuaranteeNumber { get; set; }
        public int BankBranchInfoId { get; set; }
        public string GuaranteeStartDate { get; set; }
        public string GuaranteeEndDate { get; set; }
        public Decimal GuaranteeAmount { get; set; }
        public string Remarks { get; set; }
        public int GuaranteeClaimPeriodInDays { get; set; }
    }
    public class BankGuaranteeList
    {
        public int Id { get; set; }
        public int GuaranteeStatusId { get; set; }
        public string GuaranteeType { get; set; }
        public string GuaranteeStatus { get; set; }
        public string GuaranteeNumber { get; set; }
        public string BranchName { get; set; }
        public DateTime GuaranteeEndDate { get; set; }
        public Decimal GuaranteeAmount { get; set; }
        public string Remarks { get; set; }
        public int GuaranteeClaimPeriodInDays { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
