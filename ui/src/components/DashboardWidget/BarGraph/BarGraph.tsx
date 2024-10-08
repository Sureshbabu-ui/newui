import Chart from "react-apexcharts";
import { useStore } from "../../../state/storeHooks";

export default function BarGraph({ BarGraphDetails }) {
  const data = {
    options: {
      chart: {
        id: "bar",
        toolbar: {
          show: false
        }
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: BarGraphDetails.map((graphDetails) => (graphDetails.xaxis)),
      }
    },
    series: [{
      name: "series-1",
      data: BarGraphDetails.map((graphDetails) => (graphDetails.yaxis))
    }]
  };

  return (
    <>
      <div className="row">
        <Chart
          options={data.options}
          series={data.series}
          type="bar"
          width="100%"
          height={400} />
      </div>
    </>
  );
}
