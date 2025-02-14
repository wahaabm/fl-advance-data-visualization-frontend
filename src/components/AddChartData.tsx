import { ChangeEvent, FormEvent, useState } from 'react';

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
  const [error, setError] = useState('');
  const HOST = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_REACT_API_URL;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'date') {
      try {
        Date.parse(value);
      } catch (err) {
        setError(`Invalid date provided`);
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (error) {
      return;
    }

    try {
      const res = await fetch(`${HOST}/admin/chart/${chart.chartId}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        // await res.json()
        (
          document.getElementById('add_chart_data') as HTMLDialogElement
        ).close();
      } else {
        console.error('Failed to upload chart data');
        (
          document.getElementById('add_chart_data') as HTMLDialogElement
        ).close();
      }
    } catch (error) {
      console.error('Error:', error);
      (document.getElementById('add_chart_data') as HTMLDialogElement).close();
    } finally {
      fetchCharts();
      onClose();
    }
  };

  return (
    <dialog
      id="add_chart_data"
      className="modal "
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Chart Data</h3>
        <form onSubmit={handleSubmit}>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Date</span>
            </div>

            <input
              type="date"
              placeholder="Date"
              className="input input-bordered"
              name="date"
              id="date"
              value={formData['date'] || ''}
              onChange={handleChange}
              required
            />
          </label>
          {chart.dataKeys
            .filter((field) => field.toLowerCase() !== 'date')
            .map((field, index) => (
              <div key={index}>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                  </div>

                  <input
                    type={field === 'date' ? 'date' : 'number'}
                    placeholder={field}
                    className="input input-bordered"
                    name={field}
                    id={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    required={field === 'cpi' ? false : true}
                  />
                </label>
              </div>
            ))}
          {error && <p className="text-red-500">{error}</p>}{' '}
          {/* Display error message */}
          <div className="flex flex-row gap-x-2 mt-8 justify-center">
            <button
              className="btn btn-primary"
              type="submit"
            >
              Add Data
            </button>
            <button
              className="btn  "
              type="button"
              onClick={() =>
                (
                  document.getElementById('add_chart_data') as HTMLDialogElement
                )?.close()
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
