namespace BeSureApi.Models
{
    public class CustomerApprovalDetail
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public string TableName { get; set; }
        public string Name { get; set; }
        public string NameOnPrint { get; set; }
        public string? CustomerGroup { get; set; }
        public string? CustomerIndustry { get; set; }
        public string Location { get; set; }
        public string BilledToAddress { get; set; }
        public string BilledToCity { get; set; }
        public string BilledToState { get; set; }
        public string BilledToCountry { get; set; }
        public string BilledToPincode { get; set; }
        public string? BilledToGstNumber { get; set; }
        public string ShippedToAddress { get; set; }
        public string ShippedToCity { get; set; }
        public string ShippedToState { get; set; }
        public string ShippedToCountry { get; set; }
        public string ShippedToPincode { get; set; }
        public string? ShippedToGstNumber { get; set; }
        public string PrimaryContactName { get; set; }
        public string PrimaryContactEmail { get; set; }
        public string PrimaryContactPhone { get; set; }
        public string SecondaryContactName { get; set; }
        public string SecondaryContactEmail { get; set; }
        public string SecondaryContactPhone { get; set; }
        public string PanNumber { get; set; }
        public string TinNumber { get; set; }
        public string TanNumber { get; set; }
        public string CinNumber { get; set; }
        public bool IsMsme { get; set; }
        public string MsmeRegistrationNumber { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedUserName { get; set; }
        public string FetchTime {  get; set; }
    }
    public class CustomerApprovalDetailWithReview
    {
        public CustomerApprovalDetail CustomerDetail { get; set; }
        public IEnumerable<ApprovalRequestReviewDetail> ApprovalRequestReviewList { get; set; }
    }

    public class CustomerPendingList
    {
        public int ApprovalRequestId { get; set; }
        public int ApprovalRequestDetailId { get; set; }
        public int CaseId { get; set; }
        public string EventCode { get; set; }
        public string EventName { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public string? ReviewStatus { get; set; }
        public string? ReviewStatusName { get; set; }
        public string? ReviewComment { get; set; }
        public string CreatedUserName { get; set; }
    }
}
