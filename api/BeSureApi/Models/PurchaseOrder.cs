namespace BeSureApi.Models
{
    public class PurchaseOrderCreate
    {
        public int DemandId { get; set; }
        public int TenantOfficeId { get; set; }
        public int PartId { get; set; }
        public int PartIndentRequestId { get; set; }
        public int VendorId { get; set; }
        public int? ShipToTenantOfficeInfoId { get; set; }
        public int? ShipToCustomerSiteId { get; set; }
        public int BillToTenantOfficeInfoId { get; set; }
        public string? Description { get; set; }
        public int? VendorBranchId { get; set; }
        public decimal CgstRate { get; set; }
        public decimal SgstRate { get; set; }
        public decimal IgstRate { get; set; }
        public int StockTypeId { get; set; }
        public decimal Price { get; set; }
    }

    public class ImprestPurchaseOrderCreate
    {
        public List<PartListData> PartList { get; set; }
        public int VendorId { get; set; }
        public int ShipToTenantOfficeInfoId { get; set; }
        public int BillToTenantOfficeInfoId { get; set; }
        public string? Description { get; set; }
        public int? VendorBranchId { get; set; }
    }

    public class BulkPurchaseOrderCreate
    {
        public List<DemandDetailList> PartList { get; set; }
        public int VendorId { get; set; }
        public int ShipToTenantOfficeInfoId { get; set; }
        public int BillToTenantOfficeInfoId { get; set; }
        public string? Description { get; set; }
        public int? VendorBranchId { get; set; }
    }

    public class PartListData
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int Quantity {  get; set; }
        public int StockTypeId  {  get; set; }
        public decimal Price {  get; set; }
        public decimal Sgst {  get; set; }
        public decimal Cgst {  get; set; }
        public decimal Igst {  get; set; }
    }
    public class DemandDetailList
    {
        public int PartId { get; set; }
        public int DemandId { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public int StockTypeId { get; set; }
        public decimal Price { get; set; }
        public decimal Sgst { get; set; }
        public decimal Cgst { get; set; }
        public decimal Igst { get; set; }
        public int PartIndentRequestId { get; set; }
    }

    public class PurchaseOrderList
    {
        public int Id { get; set; }
        public string PoNumber { get; set; }
        public DateTime PoDate { get; set; }
        public int VendorId { get; set; }
        public string Vendor {  get; set; }
        public string TenantOffice { get; set; }
    }
    public class PurchaseOrders
    {
        public int Id { get; set; }
        public string PoNumber { get; set; }
        public DateTime PoDate { get; set; }
        public int VendorId { get; set; }
        public string Vendor { get; set; }
        public string TenantOffice { get; set; }
        public string PoStatus { get; set; }
    }

    public class PurchaseOrderDetail
    {
        public int Id { get; set; }
        public string PoNumber { get; set; }
        public DateTime PoDate { get; set; }
        public string Vendor { get; set; }
        public string TenantOffice { get; set; }
        public string BillToTenantOffice { get; set; }
        public string BillToAddress { get; set; }
        public string ShipToTenantOffice { get; set; }
        public string ShipToAddress { get; set; }
        public string? IndentRequestNumber { get; set; }
        public string PoStatus { get; set; }
        public decimal Quantity { get; set; }
        public decimal GrnReceivedQuantity { get; set; }
        public decimal Price { get; set; }
        public string? PartName { get; set; }
        public decimal CgstRate { get; set; }
        public decimal IgstRate { get; set; }
        public decimal SgstRate { get; set; }
        public string PoPartType { get; set; }
    }
}
