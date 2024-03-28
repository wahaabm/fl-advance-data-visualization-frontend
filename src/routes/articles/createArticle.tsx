import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";

export default function CreateArticle() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      const editor = editorRef.current.getContent();
      try {
        const response = await fetch("http://localhost:3000/admin/article", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: editor,
            title: title,
            published: true,
          }),
        });
        if (response.status == 403) {
          navigate("/login");
          return;
        }
        navigate("/articles");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="text-5xl font-bold mt-2 mb-5 text-center">
        Write an article
      </div>
      <label className="form-control w-full mb-5">
        <div className="label">
          <span className="label-text text-2xl font-bold mr-5">Title: </span>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </label>
      <Editor
        tinymceScriptSrc={"/tinymce/tinymce.min.js"}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<h2><strong>Start writing your article here</strong></h2>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <div className="flex flex-row justify-end gap-x-2">
        <button
          className="btn btn-outline btn-error mt-2 self-baseline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button
          className="btn btn-outline btn-primary mt-2 self-baseline"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </>
  );
}
