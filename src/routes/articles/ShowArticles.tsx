import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
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

export default function ShowArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<articleData[]>([]);
  const token = localStorage.getItem("token");
  const role = useAppSelector((state) => state.auth.role);
  const userId = useAppSelector((state) => state.auth.userId);
  const [loading, setLoading] = useState(true);
  const HOST = import.meta.env.VITE_REACT_API_URL;
  const [, setTitle, setDescription] = useOutletContext() as [
    Boolean,
    Function,
    Function
  ];

  useEffect(() => {
    setTitle("Articles dashboard");
    setDescription("Manage and view all articles at a glance.");
  }, []);

  const handleDelete = async (id: number) => {
    if (role === "ADMIN_USER" || role === "EDITOR_USER") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this article?"
      );
      if (!confirmed) {
        return;
      }
      try {
        const url = `${HOST}/admin/article/${id}`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log("Article deleted successfully!");
          fetchArticles();
        } else {
          const errorData = await response.json();
          console.error(
            "Error deleting article:",
            errorData || response.statusText
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.warn("Unauthorized user: You cannot delete articles.");
    }
  };

  const handleEdit = async (id: number) => {
    navigate(`/edit-article/${id}`);
  };

  const handleReadArticle = async (id: number) => {
    navigate(`/article/${id}`);
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${HOST}/articles`, {
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
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("fetching articles");
    fetchArticles();
  }, [token]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col">
      {(role == "ADMIN_USER" || role === "EDITOR_USER") && (
        <button
          className="btn btn-primary w-36 mt-5 mb-5 mx-auto"
          onClick={() => navigate("/create-article")}
        >
          Create new
        </button>
      )}
      {articles.length == 0 && (
        <p className="text-xl mt-20 text-center text-gray-600">
          No articles are currently available. <br />
          You can start by creating a new article using the button above.
        </p>
      )}
      <div className="flex flex-wrap gap-4 mt-5">
        {articles.map((article) => (
          <div key={article.id} className="card w-80 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-3xl"> {article.title}</h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: article.content.substring(0, 250),
                }}
              />
              <div className="card-actions justify-between mt-auto">
                <div className="flex gap-x-2">
                  {(role === "ADMIN_USER" ||
                    (role === "EDITOR_USER" &&
                      article.authorId.toString() == userId)) && (
                    <>
                      <button
                        onClick={() => handleEdit(article.id)}
                        className="btn btn-outline btn-info"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="btn btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleReadArticle(article.id)}
                  className="btn"
                >
                  Read
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
