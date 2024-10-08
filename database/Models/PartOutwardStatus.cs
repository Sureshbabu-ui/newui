using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class PartOutwardStatus
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string PartOutwardStatusCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Name { get; set; }
    }
}
