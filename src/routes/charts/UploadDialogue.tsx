import { FormEvent, useState } from "react";

interface Prop {
  fetchCharts: () => void;
}
const UploadDialogue = ({ fetchCharts }: Prop) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File>();
  const HOST = import.meta.env.VITE_REACT_API_URL;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("csvFile", file!);

    try {
      const res = await fetch(`${HOST}/admin/csv`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        await res.json();
        (document.getElementById("my_modal_1") as HTMLDialogElement).close();
      } else {
        console.error("Failed to upload CSV file");
        alert("Failed to upload chart");
        (document.getElementById("my_modal_1") as HTMLDialogElement).close();
      }
    } catch (error) {
      (document.getElementById("my_modal_1") as HTMLDialogElement).close();
      console.error("Error:", error);
    } finally {
      fetchCharts();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files![0];
    // Check if the file type is CSV
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      // Reset the file input if the selected file is not a CSV
      event.target.value = "";
      setFile(undefined);
      alert("Please select a CSV file.");
    }
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-xl text-center">Upload csv</h3>
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Title</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full "
              required
            />
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered"
              placeholder="Description related to plot"
              required
            ></textarea>
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Pick a file</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
              required
            />
          </label>
          <div className="flex flex-row mt-2 gap-x-2">
            <button
              className="btn btn-error btn-outline "
              type="button"
              onClick={() =>
                (
                  document.getElementById("my_modal_1") as HTMLDialogElement
                )?.close()
              }
            >
              Close
            </button>
            <button className="btn btn-success btn-outline" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UploadDialogue;
