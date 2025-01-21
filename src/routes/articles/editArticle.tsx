import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
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

export default function EditArticle() {
  const [displayMode, ,] = useOutletContext() as [Boolean, Function, Function];

  const [article, setArticle] = useState<articleData>();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [pinned, setPinned] = useState(false);
  const [published, setPublished] = useState(false);
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
      setTitle(data.title);
      setPinned(data.pinned);
      setPublished(data.published);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  const handleSave = async () => {
    if (editorRef.current) {
      const editor = editorRef.current.getContent();

      setLoading(true);

      try {
        const response = await fetch(`${HOST}/admin/article/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: editor,
            title: title,
            published: published,
            pinned: pinned,
          }),
        });
        if (response.status == 403) {
          navigate('/login');
          return;
        }
        navigate('/articles');
      } catch (error) {
        console.log(error);
        alert(error);
      }

      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="text-xl mt-2 mb-5 text-left">Edit an article</div>

        <div className="form-control">
          <span className="label">Title: </span>
          <input
            type="text"
            value={title}
            className="input input-bordered "
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Is Pinned?</span>
            <input
              type="checkbox"
              checked={pinned}
              placeholder="Title of article"
              className="checkbox"
              required
              onChange={(e) => setPinned(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Is Published?</span>
            <input
              type="checkbox"
              checked={published}
              placeholder="Title of article"
              className="checkbox"
              required
              onChange={(e) => setPublished(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-control">
          <span className="label">Article:</span>
          <Editor
            key={displayMode + ''}
            tinymceScriptSrc={'/tinymce/tinymce.min.js'}
            onInit={(evt, editor) => {
              evt;
              editorRef.current = editor;
            }}
            initialValue={article?.content}
            licenseKey="gpl"
            init={{
              height: 500,
              width: '100%',
              menubar: false,
              skin: `${displayMode ? 'oxide-dark' : 'oxide'}`,
              content_css: `${displayMode ? 'dark' : 'transparent'}`,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'preview',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: ${
                displayMode ? '#1D232A' : 'white'
              } ; color: ${displayMode ? 'white' : 'dark'} ; }`,
            }}
          />
        </div>

        <div className="flex flex-row justify-end gap-x-2 mt-6">
          <button
            className="btn btn-ghost mt-2 self-baseline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              'Save Article'
            )}{' '}
          </button>
        </div>
      </div>
    </>
  );
}
