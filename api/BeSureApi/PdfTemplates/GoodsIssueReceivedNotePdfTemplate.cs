using QuestPDF.Infrastructure;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using System.Data.Common;
using BeSureApi.Helpers;

namespace BeSureApi.PdfTemplates
{
    public class GoodsIssueReceivedNotePdfTemplate
    {
        public static void Create(IDocumentContainer container, GoodsIssueReceivedNote Gindetails, IEnumerable<GoodsIssueReceivedNotePartStockDetails> partstocks )
        {
            _ = container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.MarginVertical(5);
                page.MarginHorizontal(25);
                page.MarginBottom(300);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));
                page.Header().Text($"").Bold().FontSize(20).FontColor(Colors.Black);
                page.Content().Border(1).BorderColor("#000000")

                    .Column(column =>
                    {
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(2).PaddingVertical(8)
                         .Row(row =>
                         {
                             row.RelativeItem().Column(column =>
                             {
                                 column.Item().PaddingLeft(3).PaddingBottom(1).AlignLeft().Text($"ACCEL IT SERVICES (A Division of Accel Limited)").FontSize(10).Bold();
                             column.Item().PaddingLeft(3).AlignLeft().Text(Gindetails.TenantOfficeAddress).FontSize(8).FontColor(Colors.Black);
                                 column.Item().PaddingLeft(3).AlignLeft().Text($"State:{Gindetails.TenantState}").FontSize(8).FontColor(Colors.Black);
                                 column.Item().PaddingLeft(3).AlignLeft().Text($"StateCode:{Gindetails.TenantStateCode}").FontSize(8).FontColor(Colors.Black);
                                 column.Item().PaddingLeft(3).AlignLeft().Text($"GSTNO:{Gindetails.TenantGstNumber}").FontSize(8).FontColor(Colors.Black);
                             });
                             row.RelativeItem().Column(column =>
                             {
                                 
                             });
                         });
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(1).PaddingVertical(1).PaddingVertical(1)
                          .Row(row =>
                          {
                              row.RelativeItem().Column(column =>
                              {
                                  column.Item().AlignCenter().Text("GOODS ISSUE NOTE").FontSize(13).Bold();
                              });
                          });

                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3).PaddingBottom(2).PaddingVertical(7)
                        .Row(row =>
                        {
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().PaddingLeft(3).AlignLeft().Text($"To").FontSize(8).FontColor(Colors.Black);
                                column.Item().PaddingLeft(3).AlignLeft().Text(Gindetails.CustomerName).FontSize(10).Bold();
                                column.Item().PaddingLeft(3).AlignLeft().Text(Gindetails.CustomerSiteAddress).FontSize(8).FontColor(Colors.Black);
                                column.Item().PaddingLeft(3).AlignLeft().Text($"{Gindetails.CustomerSiteCity} - {Gindetails.CustomerSitePincode}").FontSize(8).FontColor(Colors.Black);
                                column.Item().PaddingLeft(3).AlignLeft().Text(Gindetails.CustomerSiteState).FontSize(8).FontColor(Colors.Black);
                                column.Item().PaddingLeft(3).AlignLeft().Text($"GSTNO:{Gindetails.BilledToGstNumber}").FontSize(8).FontColor(Colors.Black);
                                column.Item().PaddingLeft(3).AlignLeft().Text($"ContactPerson:{Gindetails.PrimaryContactName} - {Gindetails.PrimaryContactPhone}").FontSize(8).FontColor(Colors.Black);
                            });

                            row.RelativeItem().PaddingLeft(50).Column(column =>
                            {
                                column.Item().PaddingLeft(90).AlignLeft().Text($"").FontSize(8).FontColor(Colors.Black);
                                column.Item().PaddingLeft(90).AlignLeft().Text($"GIN No        : {Gindetails.GinNumber}").FontSize(8).FontColor(Colors.Black);
                                column.Item().PaddingLeft(90).AlignLeft().Text($"GIN Date    : {Gindetails.GinDate.ToString("dd-MM-yyyy")}").FontSize(8).FontColor(Colors.Black);
                                column.Item().PaddingLeft(90).AlignLeft().Text($"WoNo           : {Gindetails.WorkOrderNumber}").FontSize(8).FontColor(Colors.Black);
                                column.Item().PaddingLeft(90).AlignLeft().Text($"EngineerName  : {Gindetails.ServiceEngineer}").FontSize(8).FontColor(Colors.Black);
                            });
                        });

                        column.Item()
                            .Row(row =>
                            {
                                row.RelativeItem().PaddingHorizontal(1).PaddingVertical(1).Table(table =>
                                {
                                    table.Header(header =>
                                    {
                                        header.Cell().Element(CellStyle).Text("S.No.").FontSize(8);
                                        header.Cell().Element(CellStyle).Text("HSN Code").FontSize(8);
                                        header.Cell().Element(CellStyle).Text("Main Code").FontSize(8);
                                        header.Cell().Element(CellStyle).Text("Part Type").FontSize(8);
                                        header.Cell().Element(CellStyle).Text("Part Number").FontSize(8);
                                        header.Cell().Element(CellStyle).Text("Description").FontSize(8);
                                        header.Cell().Element(CellStyle).Text("Serial No").FontSize(8);
                                        header.Cell().Element(CellStyle).Text("Rate").FontSize(8);
                                        header.Cell().Element(CellStyle).Text("Qty").FontSize(8);
                                        header.Cell().Element(CellStyle).Text("Value (in Rs.)").FontSize(8);
                                        
                                        // Define CellStyle function without border for header cells
                                        static IContainer CellStyle(IContainer container)
                                        {
                                            return container.BorderBottom(1).BorderColor("#A9A9A9").PaddingVertical(4);
                                        }
                                    });

                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.ConstantColumn(20);
                                        columns.RelativeColumn(6);
                                        columns.RelativeColumn(6);
                                        columns.RelativeColumn(5);
                                        columns.RelativeColumn(8);
                                        columns.RelativeColumn(26);
                                        columns.RelativeColumn(6);
                                        columns.RelativeColumn(5);
                                        columns.RelativeColumn(3);
                                        columns.RelativeColumn(7);
                                    });

                                    int slno = 1;
                                    foreach (var detail in partstocks)
                                    {
                                        table.Cell().Element(CellStyle).Text($"{slno}").FontSize(7);
                                        table.Cell().Element(CellStyle).Text(detail.HsnCode).FontSize(7);
                                        table.Cell().Element(CellStyle).Text(detail.PartCode).FontSize(7);
                                        table.Cell().Element(CellStyle).Text(detail.StockType).FontSize(7);
                                        table.Cell().Element(CellStyle).Text(detail.OemPartNumber).FontSize(7);
                                        table.Cell().Element(CellStyle).Text(detail.Description).FontSize(7);
                                        table.Cell().Element(CellStyle).Text(detail.SerialNumber).FontSize(7);
                                        table.Cell().Element(CellStyle).Text(detail.Rate.ToString("N2")).FontSize(7);
                                        table.Cell().Element(CellStyle).Text(detail.IssuedQuantity).FontSize(7);
                                        table.Cell().Element(CellStyle).Text(detail.Rate.ToString("N2")).FontSize(7);
                                    }

                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.DefaultTextStyle(x => x.SemiBold().FontSize(8)).Padding(1);
                                    }
                                });
                            });
                        
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").PaddingVertical(2);
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").PaddingVertical(2)
                        .Row(row =>
                       {
                           row.RelativeItem().Column(column =>
                           {
                               decimal sumOfRates = partstocks.Sum(detail => detail.Rate);
                               // Display the sumOfRates within the column
                               column.Item().PaddingRight(30).AlignRight().Text($"Total:  {sumOfRates}").FontSize(7).FontColor(Colors.Black).Bold();
                           });
                       });


                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").PaddingTop(100).PaddingBottom(0).PaddingVertical(4)
                        .Row(row =>
                        {
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().PaddingLeft(3).AlignLeft().Text($"Warranty Declaration : These parts are against warranty / AMC replacement only and NOT FOR SALE.").FontSize(10).FontColor(Colors.Black);
                                column.Item().PaddingLeft(3).AlignLeft().Text($"Return Parts (Good / Defective) are the assets of ACCEL IT SERVICES (A Division of Accel Limited).").FontSize(10).FontColor(Colors.Black);
                            });
                        });
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3).PaddingVertical(4);

                        column.Item().PaddingBottom(2) // Adjusted padding here
                        .Row(row =>
                        {
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().PaddingLeft(3).AlignLeft().Text($"For ACCEL IT SERVICES (A Division of Accel Limited)").FontSize(8).FontColor(Colors.Black);
                            });

                            row.RelativeItem().Column(column =>
                            {
                                column.Item().PaddingLeft(3).AlignRight().Text($"Customer Acknowledgement").FontSize(8).FontColor(Colors.Black);
                            });
                        });

                        column.Item().PaddingTop(75).PaddingBottom(0)// Adjusted padding here
                       .Row(row =>
                       {
                           row.RelativeItem().Column(column =>
                           {
                               column.Item().PaddingLeft(3).AlignLeft().Text($"Authorised Signatory").FontSize(8).FontColor(Colors.Black);
                           });

                           row.RelativeItem().Column(column =>
                           {
                               column.Item().PaddingRight(3).AlignRight().Text($"Company seal & Signature").FontSize(8).FontColor(Colors.Black);
                           });
                       });

                    });
            });
        }
    }
}
