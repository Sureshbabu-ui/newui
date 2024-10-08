using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class GrnTransactionType
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string TransactionTypeCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string TransactionType { get; set; }
    }
}
