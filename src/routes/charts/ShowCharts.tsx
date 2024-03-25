/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "../../hooks/hooks";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import UploadDialogue from "./UploadDialogue";
import { useNavigate } from "react-router-dom";

//TODO add check when charts empty it shouldn't show anything
interface chartItem {
  [key: string]: string;
}

interface chartdata {
  data: any;
  layout: any;
}

const chartConfig = {
  displaylogo: false,
};

export default function ShowCharts() {
  const role = useAppSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [chartData, setChartData] = useState<chartdata[]>([]);

  const parseChartData = (charts: any[]) => {
    console.log("parsed chart data argument", charts);
    if (!charts || !Array.isArray(charts) || charts.length === 0) {
      return null;
    }
    const chartObjects = charts.map((chart) => {
      const dataKeys = Object.keys(chart.data[0]);
      const dataSeries = dataKeys
        .filter((key) => key !== "date")
        .map((key) => ({
          x: chart.data.map((item: chartItem) => item["date"]),
          y: chart.data.map((item: chartItem) => parseFloat(item[key])),
          type: "scatter",
          mode: "lines",
          name: key,
        }));

      return {
        data: dataSeries,
        layout: {
          modebar: {
            orientation: "v",
          },
          legend: {
            orientation: "v",
          },
          width: 700,
          height: 400,
          margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4,
          },
          paper_bgcolor: "LightSteelBlue",
          title: chart.title || "",
          xaxis: {
            title: "Date",
          },
          yaxis: {
            title: "Values",
          },
        },
      };
    });

    return chartObjects;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/charts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 405) {
            navigate("/waiting");
          } else if (response.status === 403) {
            navigate("/login");
          } else {
            throw new Error("Failed to fetch articles");
          }
          return;
        }
        const charts = await response.json();
        const parsedData = parseChartData(charts);
        setChartData(parsedData);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="flex flex-col mx-auto">
      {" "}
      <div className="text-5xl font-bold mt-2 text-center">
        Charts dashboard
      </div>
      <UploadDialogue />
      {(role === "ADMIN_USER" || role === "EDITOR_USER") && (
        <button
          className="btn btn-neutral w-36 ml-5"
          onClick={() =>
            (
              document.getElementById("my_modal_1") as HTMLDialogElement
            )?.showModal()
          }
        >
          Upload new
        </button>
      )}
      <div className="flex flex-col bg-red-200 justify-center min-h-screen mt-10">
        {chartData.map((chart, index) => (
          <Plot
            key={index}
            style={{ marginTop: "10px" }}
            data={chart.data}
            layout={chart.layout}
            config={chartConfig}
          />
        ))}
      </div>
    </div>
  );
}
