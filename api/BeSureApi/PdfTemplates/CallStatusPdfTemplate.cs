﻿using QuestPDF.Infrastructure;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using System.Data.Common;
using BeSureApi.Helpers;

namespace BeSureApi.PdfTemplates
{
    public class CallStatusPdfTemplate
    {
        public static void Create(IDocumentContainer container, CallStatusDetails callDetail, IEnumerable<CallStatusPartIndentRequestDetails> partIndentRequest, IEnumerable<CallStatusPartAllocationDetails> partAllocationDetails, IEnumerable<CallStatusServiceEngineerVisitsClosureDetails> serviceEngineerVisitsDetails, string TimeZone)
        {
            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById(TimeZone);

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
                    .Column(column =>
                    {
                        column.Item().BorderBottom(0).BorderColor("#A9A9A9").Padding(3).PaddingTop(2).PaddingBottom(0)
                        .Row(row =>
                        {
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().AlignLeft().Text($" {callDetail.TenantName}").FontSize(8).Bold();
                                column.Item().AlignLeft().Text($" {callDetail.TenantAddress + " " + callDetail.TenantCityName}").FontSize(7);
                                column.Item().AlignLeft().Text($" {callDetail.TenantStateName + " " + callDetail.TenantPincode}").FontSize(7);
                            });
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().AlignCenter().Text("Call Status Report").FontSize(11).Bold();
                                column.Item().AlignCenter().Text($"Generated By {callDetail.GeneratedBy} On {DateTime.Now.ToString("dd-MM-yyyy")}").FontSize(6).Light();

                            });
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().AlignLeft().Text($" {callDetail.CustomerName}").FontSize(8).Bold();
                                column.Item().AlignLeft().Text($" {callDetail.CustomerAddress+" " + callDetail.CustomerCityName}").FontSize(7);
                                column.Item().AlignLeft().Text($" {callDetail.CustomerStateName + " " + callDetail.CustomerPincode}").FontSize(7);
                            });
                        });
                        column.Item().BorderBottom(0).BorderColor("#A9A9A9").Padding(3).PaddingTop(2).PaddingBottom(0)
                       .Row(row =>
                       {
                           row.RelativeItem().Column(column =>
                           {
                               column.Item().AlignLeft().Text("Work Order Details").FontSize(8).Bold();
                           });
                          
                       });
                        column.Item().BorderBottom(0).Padding(3).Row(row =>
                        {
                            row.RelativeItem().PaddingTop(5).Column(innercolumn =>
                            {
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text("Work Order Number ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("CaseID ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Ticket Number ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Incident Number ");

                                });
                                innercolumn.Item().PaddingTop(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.WorkOrderNumber}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.CaseId}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.TicketNumber}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.IncidentId}");

                                });
                                innercolumn.Item().PaddingTop(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem(2).Element(CellStyle).Text("Asset Info ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Serial Number");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Accel Asset Id ");

                                });
                                innercolumn.Item().PaddingBottom(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem(2).Element(CellStyle).Text($" {callDetail.Make +" "+callDetail.CategoryName+" "+ callDetail.ModelName}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.ProductSerialNumber}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.AccelAssetId}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text("Service Contract Number ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Contract Period ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Call Type ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Service Mode");

                                });
                                innercolumn.Item().PaddingTop(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.ContractNumber}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.ContractStartDate.ToString("dd-MM-yyyy")+ " - "+ callDetail.ContractEndDate.ToString("dd-MM-yyyy")}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.CallType}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.ServiceMode}");

                                });
                                innercolumn.Item().PaddingTop(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text("Current Status ");
                                    innerrow.RelativeItem(3).Element(CellStyle).Text("VIP Asset ");

                                });
                                innercolumn.Item().PaddingBottom(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.CallStatus}");
                                    innerrow.RelativeItem(3).Element(CellStyle).Text(callDetail.IsVipProduct?"Yes":"No");
                                });
                                innercolumn.Item().PaddingTop(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text("Customer Reported Issue ");
                                    innerrow.RelativeItem(2).Element(CellStyle).Text("Call Centre Remarks ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Call Centre Executive ");

                                });
                                innercolumn.Item().PaddingBottom(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.CustomerReportedIssue}");
                                    innerrow.RelativeItem(2).Element(CellStyle).Text($" {callDetail.CallCenterRemarks}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.CallCreatedBy}");
                                });

                                innercolumn.Item().AlignLeft().PaddingBottom(2).Text("Service Level Agreement Details").FontSize(8).Bold();

                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("SLA Events ");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("Call Created");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("First Response");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("StandBy Given");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("Call Received");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("Call Closed");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("SLA");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text($"{callDetail.ResponseTimeInHours} hours");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text($"{callDetail.StandByTimeInHours} hours");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text($"{callDetail.ResolutionTimeInHours} hours");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("Actual");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text($"{TimeZoneInfo.ConvertTimeFromUtc(callDetail.CallCreatedOn,cstZone).ToString("dd-MM-yyyy HH:mm")}");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text(callDetail.ResolvedOn.HasValue ? $"{TimeZoneInfo.ConvertTimeFromUtc(callDetail.ResolvedOn.Value, cstZone).ToString("dd-MM-yyyy HH:mm")}": "");
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text(callDetail.ClosedOn.HasValue ? $"{TimeZoneInfo.ConvertTimeFromUtc(callDetail.ClosedOn.Value, cstZone).ToString("dd-MM-yyyy HH:mm")}":"");
                                });

                                innercolumn.Item().AlignLeft().PaddingBottom(2).PaddingTop(4).Text("Exclustions").FontSize(8).Bold();
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("Standard Items Not Covered");
                                    innerrow.RelativeItem(4).Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text($"{callDetail.GeneralNotCovered}");
                                  });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("Parts Not Covered");
                                    innerrow.RelativeItem(4).Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text($"{callDetail.PartsNotCovered}");
                                }); 
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("S/W Not Supported");
                                    innerrow.RelativeItem(4).Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text($"{callDetail.SoftwareNotCovered}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text("H/W Not Supported");
                                    innerrow.RelativeItem(4).Element(CellStyle).Border(1).BorderColor("#A9A9A9").Padding(3).Text($"{callDetail.HardwareNotCovered}");
                                });

                                innercolumn.Item().AlignLeft().PaddingTop(4).Text("Customer Site").FontSize(8).Bold();
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text("Site Name");
                                    innerrow.RelativeItem(3).Element(CellStyle).Text("Address");
                                });
                                innercolumn.Item().PaddingBottom(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.SiteName}");
                                    innerrow.RelativeItem(3).Element(CellStyle).Text($" {callDetail.SiteAddress}");
                                });
                                innercolumn.Item().PaddingTop(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text("");
                                    innerrow.RelativeItem().Element(CellStyle).Text("City");
                                    innerrow.RelativeItem().Element(CellStyle).Text("State");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Pincode");
                                });
                                innercolumn.Item().PaddingBottom(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text("");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.SiteCityName}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.SiteStateName}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.SitePincode}");

                                });
                                innercolumn.Item().AlignLeft().PaddingTop(4).Text("Customer Contact Info").FontSize(8).Bold();
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text("End User ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Site Contact ");
                                    innerrow.RelativeItem().Element(CellStyle).Text("Primary Contact");

                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.EndUserName}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.SiteContactName}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.CustomerContactName}");
                                });
                                innercolumn.Item().Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.EndUserPhone}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.SiteContactPhone}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.CustomerContactPhone}");
                                });
                                innercolumn.Item().PaddingBottom(3).Row(innerrow =>
                                {
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.EndUserEmail}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($"{callDetail.SiteContactEmail}");
                                    innerrow.RelativeItem().Element(CellStyle).Text($" {callDetail.CustomerContactEmail}");
                                });
                            });
                     column.Item().AlignLeft().PaddingLeft(1).Text("Engineer Visits").FontSize(8).Bold();
                     column.Item()
                      .Row(row =>
                      {
                          row.RelativeItem().PaddingHorizontal(5).PaddingVertical(4).Table(table =>
                          {
                              table.Header(header =>
                              {
                                  header.Cell().Element(CellStyle).Text("SlNo.");
                                  header.Cell().Element(CellStyle).Text("Employee Code");
                                  header.Cell().Element(CellStyle).Text("Name");
                                  header.Cell().Element(CellStyle).Text("Assigned On");
                                  header.Cell().Element(CellStyle).Text("Scheduled On");
                                  header.Cell().Element(CellStyle).Text("Accepted On");
                                  header.Cell().Element(CellStyle).Text("Visit Started On");
                                  header.Cell().Element(CellStyle).Text("Closed On");

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
                          int slno = 1;
                              foreach (var visitDetail in serviceEngineerVisitsDetails)
                              {
                                  table.Cell().Element(CellStyle).Text($"{slno}");
                                  table.Cell().Element(CellStyle).Text($"{visitDetail.EmployeeCode}");
                                  table.Cell().Element(CellStyle).Text($"{ visitDetail.ServiceEngineer}");
                                  table.Cell().Element(CellStyle).Text(visitDetail.AssignedOn.HasValue ? $"{TimeZoneInfo.ConvertTimeFromUtc(visitDetail.AssignedOn.Value, cstZone).ToString("dd-MM-yyyy HH:mm")}" : "");
                                  table.Cell().Element(CellStyle).Text(visitDetail.ScheduledOn.HasValue ? $"{TimeZoneInfo.ConvertTimeFromUtc(visitDetail.ScheduledOn.Value, cstZone).ToString("dd-MM-yyyy HH:mm")}" : "");
                                  table.Cell().Element(CellStyle).Text(visitDetail.AcceptedOn.HasValue ? $"{TimeZoneInfo.ConvertTimeFromUtc(visitDetail.AcceptedOn.Value, cstZone).ToString("dd-MM-yyyy HH:mm")}" : "");
                                  table.Cell().Element(CellStyle).Text(visitDetail.VisitStartsOn.HasValue ? $"{TimeZoneInfo.ConvertTimeFromUtc(visitDetail.VisitStartsOn.Value, cstZone).ToString("dd-MM-yyyy HH:mm")}" : "");
                                  table.Cell().Element(CellStyle).Text(visitDetail.VisitEndsOn.HasValue ? $"{TimeZoneInfo.ConvertTimeFromUtc(visitDetail.VisitEndsOn.Value, cstZone).ToString("dd-MM-yyyy HH:mm")}" : "");

                                  static IContainer CellStyle(IContainer container)
                                  {
                                      return container.Border(1).BorderColor("#A9A9A9").DefaultTextStyle(x => x.SemiBold().FontSize(8)).Padding(2);
                                  }
                              }
                          });
                      });
                        });
                        static IContainer CellStyle(IContainer container)
                        {
                            return container.DefaultTextStyle(x => x.FontSize(8)).PaddingVertical(0).Border(0).BorderColor("#A9A9A9");
                        }
                    });
            });
        }
    }
}
