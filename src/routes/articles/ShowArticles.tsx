import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

export default function ShowArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const token = localStorage.getItem("token");
  const role = useAppSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:3000/articles", {
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
      }
    };

    fetchArticles();
  }, []);

  return (
    <div>
      <div className="text-5xl font-bold mt-2 text-center">
        Articles dashboard
      </div>
      {(role == "ADMIN_USER" || role === "EDITOR_USER") && (
        <button
          className="btn btn-primary w-36 mt-5"
          onClick={() => navigate("/create")}
        >
          Create new
        </button>
      )}

      <div className="flex flex-wrap gap-4">
        {articles.map((article) => (
          <div key={article.id} className="card w-80 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title"> {article.title}</h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: article.content.substring(0, 127),
                }}
              />
              <div className="card-actions justify-between">
                <div className="flex gap-x-2">
                <button className="btn btn-outline btn-info">Edit</button>
                <button className="btn btn-outline btn-error ">Delete</button>
                </div>
                <button className="btn">Read</button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
