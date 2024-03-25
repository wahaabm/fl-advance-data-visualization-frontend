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
          className="btn btn-neutral w-36 mt-5"
          onClick={() => navigate("/create")}
        >
          Create new
        </button>
      )}
      {articles.map((article) => (
        <div key={article.id} className="bg-blue-300 mt-5 mb-5">
          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            {article.title}
          </p>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      ))}
    </div>
  );
}
