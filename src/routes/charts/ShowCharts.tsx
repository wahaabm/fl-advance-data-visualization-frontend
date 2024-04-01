/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "../../hooks/hooks";
import { useEffect, useState } from "react";
import Plotly from "plotly.js-cartesian-dist";
import createPlotlyComponent from "react-plotly.js/factory";

import UploadDialogue from "./UploadDialogue";
import { useNavigate } from "react-router-dom";
import AddChartData from "./AddChartData";
import Loading from "../../utils/Loading";

interface chartItem {
  [key: string]: string;
}

interface chartData {
  data: any[];
  dataKeys: string[];
  layout: any;
  chartId: number;
  title: string;
  authorId: number;
}

const chartConfig = {
  displaylogo: false,
};

export default function ShowCharts() {
  const role = useAppSelector((state) => state.auth.role);
  const userId = useAppSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [chartData, setChartData] = useState<chartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<chartData | null>(null);
  const HOST = import.meta.env.VITE_REACT_API_URL;
  const Plot = createPlotlyComponent(Plotly);

  const parseChartData = (charts: any[]) => {
    console.log("parsed chart data argument", charts);
    if (!charts || !Array.isArray(charts) || charts.length === 0) {
      return null;
    }
    const chartObjects = charts.map((chart) => {
      const dataKeys = Object.keys(chart.data[0]);
      console.log(dataKeys);
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
        dataKeys: dataKeys,
        data: dataSeries,
        chartId: chart.id,
        title: chart.title,
        authorId: chart.authorId,
        layout: {
          modebar: {
            orientation: "v",
          },
          legend: { x: 0.4, y: 1.3 },

          width: 600,
          height: 400,
          margin: {
            l: 50,
            r: 70,
            b: 70,
            t: 50,
            pad: 4,
          },
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

  const fetchCharts = async () => {
    try {
      const response = await fetch(`${HOST}/charts`, {
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
      if (parsedData == null) {
        setChartData([]);
      } else {
        setChartData(parsedData);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching charts");
    fetchCharts();
  }, [token]);

  const handleAddData = (chart: chartData) => {
    setSelectedChart(chart);
    (
      document.getElementById("add_chart_data") as HTMLDialogElement
    )?.showModal();
  };

  useEffect(() => {
    if (selectedChart) {
      (
        document.getElementById("add_chart_data") as HTMLDialogElement
      )?.showModal();
    }
  }, [selectedChart]);

  const handleDelete = async (id: number) => {
    if (role === "ADMIN_USER" || role === "EDITOR_USER") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this chart?"
      );
      if (!confirmed) {
        return;
      }
      try {
        const url = `${HOST}/admin/chart/${id}`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log("Chart deleted successfully!");
          fetchCharts();
        } else {
          const errorData = await response.json();
          console.error(
            "Error deleting Chart:",
            errorData || response.statusText
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.warn("Unauthorized user: You cannot delete Charts.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col mx-auto">
      <img
        src="/images/header-picture.png"
        width={300}
        className="mx-auto"
        alt=""
      />
      <div className="text-5xl font-bold mt-2 text-center">
        Charts dashboard
      </div>
      <p className="text-center mt-2 text-lg">
        Manage and visualize data and insights through interactive charts.
      </p>

      <UploadDialogue fetchCharts={fetchCharts} />
      {(role === "ADMIN_USER" || role === "EDITOR_USER") && (
        <button
          className="btn btn-primary w-36 mt-5 mx-auto"
          onClick={() =>
            (
              document.getElementById("my_modal_1") as HTMLDialogElement
            )?.showModal()
          }
        >
          Upload new
        </button>
      )}
      {!chartData && (
        <p className="text-xl mt-20 text-center text-gray-600">
          No charts are currently available. <br />
          You can start by uploading a new chart using the button above.
        </p>
      )}
      <div className="flex flex-wrap gap-4">
        {chartData &&
          chartData.map((chart) => (
            <div
              key={chart.chartId}
              className="card w-100 bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-3xl"> {chart.title}</h2>

                <Plot
                  key={chart.chartId}
                  style={{ marginTop: "10px" }}
                  data={chart.data}
                  layout={chart.layout}
                  config={chartConfig}
                />
                <div className="card-actions justify-between">
                  {(role === "ADMIN_USER" ||
                    (role === "EDITOR_USER" &&
                      chart.authorId == Number(userId))) && (
                    <div className="flex gap-x-2">
                      <button
                        className="btn btn-outline btn-info"
                        onClick={() => handleAddData(chart)}
                      >
                        add data
                      </button>
                      <button
                        onClick={() => handleDelete(chart.chartId)}
                        className="btn btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      {selectedChart && (
        <AddChartData
          chart={selectedChart}
          onClose={() => setSelectedChart(null)}
          fetchCharts={fetchCharts}
        />
      )}
    </div>
  );
}
