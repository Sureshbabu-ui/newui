using BeSureApi.Models;

namespace BeSureApi.Models
{
    public class ImprestStock
    {
        public int ContractId {  get; set; }
        public int CustomerId {  get; set; }
        public int? CustomerSiteId {  get; set; }
        public int? ServiceEngineerId { get; set; }
        public int[] PartStockIdList {  get; set; }
        public string? Remarks {  get; set; }
        public string ReservedFrom {  get; set; }
        public string ReservedTo {  get; set; }
        public bool IsCustomerSite { get; set; }
        public string IsbyCourier { get; set;}
    }

    public class ImprestStockCreate
    {
        public ImprestStock impreststock { get; set; }
        public DeliveryChallan? deliverychallan { get; set; }
    }
}
