using QuestPDF.Infrastructure;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using System.Data.Common;
using BeSureApi.Helpers;

namespace BeSureApi.PdfTemplates
{
    public class PurchaseOrderPdfTemplate
    {
        public static void Create(IDocumentContainer container)
        {
            _ = container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.MarginVertical(40);
                page.MarginHorizontal(35);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(7));

                static IContainer CellStyle(IContainer container)
                {
                    return container.DefaultTextStyle(x => x.FontSize(8)).PaddingVertical(0);
                }

                page.Content()
                    .Column(column =>
                    {
                        column.Item().BorderBottom(1).BorderColor("#A9A9A9").Padding(3).PaddingVertical(8)
                       .Row(row =>
                       {
                           row.RelativeItem().Column(column =>
                           {
                             
                               column.Item().AlignCenter().Text("PURCHASE ORDER").FontSize(14).Bold();
                           });
                       });
                        column.Item().Padding(3).PaddingBottom(10).Row(row =>
                        {
                            row.RelativeItem().PaddingTop(5).Column(innercolumn =>
                            {
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text(" Purchase Order No:MAS/22/P00156     ");
                                    innerrow.RelativeItem().AlignRight().Element(CellStyle).Text(" Dated : 18 May 2022 17:16:27");
                                });

                            });
                        });

                        column.Item().PaddingLeft(3).AlignLeft().Text($"Status: Approved").FontSize(7).FontColor(Colors.Black);
                        column.Item().PaddingLeft(3).AlignLeft().Text($"Approved By: KISAN R MAGAR").FontSize(7).FontColor(Colors.Black);
                        column.Item().PaddingLeft(3).AlignLeft().Text($"Approved Date: 18 May 2022 17:16:27").FontSize(7).FontColor(Colors.Black);

                        column.Item()
                           .Row(row =>
                           {
                               row.RelativeItem().PaddingHorizontal(3).PaddingVertical(8).Table(table =>
                               {
                                   table.Header(header =>
                                   {
                                       header.Cell().Element(CellStyle).AlignCenter().Text("Vendor:");
                                       header.Cell().Element(CellStyle).AlignCenter().Text("Bill To");
                                       header.Cell().Element(CellStyle).AlignCenter().Text("Ship To");
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
                                   });
                                   table.Cell().Element(CellStyle).Text("SHREYA IT SOLUTIONS");
                                   table.Cell().Element(CellStyle).Text("ACCEL IT SERVICES (A Division of Accel Limited)");
                                   table.Cell().Element(CellStyle).Text("ACCEL IT SERVICES (A Division of Accel Limited)");
                                   table.Cell().Element(CellStyle).Text("F-8A,+STREET NO. 3");
                                   table.Cell().Element(CellStyle).Text("I Floor, SFI Complex");
                                   table.Cell().Element(CellStyle).Text("SHREYA IT SOLUTIONS");
                                   table.Cell().Element(CellStyle).Text("ACCEL IT SERVICES (A Division of Accel Limited)");
                                   table.Cell().Element(CellStyle).Text("ACCEL IT SERVICES (A Division of Accel Limited)");
                                   table.Cell().Element(CellStyle).Text("F-8A,+STREET NO. 3");
                                   table.Cell().Element(CellStyle).Text("I Floor, SFI Complex");
                                   table.Cell().Element(CellStyle).Text("SHREYA IT SOLUTIONS");
                                   table.Cell().Element(CellStyle).Text("ACCEL IT SERVICES (A Division of Accel Limited)");
                                   table.Cell().Element(CellStyle).Text("ACCEL IT SERVICES (A Division of Accel Limited)");
                                   table.Cell().Element(CellStyle).Text("F-8A,+STREET NO. 3");
                                   table.Cell().Element(CellStyle).Text("I Floor, SFI Complex");

                                   static IContainer CellStyle(IContainer container)
                                   {
                                       return container.Border(1).BorderColor("#A9A9A9").DefaultTextStyle(x => x.FontSize(6)).Padding(1);
                                   }
                               });
                           });

                        column.Item().PaddingHorizontal(3).PaddingVertical(4).BorderBottom(1).BorderColor("#A9A9A9")
                    .Row(row =>
                    {
                        row.RelativeItem().BorderHorizontal(1).BorderColor("#A9A9A9").Table(table =>
                        {
                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).AlignCenter().Text("Sr.\r\nNo");
                                header.Cell().ColumnSpan(2).Element(CellStyle).AlignCenter().Text("HSN");
                                header.Cell().ColumnSpan(2).Element(CellStyle).AlignCenter().Text("Main\r\nCode");
                                header.Cell().ColumnSpan(4).Element(CellStyle).AlignCenter().Text("Description");
                                header.Cell().ColumnSpan(2).Element(CellStyle).AlignCenter().Text("Part\r\nType");
                                header.Cell().Element(CellStyle).AlignCenter().Text("Exchangable");
                                header.Cell().Element(CellStyle).AlignCenter().Text("Warrnanty");
                                header.Cell().Element(CellStyle).AlignRight().Text("Qty");
                                header.Cell().Element(CellStyle).AlignRight().Text(" Price");
                                header.Cell().ColumnSpan(2).Element(CellStyle).AlignRight().Text("SGST");
                                header.Cell().ColumnSpan(2).Element(CellStyle).AlignRight().Text("CGST ");
                                header.Cell().ColumnSpan(2).Element(CellStyle).AlignRight().Text("IGST");
                                header.Cell().Element(CellStyle).AlignRight().Text("Total\r\nTax[%]");
                                header.Cell().Element(CellStyle).AlignRight().Text("Total");
                                header.Cell().Element(CellStyle).AlignRight().Text("Total");
                                header.Cell().ColumnSpan(2).Element(CellStyle).BorderBottom(1).Text("Remarks");
                                header.Cell().ColumnSpan(16).BorderTop(1).BorderColor("#A9A9A9").Element(CellStyle).Text("");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("%");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Tax\r\nValue");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("%");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Tax\r\nValue");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("%");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Tax\r\nValue");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("%");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("Tax\r\nValue");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("");
                                header.Cell().Element(CellStyle).BorderTop(1).BorderColor("#A9A9A9").Text("");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.BorderVertical(1).BorderColor("#A9A9A9").PaddingLeft(1).DefaultTextStyle(x => x.SemiBold().FontSize(6));
                                }
                            });

                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            {
                                table.Cell().Element(CellStyle).Text("1");
                                table.Cell().ColumnSpan(2).Element(CellStyle).Text("844399");
                                table.Cell().ColumnSpan(2).Element(CellStyle).Text("R08H05042");
                                table.Cell().ColumnSpan(4).Element(CellStyle).Text("SCANNER-CANON-CCD-CCD ASSY-SCANLIDE110--#QK1-6960");
                                table.Cell().ColumnSpan(2).Element(CellStyle).Text("REFURBISHED");
                                table.Cell().Element(CellStyle).Text("N");
                                table.Cell().Element(CellStyle).Text("1-Month");
                                table.Cell().Element(CellStyle).Text("1");
                                table.Cell().Element(CellStyle).Text("1900");
                                table.Cell().Element(CellStyle).Text("0");
                                table.Cell().Element(CellStyle).Text("0");
                                table.Cell().Element(CellStyle).Text("0");
                                table.Cell().Element(CellStyle).Text("0");
                                table.Cell().Element(CellStyle).Text("18");
                                table.Cell().Element(CellStyle).Text("342");
                                table.Cell().Element(CellStyle).Text("18");
                                table.Cell().Element(CellStyle).Text("342");
                                table.Cell().Element(CellStyle).Text("2242");
                                table.Cell().ColumnSpan(2).Element(CellStyle).Text("AMC/CC/23/07826");
                            }
                            table.Cell().ColumnSpan(24).Element(CellStyle).AlignRight().Text("Total");
                            table.Cell().ColumnSpan(2).Element(CellStyle).AlignRight().Text($"2242");
                          
                            static IContainer CellStyle(IContainer container)
                            {
                                return container.Border(1).BorderColor("#A9A9A9").PaddingLeft(1).DefaultTextStyle(x => x.FontSize(5)).AlignCenter();
                            }
                        });
                    });
                        column.Item().BorderColor("#A9A9A9").Padding(3)
                       .Row(row =>
                       {
                           row
                           .RelativeItem().PaddingRight(10).Column(column =>
                           {
                               column.Item().Element(CellStyle).Text($"Payment Terms : Credit - 45 Days");
                               column.Item().Element(CellStyle).Text($"Delivery Date: 07/02/2024");
                               column.Item().Element(CellStyle).Text($"Payment Mode:Credit");
                               column.Item().Element(CellStyle).Text($"Remarks: ");
                             
                               static IContainer CellStyle(IContainer container)
                               {
                                   return container.DefaultTextStyle(x => x.FontSize(8)).PaddingVertical(0);
                               }
                           });

                           row.RelativeItem().Column(column =>
                           {
                               column.Item().Element(CellStyle).Text($"Freight:");
                               column.Item().Element(CellStyle).Text($"Delivery Terms: Immediate");
                               column.Item().Element(CellStyle).Text($"Shipment:By Air");
                             
                               static IContainer CellStyle(IContainer container)
                               {
                                   return container.DefaultTextStyle(x => x.FontSize(8)).PaddingVertical(0);
                               }
                           });
                       });

                        column.Item().Border(1).BorderColor("#A9A9A9").Padding(3).PaddingTop(8).PaddingBottom(5)
                 .Row(row =>
                 {
                     row.RelativeItem().Column(column =>
                     {
                         column.Item().PaddingBottom(5).Text(text =>
                         {
                             text.Span("Terms and conditions ").SemiBold().FontSize(7);
                         });
                         column.Item().Text($"1. This Purchase Order is an Offer by Accel IT Services, a division of Accel Limited (Company) to the Supplier listed on the accompanying Purchase Order and Supplier acceptance is limited to its provisions withoutadditions, deletions, or other modifications. Company will not be responsible for goods delivered without issuance of its standard Purchaser Order duly signed by the Authorized Official of the Company.\r\n2. No physical signature is required in case of electronic copy generated through system.\r\n3. Goods shall be accompanied by delivery challan in triplicate and duplicate copy of Invoice, in the name and delivery address provided in P.O, Failure to comply of the above, the penalty to be imposed by the Company tothe Supplier at its discretion.\r\n4. All risk of loss shall remain with Supplier until goods and services have actually been received and accepted by Buyer at the applicable destination according to the terms and conditions of this Purchase Order.\r\n5. Price is inclusive of applicable taxes, freight, all packing, handling, transportation and insurance unless explicitly indicated on the face of this Purchase Order or agreed to in writing by Company.\r\n6. Supplier shall issue a separate Invoice and the same should include (i) the Purchase Order Number and (ii) Quantities accompanied.\r\n7. The Undisputed amounts shall be paid within 45 days of receipt and acceptance of goods and a correct Invoice. Delays in receipt of goods, acceptance of goods, or a correct Invoice will be just cause for Company towithhold payment and shall be computed as commencing with receipt of the Invoice or goods, whichever is later.\r\n8. The Invoice should disclose the advance amount received from the Company by providing details of payment including the cheque no., Bank, date etc.\r\n9. The Goods ordered must be delivered no later than the delivery date specified.\r\n10. If Supplier repudiates this PO or fails to make delivery within the time specified herein, or if Company rightfully rejects the goods, then with respect to any and all goods, Company with a liberty to cancel this PO in wholeor in part. In addition to recovering so much of the price as has been paid, and Company may have damages to as to all goods affected whether or not they have been identified to this PO. Company in good faith andwithout unreasonable delay, any reasonable purchase of goods in substitution for those due from Supplier. Company shall recover from Supplier as damages the difference between the cost of cover and the contract pricetogether with any incidental or consequential damages.\r\n11. The Company reserves the right to cancel the P.O. or amend the quantities indicated in the P.O. arising out of any change in Company's sales or purchase requirements, from any cause or causes beyond theCompany's control.\r\n12. Transit insurance will be covered by Supplier for all risks up to delivery centre and insurance charges will be to the Supplier's account unless otherwise specified.\r\n13. Company’s liability to pay any amount to Supplier for any reason shall not exceed the amount Company has agreed to pay Supplier for the goods. Company shall not be liable to Supplier for any consequential,incidental or special damages or commercial losses arising from the purchase of goods regardless of the cause of action or the form of the claim for damages, and even if Company is informed of the possibility of suchdamages.\r\n14. Supplier shall not assign this Purchase Order or any rights, nor delegate any duties to any third party. Any attempt to do so will be void. This Purchase Order shall inure to the benefit of the parties hereto and theirrespective successors and permitted assign. Each party is an independent contractor of the other party.\r\n15. Company’s all confidential and proprietary information shall remain the property of the Company, carefully preserved and maintained by Supplier at its expense, and promptly returned to the Company or satisfactorilyaccounted for upon completion of this Purchase Order or upon Company’s written demand.\r\n16. Failure to Company to take the goods due to any force majeure conditions, beyond Company’s reasonable control, or if occasioned by partial or complete suspension of operations at any of Company’s office or otherlocations, shall not subject Company to any liability to Supplier by reason thereof.\r\n17. The Supplier shall be responsible to pay all extra expenses or any loss arising on account of improper packing, packing material used for supplies are on non-returnable basis unless otherwise agreed to by Company inwriting.\r\n18. The Supplier is liable to accept DOA/Wrong/Transit Damage supply Materials after supplies and within the warranty period and additional two-week’s time extension applicable for DOA/Wrong/Transit Damage suppliedMaterials as per P.O.\r\n19. Part Returnable policy applicable for non-used or non-consumed Materials for both within warranty and out of warranty supplies in the substance of business relationships, criteria will be applicable NIL Warranty/1-2-3Months, 6 Months, 1 Year and beyond Warranty Materials.\r\n20. A waiver of any term, condition or default of this Purchase Order shall not be construed as a waiver of any of other term, condition, or default.\r\n21. The Purchase Order represents the entire understanding between Company and Supplier, shall supersede all prior understandings and agreements relating to the subject matter hereof, and may be amended only bywritten mutual agreements of the parties. In the event of a conflict between the terms and conditions of this Purchase Order and any amendments thereto, the Purchase Order shall govern and control.\r\n22. This Purchase Order shall be governed by and interpreted in accordance with the Laws of India and will have the exclusive Jurisdiction at Chennai City only.").FontSize(6);
                     });
                 });
                    });             
            });
        }
    }
}