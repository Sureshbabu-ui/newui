using System;
using System.IO;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace BeSureApi.Services
{
    public class PdfService : IPdfService
    {
        public byte[] GeneratePdf(Action<IDocumentContainer> template)
        {
            if (template == null)
            {
                throw new ArgumentNullException(nameof(template), "The template parameter cannot be null.");
            }

            using (MemoryStream stream = new MemoryStream())
            {
                // Generate the PDF and write it to the stream
                Document.Create(container => template(container)).GeneratePdf(stream);

                // Set the position to the beginning of the stream
                stream.Seek(0, SeekOrigin.Begin);

                // Read the stream into a byte array
                return stream.ToArray();
            }
        }
    }
}