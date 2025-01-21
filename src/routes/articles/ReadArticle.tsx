import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../components/Loading';

interface articleData {
  authorId: number;
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export default function ReadArticle() {
  const navigate = useNavigate();
  const [article, setArticle] = useState<articleData>();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Get the id from the URL params
  const HOST = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_REACT_API_URL;

  const fetchArticle = async () => {
    try {
      const response = await fetch(`${HOST}/article/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 405) {
          navigate('/waiting');
        } else if (response.status === 403) {
          navigate('/login');
        } else {
          throw new Error('Failed to fetch articles');
        }
        return;
      }
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col">
        <div className="text-5xl font-bold mt-5 text-center mb-5 md:pr-20">
          {article?.title}
        </div>

        <div className="flex flex-col gap-4">
          <div
            key={article?.id}
            className="card w-full bg-base-100 shadow-md"
          >
            <div className="card-body">
              <div
                className="w-full prose-sm"
                dangerouslySetInnerHTML={{
                  __html: article?.content || '',
                }}
              />
            </div>
          </div>
        </div>
        <button
          className="btn btn-ghost mt-2 self-baseline"
          onClick={() => navigate(-1)}
        >
          go back
        </button>
      </div>
    </div>
  );
}
