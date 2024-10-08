using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeSureApi.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(BankCode),IsUnique = true)]
    [Microsoft.EntityFrameworkCore.Index(nameof(BankName),IsUnique = true)]
    public class Bank
    {
        public int Id { get; set; }
        [Column(TypeName = "char")]
        [StringLength(6)]
        public string BankCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string BankName { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public bool? IsDeleted { get; set; } = false;
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
    }
}