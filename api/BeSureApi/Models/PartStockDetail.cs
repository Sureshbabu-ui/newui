namespace BeSureApi.Models
{
    public class PartStockDetailList
    {
        public int Id { get; set; }
        public string PartCode { get; set; }
        public string PartName { get; set; }
        public string? SerialNumber  { get; set; }
        public decimal Rate { get; set; }
        public string? Sku  { get; set; }
        public string? OfficeName  { get; set; }
        public string BinName { get; set; }
        public string  RoomName{ get; set; }
        public string? PartWarrantyExpiryDate { get; set; }
    }
}
