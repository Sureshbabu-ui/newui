namespace BeSureApi.Models
{

    public class UserPendingList
    {
        public int Id { get; set; }
        public string TableName { get; set; }
        public string Content { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Designation { get; set; }
        public string Location { get; set; }
        public string Department { get; set; }
        public string UserCategory { get; set; }
    }
    public class UserPendingDetail
    {
        public DateTime FetchTime { get; set; }
        public int Id { get; set; }
        public int CaseId { get; set; }
        public string TableName { get; set; }
        public string FullName { get; set; }
        public string EmployeeCode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Content { get; set; }
        public string UserCategory { get; set; }
        public string Division { get; set; }
        public string Department { get; set; }
        public string EngagementType { get; set; }
        public string Gender { get; set; }
        public string Designation { get; set; }
        public string? UserGrade { get; set; }
        public string ReportingManager { get; set; }
        public string Location { get; set; }
        public string? ServiceEngineerType { get; set; }
        public string? ServiceEngineerLevel { get; set; }
        public string? ServiceEngineerCategory { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string CreatedUserName { get; set; }
        public string? UserRole { get; set; }
        public string DocumentUrl { get; set; }
        public string CustomerName { get; set; }
        public string ContractNumber { get; set; }
        public string CustomerSite { get; set; }
        public decimal? BudgetedAmount { get; set; }
        public decimal? CustomerAgreedAmount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set;}
        public string? EngineerPincode { get; set; }
        public string? EngineerGeolocation { get; set; }
        public string? EngineerAddress { get; set; }
    }

    public class UserPendingDetailWithReview
    {
        public UserPendingDetail UserPendingDetail { get; set; }
        public IEnumerable<ApprovalRequestReviewDetail> ApprovalRequestReviewList { get; set; }
    }

    public class UserApprovalDetail
    {
        public DateTime FetchTime { get; set; }
        public int Id { get; set; }
        public int CaseId { get; set; }
        public string TableName { get; set; }
        public string FullName { get; set; }
        public string EmployeeCode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Content { get; set; }
        public string UserCategory { get; set; }
        public string Division { get; set; }
        public string Department { get; set; }
        public string EngagementType { get; set; }
        public string Gender { get; set; }
        public string Designation { get; set; }
        public string? UserGrade { get; set; }
        public string ReportingManager { get; set; }
        public string Location { get; set; }
        public string? ServiceEngineerType { get; set; }
        public string? ServiceEngineerLevel { get; set; }
        public string? ServiceEngineerCategory { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string CreatedUserName { get; set; }
        public string? UserRole { get; set; }
        public string DocumentUrl { get; set; }
        public string CustomerName { get; set; }
        public string ContractNumber { get; set; }
        public string CustomerSite { get; set; }
        public decimal? BudgetedAmount { get; set; }
        public decimal? CustomerAgreedAmount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? EngineerPincode { get; set; }
        public string? EngineerGeolocation { get; set; }
        public string? EngineerAddress { get; set; }
        public DateTime? UserExpiryDate { get; set; }
    }

    public class UserApprovalDetailWithReview
    {
        public UserApprovalDetail UserDetail { get; set; }
        public IEnumerable<ApprovalRequestReviewDetail> ApprovalRequestReviewList { get; set; }
    }

}
