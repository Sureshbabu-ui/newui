using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace BeSureApi.PdfTemplates
{
    public class ServiceRequestSummaryPdfTemplate
    {
        public static void Create(IDocumentContainer container, ServiceRequestSummary callsummary,IEnumerable<PartIndentRequestList> partIndent)
        {
            _ = container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.MarginVertical(10);
                page.MarginHorizontal(25);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));
                page.Header()
                    .Text($"")
                    .SemiBold().FontSize(16).FontColor(Colors.Black);
                page.Content()
                .Border(1).BorderColor("#A9A9A9")
                    .Column(column =>
                    {
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3).PaddingVertical(8)
                          .Row(row =>
                          {
                              row.RelativeItem().Column(column =>
                              {
                                  column.Item().AlignCenter().Text("Call Status").FontSize(14).Bold();
                              });
                          });
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3)
                          .Row(row =>
                          {
                              row.RelativeItem().Column(column =>
                              {
                                  column.Item().Text("WORK ORDER NO DETAILS").FontSize(10).SemiBold();
                              });
                          });
                        column.Item()
                          .Row(row =>
                          {
                             row.RelativeItem().PaddingHorizontal(5).PaddingVertical(8).Table(table =>
                             {
                                 table.Header(header =>
                                 {
                                     header.Cell().Element(CellStyle).Text("Wono");
                                     header.Cell().Element(CellStyle).Text("Customer");
                                     header.Cell().Element(CellStyle).Text("CallType");
                                     header.Cell().Element(CellStyle).Text("ServiceContractNumber");

                                     static IContainer CellStyle(IContainer container)
                                     {
                                         return container.Border(1).BorderColor("#A9A9A9").DefaultTextStyle(x => x.SemiBold().FontSize(8)).Padding(2);
                                     }
                                 });

                                 table.ColumnsDefinition(columns =>
                                 {
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                 });

                                 table.Cell().Element(CellStyle).Text(callsummary.WorkOrderNumber);
                                 table.Cell().Element(CellStyle).Text(callsummary.CustomerName);
                                 table.Cell().Element(CellStyle).Text(callsummary.CallType);
                                 table.Cell().Element(CellStyle).Text(callsummary.ContractNumber);

                                 static IContainer CellStyle(IContainer container)
                                 {
                                     return container.Border(1).BorderColor("#A9A9A9").DefaultTextStyle(x => x.SemiBold().FontSize(8)).Padding(2);
                                 }
                             });
                          });
                    });
            });

        }
    }
}
