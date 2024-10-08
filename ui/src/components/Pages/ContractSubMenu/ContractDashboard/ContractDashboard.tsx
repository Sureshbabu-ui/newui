import Chart from "react-apexcharts";
import { useTranslation } from 'react-i18next';
import { useStoreWithInitializer } from "../../../../state/storeHooks";
import { dispatchOnCall, store } from "../../../../state/store";
import { getContractServiceRequestCount } from "../../../../services/serviceRequest";
import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { initializeContractDashboard, loadContractServiceRequest } from "./ContractDashboard.slice";
import { ContractPartIndentSummary } from "./ContractPartIndentSummary/ContractPartIndentSummary";
import { checkForPermission } from "../../../../helpers/permissions";
import ContractRevenueSummary from "./ContractRevenueSummery/ContractRevenueSummery";
import {ContractSummary} from "./ContractSummary/ContractSummary";



function ContractDashboard() {
  const { t, i18n } = useTranslation();
  const { servicerequestcount } = useStoreWithInitializer(
    ({ contractdashboard }) => contractdashboard,
    dispatchOnCall(initializeContractDashboard())
  );

  const { ContractId } = useParams<{ ContractId: string }>();
  useEffect(() => {
    onLoad(ContractId);
  }, [ContractId]);

  const radialChart = {
    series: [50],
    options: {
      chart: {
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      fill: {
        type: 'fill',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        },
      },
      labels: ['Average Results'],
    },


  };

  const horizontalBar = {

    series: [{
      data: [2000000, 1250000, 1000000]
    }],
    options: {
      chart: {
        toolbar: {
          show: false
        }
      },
      grid: {
        show: false
      },
      legend: {
        show: false
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom'
          },
        }
      },
      colors: ['#088F8F', '#FFBF00', '#50C878'],
      dataLabels: {
        enabled: true,
        textAnchor: 'start' as const,
        style: {
          colors: ['#fff'],
          fontSize: "15px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "normal"
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        categories: ['Contract Value', 'Invoiced', 'Collected'],
        labels: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function () {
              return ''
            }
          }
        }
      }
    },
  };

  async function onLoad(ContractId: string) {
    store.dispatch(initializeContractDashboard());
    try {
      const contractservicerequestcount = await getContractServiceRequestCount(ContractId);
      store.dispatch(loadContractServiceRequest(contractservicerequestcount));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="contract-dashboard-wrapper ps-1">
      <div className="row me-3">
        {/* Header */}
        <div className='m-0 ms-1 mb-3 '><h5 className="mt-3 pt-1 app-primary-color">{t('contract_dashboard_main_heading')}</h5></div>
        {/* Header */}
        <ContractSummary />
        <ContractRevenueSummary></ContractRevenueSummary>
        
        <div className="me-1 mt-0 mb-4">
                {/* header */}
                <div className="small mb-2 fw-bold">{t('contract_dashboard_ticket_status')}</div>
                {/* header ends */}
                <div className="row">
                    <div className="col-md-4">
                        {/* total call wapper */}
                        <div className="p-0 mt-1 m-0 ">
                            {/* total call count */}
                            <div className=" rounded me-2 p-3 bg-warning-subtle">
                                <div className="h2 fw-bold">{servicerequestcount.TotalServiceRequestCount}</div>
                                <div className="h5">{t('contract_dashboard_total_calls')}</div>
                            </div>
                            {/* total call count */}
                        </div>
                    </div>
                    <div className="col-md-4">
                        {/* man power wrapper  */}
                        <div className="p-0 mt-1 m-0 ">
                            <div className=" rounded me-2 p-3 bg-success-subtle">
                                <div className="h2 fw-bold">{servicerequestcount.ClosedServiceRequestCount}</div>
                                <div className="h5">{t('contract_dashboard_resolved_calls')}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        {/* site wrapper  */}
                        <div className="p-0 mt-1 m-0">
                            <div className=" rounded me-2 p-3 bg-secondary-subtle">
                                <div className="h2 fw-bold">{servicerequestcount.OpenServiceRequestCount}</div>
                                <div className="h5">{t('contract_dashboard_open_calls')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
      {checkForPermission("SERVICE_REQUEST_DETAILS") && <ContractPartIndentSummary />}
    </div>
  );
}

export default ContractDashboard