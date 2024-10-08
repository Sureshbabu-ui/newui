using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class ApprovedBankDetails
    {
        public int Id { get; set; }
        public string BankCode { get; set; }
        public string BankName { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }

    }

    public class ApprovedBankDetailsWithModifiedDate
    {
        public int Id { get; set; }
        public string BankCode { get; set; }
        public string BankName { get; set; }
        public DateTime ApprovedOn { get; set; }
        public string ApprovedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }

    public class BankEdit
    {
        public int Id { get; set; }
        public string BankName { get; set; }
    }

    public class BankPendingDetail
    {
        public int ApprovalRequestId { get; set; }
        public int ApprovalRequestDetailId { get; set; }
        public int CaseId { get; set; }
        public string TableName { get; set; }
        public string BankName { get; set; }
        public string BankCode { get; set; }
        public string ReviewStatus { get; set; }
        public string ReviewStatusName { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedUserName { get; set; }
    }

    public class BankPendingDetailWithReview
    {
        public BankPendingDetail BankPendingDetail { get; set; }
        public IEnumerable<ApprovalRequestReviewDetail> ApprovalRequestReviewList { get; set; }
    }
}
