using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class StockBin
    {
        public class StockBinList
        {
            public int Id { get; set; }
            public string BinName { get; set; }
            public string BinCode { get; set; }
            public bool IsActive { get; set; }
        }

        public class StockBinCreate
        {
            [Required(ErrorMessage = "validation_error_api_stockbin_create_binname_required")]
            public string BinName { get; set; }
            [Required(ErrorMessage = "validation_error_api_stockbin_create_bincode_required")]
            public string BinCode { get; set; }
            public int IsActive { get; set; }
        }

        public class StockBinEdit
        {
            public int Id { get; set; }
            [Required(ErrorMessage = "validation_error_api_stockbin_create_binname_required")]
            public string BinName { get; set; }
            public int IsActive { get; set; }

        }
    }
}
