namespace BeSureApi.Models
{
    public class PartIndent
    {
        public class PartIndentList
        {
            public int Id { get; set; }
            public string IndentRequestNumber { get; set; }
            public string RequestedBy { get; set; }
            public string? Remarks { get; set; }
            public int CreatedRequestCount { get; set; }
            public int ApprovedRequestCount { get; set; }
            public int RejectedRequestCount { get; set; }
            public bool IsProcessed { get; set; }
            public DateTime CreatedOn { get; set; }
            public string Location { get; set;}
            public string CategoryName { get; set; }
        }

        public class PartIndentRequestDetail {
            public int PartId { get; set; }
            public string IndentRequestNumber { get; set; }
            public int TenantOfficeId { get; set; }
            public string Quantity { get; set; }
            public string WorkOrderNumber { get; set; }
        }
        public class SmeApproveDetails
        {
            public int Id { get; set; }
            public int ReviewedBy { get; set; }
            public string? ReviewerComments { get; set; }
            public string RequestStatus { get; set; }
            public int? PartId { get; set; }
            public string? IndentRequestNumber { get; set; }
            public int? TenantOfficeId { get; set; }
            public string? Quantity { get; set; }
            public string? WorkOrderNumber { get; set; }
            public int StockTypeId { get; set; }
        }

        public class PartIndentRequests
        {
            public int Id { get; set; }
            public int ExistsCount { get; set; }
            public string IndentRequestNumber { get; set; }
            public string RequestedBy { get; set; }
            public string? Remarks { get; set; }
            public int CreatedRequestCount { get; set; }
            public int ApprovedRequestCount { get; set; }
            public int RejectedRequestCount { get; set; }
            public bool IsProcessed { get; set; }
            public DateTime CreatedOn { get; set; }
            public int TenantOfficeId { get; set; }
            public string Location { get; set; }
        }
        public class PartIndentDetailsForSme
        {
            public int Id { get; set; }
            public string PartCode { get; set; }
            public string PartName { get; set; }
            public bool IsWarrantyReplacement { get; set; }
            public string StockType { get; set; }
            public string HsnCode { get; set; }
            public int Quantity { get; set; }
            public string PartCategoryName { get; set; }
            public string PartRequestStatus { get; set; }
            public string PartRequestStatusCode { get; set; }
            public string? CallcenterRemarks { get; set; }
            public string CustomerReportedIssue { get; set; }
            public string ProductSerialNumber { get; set; }
            public string Make { get; set; }
            public string CategoryName { get; set; }
            public string ModelName { get; set; }
            public int StockTypeId { get; set; }
            public string? ReviewerComments {  get; set; }
        }
        public class PartIndentRequestUpdate
        {
            public int Id { get; set; }
            public bool IsWarrantyReplacement { get; set; }
            public int StockTypeId { get; set; }
            public string PartCode { get; set; }
            public int Quantity { get; set; }
        }
    }
}