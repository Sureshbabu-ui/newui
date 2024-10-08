using OfficeOpenXml;
using System.Drawing;

namespace BeSureApi.Services.ExcelService
{
    public class ExcelService : IExcelService
    {
        private readonly int ExcelFontSize = 12;
        private readonly string ExcelFontName = "Calibri";

        public byte[] GenerateExcelFile(Dictionary<string, string> headers, List<object[]> records)
        {
            using (var excelPackage = new ExcelPackage())
            {
                var worksheet = excelPackage.Workbook.Worksheets.Add("Data");
                worksheet.Cells.Style.Font.Name = ExcelFontName;
                worksheet.Cells.Style.Font.Size = ExcelFontSize;
                int headerIndex = 1;
                foreach (var header in headers)
                {
                    worksheet.Cells[1, headerIndex].Value = header.Value;
                    worksheet.Column(headerIndex).Width = GetStringWidth(header.Value);
                    headerIndex++;
                }
                int recordIndex = 2;
                foreach (var record in records)
                {
                    for (int i = 0; i < record.Length; i++)
                    {
                        worksheet.Cells[recordIndex, i + 1].Value = record[i];
                    }
                    recordIndex++;
                }
                using (var memoryStream = new MemoryStream())
                {
                    excelPackage.SaveAs(memoryStream);
                    return memoryStream.ToArray();
                }
            }
        }

        private double GetStringWidth(string text)
        {
            using (var graphics = Graphics.FromImage(new Bitmap(1, 1)))
            {
                var font = new Font(ExcelFontName, ExcelFontSize);
                var size = graphics.MeasureString(text,font);
                return size.Width/7;
            }
        }
    }
}
