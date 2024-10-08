using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class ContractApprovalRequestDetails
    {
        public int ApproverId { get; set; }
        public string ApproverEmail { get; set; }
        public string ApproverName { get; set; }
        public int ContractId { get; set; }
        public string ColumnName { get; set; }
        public List<ReviewDetails>? ReviewDetails { get; set; }
    }
    public class ReviewDetails
    {
        public int? Id { get; set; }
        public string? ReviewComment { get; set; }
        public int? UserId { get; set; }
        public string? ReviewedBy { get; set; }
        public string? ReviewStatus { get; set; }
        public string? CreatedOn { get; set; }
    }
    public class ContractApprovalDetails
    {
        public int ContractId { get; set; }
        public string ColumnName { get; set; }
        public List<ReviewDetails> ReviewDetails { get; set; }
    }
    public class ContractRejectDetails
    {
        public int ContractId { get; set; }
        public List<ReviewDetails> ReviewDetails { get; set; }
    }
    public class ContractRequestChangeDetails
    {
        public int ContractId { get; set; }
        public List<ReviewDetails> ReviewDetails { get; set; }
    }
    public class ReviewedDetails
    {
        public bool IsMandatoryDetails { get; set; }
        public bool IsManpower { get; set; }
        public bool IsAssetSummary { get; set; }
        public bool IsContractDocuments { get; set; }
        public bool IsPaymentDetails { get; set; }
    }
    public class ContractEmailNotificationDetails
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public int? TenantOfficeId { get; set; }
        public string? NameOnPrint { get; set; }
        public string? ContractNumber { get; set; }
    }
}