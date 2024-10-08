using System.Net;
using System.Xml.Linq;

namespace BeSureApi.Models
{
    public class DocumentNumFormatList
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public int NumberPadding { get; set; }
        public string DocumentNumberFormat { get; set; }
        public string DocumentType { get; set; }
        public int DocumentTypeId { get; set; }
    }

    public class DocumentNumFormat
    {
        public int NumberPadding { get; set; }
        public string Format { get; set; }
        public int DocumentTypeId { get; set; }
    }

    public class DocumentNumFormatEdit
    {
        public int Id { get; set; }
        public int NumberPadding { get; set; }
        public string Format { get; set; }
        public int DocumentTypeId { get; set; }
    }

}
