using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class EventGroup
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string EventGroupName { get; set; }
        [DefaultValue(true)]
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}
