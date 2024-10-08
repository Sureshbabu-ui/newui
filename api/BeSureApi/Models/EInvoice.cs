namespace BeSureApi.Models
{
    public class EInvoiceList
    {
        public int Id { get; set; }
        public string Invoiceno { get; set; }
        public bool EISent { get; set; }
        public bool EISuccess { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class EInvoiceCreate
    {
        public string Business { get; set; }
        public string Invoiceno { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string Type { get; set; }
        public string SubType { get; set; }
        public decimal TaxableValue { get; set; }
        public decimal NETAmount { get; set; }
        public decimal SgstAmount { get; set; }
        public decimal CgstAmount { get; set; }
        public decimal IgstAmount { get; set; }
        public DateTime CollectionDueDate { get; set; }
        public int InvoiceStatus { get; set; }
        public int CreatedBy { get; set; }
        public string Location { get; set; }
        public string LocationState { get; set; }
        public string LocationStateCode { get; set; }
        public string LocationGSTIN { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress1 { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerState { get; set; }
        public int CustomerStateCode { get; set; }
        public string CustomerPincode { get; set; }
        public string CustomerGSTIN { get; set; }
        public string CustomerShipName { get; set; }
        public string CustomerShipAddress1 { get; set; }
        public string CustomerShipCity { get; set; }
        public string CustomerShipState { get; set; }
        public int CustomerShipStateCode { get; set; }
        public string CustomerShipPincode { get; set; }
        public string CustShipGSTIN { get; set; }
        public string BILLTOCODE { get; set; }
        public string SHIPTOCODE { get; set; }
        public string UniqueID { get; set; }
        public string RAISEDFROM { get; set; }
    }

    public class SalesRegisterReturnResponse
    {
        public string InvoiceNo { get; set; }
        public string? AckNo { get; set; }
        public DateTime? AckDate { get; set; }
        public Guid? UUID { get; set; }
        public DateTime? Create_Date { get; set; }
        public DateTime? CancelDate { get; set; }
        public string? IRN { get; set; }
        public string? SignedQRCode { get; set; }
        public string? SignedInvoice { get; set; }
        public string? SignedQrCodeImgUrl { get; set; }
        public bool QRImgSaved { get; set; }
        public string? QRImgName { get; set; }
        public string? ewb_number { get; set; }
        public DateTime? ewb_date { get; set; }
        public string? Status { get; set; }
        public DateTime? EwbValidTill { get; set; }
        public string? irn_status { get; set; }
        public string? ewb_status { get; set; }
        public string? irp { get; set; }
        public string? ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public Guid? HeaderUniqueID { get; set; }
        public DateTime? UpdatedDateTime { get; set; }
    }
}
