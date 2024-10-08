using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class ContractInvoiceDetailCreate
    {
        public int ContractInvoiceId { get; set; }
        public string ItemDescription { get; set; }
        public string ServicingAccountingCode { get; set; }
        public decimal Quantity { get; set; }
        public decimal Unit { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }
        public decimal? Discount { get; set; }
        public decimal Sgst { get; set; }
        public decimal Cgst { get; set; }
        public decimal Igst { get; set; }
        public decimal NetAmount { get; set; }
    }

    public class ContractInvoiceDetailList
    {
        public int Id { get; set; }
        public int ContractInvoiceId { get; set; }
        public string ItemDescription { get; set; }
        public string ServicingAccountingCode { get; set; }
        public decimal Quantity { get; set; }
        public decimal Unit { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }
        public decimal Discount { get; set; }
        public decimal Sgst { get; set; }
        public decimal Cgst { get; set; }
        public decimal Igst { get; set; }
        public decimal NetAmount { get; set; }
    }
}
