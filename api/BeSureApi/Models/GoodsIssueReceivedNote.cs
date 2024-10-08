namespace BeSureApi.Models
{
    public class GoodsIssueReceivedNote
    {
        public DateTime GinDate { get; set; }
		public string? GinNumber { get; set; }
		public string ServiceEngineer { get; set; }
        public string WorkOrderNumber { get; set; }
        public string TenantOfficeAddress { get; set; }
        public string TenantGstNumber { get; set; }
        public string TenantStateCode { get; set; }
        public string TenantState { get; set; }
        public string CustomerName { get; set; }
        public string PrimaryContactName { get; set; }
        public string PrimaryContactPhone { get; set; }
        public string BilledToGstNumber { get; set; }
        public string CustomerSiteName { get; set; }
        public string CustomerSiteAddress { get; set; }
        public string CustomerSitePincode { get; set; }
        public string CustomerSiteState { get; set; }
		public string CustomerSiteCity { get; set; }
    }
    public class GoodsIssueReceivedNotePartStockDetails
    {
        public string PartName { get; set; }
        public int IssuedQuantity { get; set; }
        public string StockType { get; set; }
        public string HsnCode { get; set; }
        public string OemPartNumber { get; set; }
        public string PartCode { get; set; }
        public string Description { get; set; }
        public decimal Rate { get; set; }
        public string SerialNumber { get; set; }
    }
}
