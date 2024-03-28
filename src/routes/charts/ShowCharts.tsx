/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "../../hooks/hooks";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import UploadDialogue from "./UploadDialogue";
import { useNavigate } from "react-router-dom";
import AddChartData from "./AddChartData";
import { title } from "process";
import Loading from "../../utils/Loading";

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
  const userId = useAppSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [chartData, setChartData] = useState<chartdata[]>([]);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState();
  const [selectedChart, setSelectedChart] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching charts");
    fetchCharts();
  }, [token]);

  const handleAddData = (chart) => {
    setSelectedChart(chart);
    document.getElementById("add_chart_data")?.showModal();
  };

  useEffect(() => {
    if (selectedChart) {
      document.getElementById("add_chart_data")?.showModal();
    }
  }, [selectedChart]);

  const handleDelete = async (id) => {
    if (role === "ADMIN_USER" || role === "EDITOR_USER") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this chart?"
      );
      if (!confirmed) {
        return;
      }
      try {
        const url = `http://localhost:3000/admin/chart/${id}`;
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
      <UploadDialogue fetchCharts={fetchCharts} />
      {(role === "ADMIN_USER" || role === "EDITOR_USER") && (
        <button
          className="btn btn-primary w-36 mt-5"
          onClick={() =>
            (
              document.getElementById("my_modal_1") as HTMLDialogElement
            )?.showModal()
          }
        >
          Upload new
        </button>
      )}
      <div className="flex flex-wrap gap-4">
        {chartData &&
          chartData.map((chart, index) => (
            <div className="card w-100 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-3xl"> {chart.title}</h2>

                <Plot
                  key={index}
                  style={{ marginTop: "10px" }}
                  data={chart.data}
                  layout={chart.layout}
                  config={chartConfig}
                />
                <div className="card-actions justify-between">
                  {(role === "ADMIN_USER" ||
                    (role === "EDITOR_USER" && chart.authorId === userId)) && (
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
