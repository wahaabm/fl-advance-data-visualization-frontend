import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";

export default function CreateArticle() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const editorRef = useRef(null);

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
            title: "hello",
            published: true,
          }),
        });
        if (response.status == 403) {
          navigate("/login");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Editor
        tinymceScriptSrc={"/tinymce/tinymce.min.js"}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
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
      <button onClick={handleSave}>Save</button>
    </>
  );
}
