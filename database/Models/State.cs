using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class State
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2)]
        public string Code { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Name { get; set; }
        [ForeignKey("CountryId")]
        public int CountryId { get; set; }
        public Country? Country { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string GstStateName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string GstStateCode { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [DefaultValue((1))]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
