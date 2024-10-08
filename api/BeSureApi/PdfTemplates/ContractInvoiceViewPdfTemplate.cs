using System.Collections.Generic;
using System.Drawing;
using BeSureApi.Helpers;
using NumericWordsConversion;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace BeSureApi.PdfTemplates
{
    public class ContractInvoiceViewPdfTemplate
    {
        public static void Create(IDocumentContainer container, ContractInvoiceView contractInvoice, IEnumerable<ContractInvoiceDetailList> invoiceDetails)
        {
            _ = container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.MarginTop(3);
                page.MarginBottom(3);
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
                       column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3).PaddingTop(2).PaddingBottom(0)
                        .Row(row =>
                        {
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().Text("ORIGINAL FOR RECEPIENT").FontSize(13).Bold();
                                column.Item().AlignCenter().Text("TAX INVOICE").FontSize(13).Bold();
                            });
                        });
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3)
                        .Row(row =>
                        {
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().Text("IRN:").FontSize(10).SemiBold();
                                column.Item().AlignLeft().Text("Ack. No & Date :").FontSize(10).SemiBold();
                            });
                        });

                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3).Row(row =>
                        {
                            row.RelativeItem().PaddingTop(5).Column(innercolumn => {
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text("GSTIN: ");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {contractInvoice.GstNumber}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem(2).Element(CellStyle).Text("Name:");
                                    innerrow.RelativeItem(2).Element(CellStyle).Text($" {contractInvoice.TenantOfficeName}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem(2).Element(CellStyle).Text("Address:");
                                    innerrow.RelativeItem(2).Element(CellStyle).Text($" {contractInvoice.Address}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem(2).Element(CellStyle).Text("State: ");
                                    innerrow.RelativeItem(2).Element(CellStyle).Text($" {contractInvoice.StateName}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem(2).Element(CellStyle).Text("StateCode: ");
                                    innerrow.RelativeItem(2).Element(CellStyle).Text($"{contractInvoice.ShippedToGstNumber?.Substring(0, 2)}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem(2).Element(CellStyle).Text("Serial No.Of.Invoice: ");
                                    innerrow.RelativeItem(2).Element(CellStyle).Text($" {contractInvoice.InvoiceNumber}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem(2).Element(CellStyle).Text("Invoice Date: ");
                                    innerrow.RelativeItem(2).Element(CellStyle).Text($" {contractInvoice.InvoiceDueDate?.ToString("dd-MM-yyyy")}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem(2).Element(CellStyle).Text("Pan Number ");
                                    innerrow.RelativeItem(2).Element(CellStyle).Text($" {contractInvoice.PanNumber}");
                                });
                            });
                       
                            static IContainer CellStyle(IContainer container)
                            {
                                return container.DefaultTextStyle(x => x.FontSize(8)).PaddingVertical(0);
                            }
                            row.RelativeItem().Column(column => {
                                  byte[] imgdata = DownloadImage("https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg").Result;
                                column.Item().AlignCenter().Width(150).Padding(10).Image(imgdata).FitWidth();
                            });
                        });
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(2)
                        .Row(row =>
                        {
                            row
                            .RelativeItem().PaddingRight(10).Column(column =>
                            {
                                column.Item().PaddingVertical(2).Element(CellStyle).Text("Details of Receiver(Billed to)").Bold().FontSize(10);
                                column.Item().Element(CellStyle).Text($"Name: {contractInvoice.NameOnPrint}");
                                column.Item().Element(CellStyle).Text($"Address: {contractInvoice.BilledToAddress}");
                                column.Item().Element(CellStyle).Text($"{contractInvoice.BilledToCityName}");
                                column.Item().Element(CellStyle).Text($"State: {contractInvoice.BilledToStateName}");
                                column.Item().Element(CellStyle).Text($"StateCode: {contractInvoice.BilledToGstNumber?.Substring(0, 2)}");
                                column.Item().Element(CellStyle).Text($"GSTIN/UniqueID:  {contractInvoice.BilledToGstNumber}");
                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.DefaultTextStyle(x => x.FontSize(8)).PaddingVertical(0);
                                }
                            });

                            row.RelativeItem().Column(column =>
                            {
                                column.Item().PaddingVertical(2).Element(CellStyle).Text("Details of Consignee(Shipped to)").Bold().FontSize(10);
                                column.Item().Element(CellStyle).Text($"Name: {contractInvoice.NameOnPrint}");
                                column.Item().Element(CellStyle).Text($"Address: {contractInvoice.ShippedToAddress}");
                                column.Item().Element(CellStyle).Text($"{contractInvoice.ShippedToCityName}");
                                column.Item().Element(CellStyle).Text($"State: {contractInvoice.ShippedToStateName}");
                                column.Item().Element(CellStyle).Text($"StateCode: {contractInvoice.ShippedToGstNumber?.Substring(0, 2)}");
                                column.Item().Element(CellStyle).Text($"GSTIN/UniqueID:  {contractInvoice.ShippedToGstNumber}");
                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.DefaultTextStyle(x => x.FontSize(8)).PaddingVertical(0);
                                }
                            });
                        });

                        column.Item()
                      .Row(row =>
                      {
                          row.RelativeItem().PaddingHorizontal(5).PaddingVertical(4).Table(table =>
                          {
                              table.Header(header =>
                              {
                                  header.Cell().Element(CellStyle).Text("Agreement No");
                                  header.Cell().Element(CellStyle).Text("Agreement Date");
                                  header.Cell().Element(CellStyle).Text("Customer PoNo");
                                  header.Cell().Element(CellStyle).Text("Agreement Type");
                                  header.Cell().Element(CellStyle).Text("Agreement Period");
                                  header.Cell().Element(CellStyle).Text("Invoice Period");
                                  header.Cell().Element(CellStyle).Text("Payment Due On");
                                  header.Cell().Element(CellStyle).AlignRight().Text("Invoice Value");

                                  static IContainer CellStyle(IContainer container)
                                  {
                                      return container.Border(1).BorderColor("#A9A9A9").DefaultTextStyle(x => x.SemiBold().FontSize(8)).Padding(2);
                                  }
                              });

                              table.ColumnsDefinition(columns =>
                              {
                                  columns.ConstantColumn(84);
                                  columns.RelativeColumn();
                                  columns.RelativeColumn();
                                  columns.RelativeColumn();
                                  columns.RelativeColumn();
                                  columns.RelativeColumn();
                                  columns.RelativeColumn();
                                  columns.RelativeColumn();
                              });

                              table.Cell().Element(CellStyle).Text(contractInvoice.ContractNumber);
                              table.Cell().Element(CellStyle).Text(contractInvoice.BookingDate?.ToString("dd-MM-yyyy"));
                              table.Cell().Element(CellStyle).Text(contractInvoice.PoNumber);
                              table.Cell().Element(CellStyle).Text(contractInvoice.AgreementType);
                              table.Cell().Element(CellStyle).Text($"{contractInvoice.ContractStartDate?.ToString("dd-MM-yyyy")}- {contractInvoice.ContractEndDate?.ToString("dd-MM-yyyy")}");
                              table.Cell().Element(CellStyle).Text($"{contractInvoice.InvoiceStartDate?.ToString("dd-MM-yyyy")}- {contractInvoice.InvoiceEndDate?.ToString("dd-MM-yyyy")}");
                              table.Cell().Element(CellStyle).Text(contractInvoice.InvoiceDueDate?.ToString("dd-MM-yyyy"));
                              table.Cell().Element(CellStyle).AlignRight().Text($"{(contractInvoice.InvoiceAmount).ToString("N2")}");

                              static IContainer CellStyle(IContainer container)
                              {
                                  return container.Border(1).BorderColor("#A9A9A9").DefaultTextStyle(x => x.SemiBold().FontSize(8)).Padding(2);
                              }
                          });
                      });

                        column.Item().PaddingHorizontal(5).PaddingVertical(4).BorderBottom(1).BorderColor("#A9A9A9")
                    .Row(row =>
                    {
                        row.RelativeItem().BorderHorizontal(1).BorderColor("#A9A9A9").Table(table =>
                        {
                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).Text("Sr.No");
                                header.Cell().Element(CellStyle).Text("Description of\r\nGoods");
                                header.Cell().Element(CellStyle).Text("SAC");
                                header.Cell().Element(CellStyle).Text("Qty");
                                header.Cell().Element(CellStyle).Text("Unit");
                                header.Cell().Element(CellStyle).Text("Rate(per\r\nItem)");
                                header.Cell().Element(CellStyle).Text("Total");
                                header.Cell().Element(CellStyle).AlignRight().Text("Discount");
                                header.Cell().Element(CellStyle).AlignRight().Text("Taxable Value");
                                header.Cell().ColumnSpan(2).Element(CellStyle).AlignRight().Text("CGST");
                                header.Cell().ColumnSpan(2).Element(CellStyle).AlignRight().Text("SGST");
                                header.Cell().ColumnSpan(2).Element(CellStyle).AlignRight().Text("IGST");
                                header.Cell().ColumnSpan(9).BorderTop(1).BorderColor("#A9A9A9").Element(CellStyle).Text("");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Amount");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Rate");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Amount");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Rate");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Amount");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Rate");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.BorderVertical(1).BorderColor("#A9A9A9").PaddingLeft(1).DefaultTextStyle(x => x.SemiBold().FontSize(8));
                                }
                            });

                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(25);
                                columns.RelativeColumn();
                                columns.ConstantColumn(38);
                                columns.ConstantColumn(20);
                                columns.ConstantColumn(20);
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.ConstantColumn(35);
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.ConstantColumn(25);
                                columns.RelativeColumn();
                                columns.ConstantColumn(25);
                                columns.RelativeColumn();
                                columns.ConstantColumn(25);
                            });
                        
                            int slno = 1;
                            foreach (var detail in invoiceDetails)
                            {
                                table.Cell().Element(CellStyle).Text($"{slno}");
                                table.Cell().Element(CellStyle).Text(detail.ItemDescription);
                                table.Cell().Element(CellStyle).Text(detail.ServicingAccountingCode);
                                table.Cell().Element(CellStyle).Text($"{detail.Quantity}");
                                table.Cell().Element(CellStyle).Text($"{detail.Unit}");
                                table.Cell().Element(CellStyle).Text($"{detail.Rate.ToString("N2")}");
                                table.Cell().Element(CellStyle).Text($"{(detail.Amount).ToString("N2")}");
                                table.Cell().Element(CellStyle).Text($"{(detail.Discount).ToString("N2")}");
                                table.Cell().Element(CellStyle).Text($"{(detail.Amount - detail.Discount).ToString("N2")}");
                                table.Cell().Element(CellStyle).Text($"{((detail.Amount - detail.Discount) * detail.Cgst/100).ToString("N2")}");
                                table.Cell().Element(CellStyle).Text($"{detail.Cgst}");
                                table.Cell().Element(CellStyle).Text($"{((detail.Amount - detail.Discount) * detail.Sgst/100).ToString("N2")}");
                                table.Cell().Element(CellStyle).Text($"{detail.Sgst}");
                                table.Cell().Element(CellStyle).Text($"{((detail.Amount - detail.Discount) * detail.Igst/100).ToString("N2")}");
                                table.Cell().Element(CellStyle).Text($"{detail.Igst}");
                                slno++;
                            }
                            table.Cell().ColumnSpan(6).Element(CellStyle).AlignRight().Text("Total");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{contractInvoice.InvoiceAmount.ToString("N2")}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{contractInvoice.DeductionAmount.ToString("N2")}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{(contractInvoice.InvoiceAmount-contractInvoice.DeductionAmount).ToString("N2")}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{contractInvoice.Cgst.ToString("N2")}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{contractInvoice.Sgst.ToString("N2")}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"");
                            table.Cell().Element(CellStyle).AlignRight().Text($"{contractInvoice.Igst.ToString("N2")}");
                            table.Cell().Element(CellStyle).AlignRight().Text($"");

                            static IContainer CellStyle(IContainer container)
                                {
                                    return container.Border(1).BorderColor("#A9A9A9").PaddingLeft(1).DefaultTextStyle(x => x.SemiBold().FontSize(8)).Padding(1).AlignRight();
                                }
                        });
                    });

                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3).PaddingTop(3).PaddingBottom(2)
                    .Row(row =>
                    {
                        row.RelativeItem().Column(column =>
                        {
                            column.Item().Text(text =>
                            {
                                text.Span("Total Invoice Value(In Figure): ");
                                text.Span($" {(contractInvoice.InvoiceAmount - contractInvoice.DeductionAmount + contractInvoice.Cgst + contractInvoice.Sgst + contractInvoice.Igst).ToString("N2")}  (Round off)").Bold();
                            });
                            column.Item().Text($"Total Invoice Value(In Words):{FormatHelper.ConvertToRupees(contractInvoice.InvoiceAmount - contractInvoice.DeductionAmount + contractInvoice.Cgst + contractInvoice.Sgst + contractInvoice.Igst)}  (Round off)").FontSize(10);
                        });
                    });

                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3).PaddingTop(3).PaddingBottom(3)
                     .Row(row =>
                     {
                         row.RelativeItem().Column(column =>
                         {
                             column.Item().Text($"For {contractInvoice.TenantOfficeName}").FontSize(10);
                             column.Item().PaddingTop(5).Text("Authorised Signatory").FontSize(10);
                             column.Item().PaddingTop(1).AlignCenter().Text("System Generated Invoice. Signature is not required.").FontSize(8).Bold();
                         });
                     });

                    column.Item().PaddingVertical(3).BorderBottom(1).BorderColor("#A9A9A9")
                   .Row(row =>
                   {
                       row.RelativeItem().Padding(3).Column(column =>
                       {
                           column.Item().Text("Bank Details:").FontSize(10).Bold();
                           column.Item().Text($"Bank Name: {contractInvoice.BankName}").FontSize(10).Bold();
                           column.Item().Text($"Account No:  {contractInvoice.AccountNumber} || IFSC : {contractInvoice.Ifsc}").FontSize(10).Bold();
                           column.Item().Text($"Email: {contractInvoice.BankEmail}").FontSize(10).Bold();
                       });
                   });

                    column.Item().PaddingHorizontal(3).PaddingTop(0)
                   .Row(row =>
                   {
                       row.RelativeItem().Column(column =>
                       {
                           column.Item().Text("Input Tax credit is available on this copy.").FontSize(10).Bold();
                           column.Item().Text("“ E. & O. E ( Please turn overleaf for Terms and Conditions) “").FontSize(10).Bold();
                       });
                   });
              });
          
            });
        }
        private static async Task<byte[]> DownloadImage(string imageUrl)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("User-Agent", "Other");
                return await client.GetByteArrayAsync(new Uri(imageUrl));
            }
        }
    }
}    