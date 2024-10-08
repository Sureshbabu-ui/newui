namespace database.Models
{
    public class LocationSetting
    {
        public int Id { get; set; }
        public int LocationId { get; set; }
        public int LastContractNumber { get; set; }
        public int LastSaleInvoiceNumber { get; set; }
        public int LastPaidJobInvoiceNumber { get; set; }
        public int LastWorkOrderNumber { get; set; }
        public int LastReceiptNumber { get; set; }
    }
}
