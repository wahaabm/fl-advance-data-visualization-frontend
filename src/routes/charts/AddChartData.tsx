import { ChangeEvent, FormEvent, useState } from "react";

interface ChartData {
  data: any[];
  layout: any;
  dataKeys: string[];
  chartId: number;
  title: string;
  authorId: number;
}

interface Props {
  chart: ChartData;
  onClose: () => void;
  fetchCharts: () => void;
}

export default function AddChartData({ chart, onClose, fetchCharts }: Props) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: number;
    if (name !== "date") {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue) && value !== "") {
        setError(`Invalid value for ${name}`);
      } else {
        setError("");
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: parsedValue !== undefined ? parsedValue : value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (error) {
      return;
    }
    const formDataToSubmit: Record<string, any> = {};
    const hasError = false;
    for (const [key, value] of Object.entries(formData)) {
      formDataToSubmit[key] = value;
    }
    if (hasError) {
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/admin/chart/${chart.chartId}`,
        {
          method: "PUT",
          body: JSON.stringify({ formDataToSubmit }),
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.ok) {
        await res.json();
        (
          document.getElementById("add_chart_data") as HTMLDialogElement
        ).close();
      } else {
        console.error("Failed to upload chart data");
        (
          document.getElementById("add_chart_data") as HTMLDialogElement
        ).close();
      }
    } catch (error) {
      console.error("Error:", error);
      (document.getElementById("add_chart_data") as HTMLDialogElement).close();
    } finally {
      fetchCharts();
      onClose();
    }
  };

  return (
    <dialog id="add_chart_data" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add chart data</h3>
        <form onSubmit={handleSubmit}>
          {chart.dataKeys.map((field, index) => (
            <div key={index}>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  <input
                    type="text"
                    placeholder=""
                    className="input input-bordered w-1/2 max-w-xs"
                    name={field}
                    id={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>
            </div>
          ))}
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error message */}
          <div className="flex flex-row gap-x-2 mt-2">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
            <button
              className="btn btn-error "
              type="button"
              onClick={() =>
                (
                  document.getElementById("add_chart_data") as HTMLDialogElement
                )?.close()
              }
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
