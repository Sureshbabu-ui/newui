namespace BeSureApi.Models
{
    public class GstRateUpdate
    {
        public int Id { get; set; }
        public string TenantServiceName { get; set; }
        public string ServiceAccountDescription { get; set; }
        public decimal Cgst { get; set; }
        public decimal Igst { get; set; }
        public decimal Sgst { get; set; }
        public bool IsActive { get; set; }
    }
}
