using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class LocationSettingDetails
    {
        public int Id { get; set; }
        public int LocationId { get; set; }
        public int LastContractNumber { get; set; }
        public int LastSaleInvoiceNumber { get; set; }
        public int LastAmcInvoiceNumber { get; set; }
        public int LastPaidJobInvoiceNumber { get; set; }
        public int LastWorkOrderNumber { get; set; }
        public int LastReceiptNumber { get; set; }
    }

    public class LocationSettingCreate
    {
        [Required(ErrorMessage = "Location is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Location is required")] 
        public int Id { get; set; }
        [Required(ErrorMessage = "Location is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Location is required")]
        public int LocationId { get; set; }
        [Required(ErrorMessage = "LastContractNumber is required")]
        [Range(0, int.MaxValue, ErrorMessage = "LastContractNumberis required")]
        public int LastContractNumber { get; set; }
        [Required(ErrorMessage = " LastSaleInvoiceNumber is required")]
        [Range(0, int.MaxValue, ErrorMessage = " LastSaleInvoiceNumber is required")]
        public int LastSaleInvoiceNumber { get; set; }
        [Required(ErrorMessage = "LastAmcInvoiceNumber is required")]
        [Range(0, int.MaxValue, ErrorMessage = "LastAmcInvoiceNumber is required")]
        public int LastAmcInvoiceNumber { get; set; }
        [Required(ErrorMessage = "LastPaidJobInvoiceNumber is required")]
        [Range(0, int.MaxValue, ErrorMessage = "LastPaidJobInvoiceNumber is required")]
        public int LastPaidJobInvoiceNumber { get; set; }
        [Required(ErrorMessage = "LastWorkOrderNumber  is required")]
        [Range(0, int.MaxValue, ErrorMessage = "LastWorkOrderNumber  is required")]
        public int LastWorkOrderNumber { get; set; }
        [Required(ErrorMessage = "LastReceiptNumber is required")]
        [Range(0, int.MaxValue, ErrorMessage = "astReceiptNumber is required")]
        public int LastReceiptNumber { get; set; }
    }
}
