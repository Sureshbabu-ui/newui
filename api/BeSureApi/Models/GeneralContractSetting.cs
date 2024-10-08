namespace BeSureApi.Models
{
    public class ContractApproverDetails
    {
        public int ApprovalFlowId { get; set; }
        public int TenantOfficeId { get; set; }
        public int FirstApproverId { get; set; }
        public int SecondApproverId { get; set; }
        public int RenewalFirstApproverId { get; set; }
        public int RenewalSecondApproverId { get; set; }
    }
    public class ContractApproverList
    {
        public int Id { get; set; }
        public int ApprovalFlowId { get; set; }
        public string AccelLocation { get; set; }
        public string FirstApprover { get; set; }
        public string SecondApprover { get; set; }
        public string RenewalFirstApprover { get; set; }
        public string RenewalSecondApprover { get; set; }
    }
}
