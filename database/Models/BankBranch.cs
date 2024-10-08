using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BeSureApi.Models;

namespace database.Models
{
    public class BankBranch
    {
        public int Id { get; set; }
        [ForeignKey("BankId")]
        public int BankId { get; set; }
        public Bank? Bank { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string BranchCode { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
    }
}