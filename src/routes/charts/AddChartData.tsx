import React, { FormEvent, useState } from "react";

export default function AddChartData({ fields }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formDataToSubmit = {};

    for (const [key, value] of Object.entries(formData)) {
        console.log(key, value);
        formDataToSubmit[key] = value; 
      }
      console.log(formDataToSubmit);
    console.log(formDataToSubmit);
    try {
      const res = await fetch(`http://localhost:3000/admin/chart/2`, {
        method: "PUT",
        body: JSON.stringify({ formDataToSubmit }), 
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
    }
  };

  return (
    <dialog id="add_chart_data" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add chart data</h3>
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index}>
              <label htmlFor={field}>{field}</label>
              <input
                type="text"
                name={field}
                id={field}
                value={formData[field] || ""}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          <button
            className="btn btn-error mt-5 mr-3"
            onClick={() =>
              (
                document.getElementById("add_chart_data") as HTMLDialogElement
              )?.close()
            }
          >
            Close
          </button>
        </form>
      </div>
    </dialog>
  );
}
