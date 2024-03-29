import { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../utils/Loading";

interface articleData {
  authorId: number;
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export default function EditArticle() {
  const [article, setArticle] = useState<articleData>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [title, setTitle] = useState("");

  const fetchArticle = async () => {
    try {
      const response = await fetch(`http://localhost:3000/article/${id}`, {
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
      const data = await response.json();
      console.log(data);
      setArticle(data);
      setTitle(data.title);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  const handleSave = async () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      const editor = editorRef.current.getContent();
      try {
        const response = await fetch(
          `http://localhost:3000/admin/article/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              content: editor,
              title: title,
              published: true,
            }),
          }
        );
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

  if (loading) return <Loading />;

  return (
    <>
      <div className="text-5xl font-bold mt-2 mb-5 text-center">
        Edit an article
      </div>
      <div className="form-control label w-full  mb-5">
        <span className="label-text text-2xl font-bold mr-5 self-start">
          Title:{" "}
        </span>
        <input
          type="text"
          value={title}
          className="input input-bordered w-full"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-control label w-full">
        <span className="label-text text-2xl font-bold mr-5 self-start">
          Article:
        </span>
        <Editor
          tinymceScriptSrc={"/tinymce/tinymce.min.js"}
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={article?.content}
          init={{
            height: 500,
            width: "100%",
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
      </div>

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
