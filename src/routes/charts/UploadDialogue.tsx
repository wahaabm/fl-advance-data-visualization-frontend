import { FormEvent, useState } from "react";

const UploadDialogue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("csvFile", file!);

    try {
      const res = await fetch("http://localhost:3000/admin/csv", {
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
        (document.getElementById("my_modal_1") as HTMLDialogElement).close();
      }
    } catch (error) {
      (document.getElementById("my_modal_1") as HTMLDialogElement).close();
      console.error("Error:", error);
    }
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Upload csv</h3>
        <form onSubmit={handleSubmit}>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Title</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
            />
          </label>
          <label className="form-control w-full max-w-xs">
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
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Pick a file</span>
            </div>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={(e) => setFile(e.target.files![0])}
              required
            />
          </label>

          <button
            className="btn btn-error mt-5 mr-3"
            onClick={() =>
              (
                document.getElementById("my_modal_1") as HTMLDialogElement
              )?.close()
            }
          >
            Close
          </button>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default UploadDialogue;
