namespace BeSureApi.Models
{

    public class PartIndentRequestList
    {
        public int Id { get; set; }
        public string IndentRequestNumber { get; set; }
        public string RequestedBy { get; set; }
        public string? Remarks { get; set; }
        public int CreatedRequestCount { get; set; }
        public int ApprovedRequestCount { get; set; }
        public int RejectedRequestCount { get; set; }
        public int HeldRequestCount { get; set; }
        public bool IsProcessed { get; set; }
        public DateTime CreatedOn { get; set; }
        public string OfficeName { get; set; }
    }
    public class PartIndentCreateRequestDetail
    {
        public int Id { get; set; }
        public decimal Quantity { get; set; }
        public bool? IsWarrantyReplacement { get; set; }
        public int? StockTypeId { get; set; }
    }
    public class PartIndentRequestCreate
    {
        public List<PartIndentCreateRequestDetail> partInfoList { get; set; }
        public int ServiceRequestId { get; set; }
        public int? TenantOfficeId { get; set; }
        public int? RequestedBy { get; set; }
        public string? Remarks { get; set; }
    }
    public class PartIndentDetails
    {
        public int Id { get; set; }
        public string PartCode { get; set; }
        public string PartName { get; set; }
        public string ProductCategoryName { get; set; }
        public string PartCategoryName { get; set; }
        public string MakeName { get; set; }
        public string HsnCode { get; set; }
        public string OemPartNumber { get; set; }
        public string? Remarks { get; set; }
        public int Quantity { get; set; }
        public string PartRequestStatus { get; set; }
        public string PartRequestStatusCode { get; set; } 
        public string? StockType { get; set; }
        public string? IsWarrantyReplacement { get; set; }
        public DateTime? AllocatedOn { get; set; }
        public string? GinNumber { get; set; }
        public int? GIRNId { get; set; }
        public DateTime? ReceivedOn { get; set; }
    }
    public class RequestableDetails
    {
        public bool IsComprehensive { get; set; }
        public bool IsUnderWarranty { get; set; }
        public bool IsRequestClosed { get; set; } 
        public string WorkOrderNumber { get; set; }
    }
    public class PartIndentDetailsDemandNote
    {
        public int PartId { get; set; }
        public int Quantity { get; set; }
    }
    public class SmeApprovedPartIndentDetails
    {
        public int Id { get; set; }
        public int PartId { get; set; }
        public string PartCode { get; set; }
        public string PartName { get; set; }
        public string ProductCategoryName { get; set; }
        public string PartCategoryName { get; set; }
        public string MakeName { get; set; }
        public string HsnCode { get; set; }
        public string OemPartNumber { get; set; }
        public string? Remarks { get; set; }
        public int Quantity { get; set; }
        public string PartRequestStatus { get; set; }
        public string PartRequestStatusCode { get; set; }
    }
}