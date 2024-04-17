import { useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Loading from '../../components/Loading'
import { useAppSelector } from '../../hooks/hooks'

interface articleData {
  authorId: number
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  published: boolean
  pinned: boolean
}

export default function ShowArticles() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<articleData[]>([])
  const [pinnedArticles, setPinnedArticles] = useState<articleData[]>([])
  const token = localStorage.getItem('token')
  const role = useAppSelector((state) => state.auth.role)
  const userId = useAppSelector((state) => state.auth.userId)
  const [loading, setLoading] = useState(true)
  const HOST = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_REACT_API_URL
  const [, setTitle, setDescription] = useOutletContext() as [
    Boolean,
    Function,
    Function
  ]
  const activeArticleId = useRef<number>()
  const toc = useRef<HTMLUListElement>(null)

  useEffect(() => {
    setTitle('Articles dashboard')
    setDescription('Manage and view all articles at a glance.')
  }, [])

  function extractHighlightImageFromContent(content: string) {
    const tempDiv = document.createElement('div')

    tempDiv.innerHTML = content

    const imgElements = tempDiv.querySelectorAll('img')

    if (imgElements.length === 0) {
      return ''
    }

    const img = imgElements[0]

    img.classList.add('object-cover')
    img.classList.add('rounded-lg')
    img.classList.add('w-full')

    return img.outerHTML
  }

  function extractHighlightTextFromContent(content: string) {
    const tempDiv = document.createElement('div')

    tempDiv.innerHTML = content

    return `${tempDiv.innerText.substring(0, 127)}...`
  }

  const handleDelete = async (id: number) => {
    if (role === 'ADMIN_USER' || role === 'EDITOR_USER') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this article?'
      )
      if (!confirmed) {
        return
      }
      try {
        const url = `${HOST}/admin/article/${id}`
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          console.log('Article deleted successfully!')
          fetchArticles()
        } else {
          const errorData = await response.json()
          console.error(
            'Error deleting article:',
            errorData || response.statusText
          )
        }
      } catch (error) {
        console.error('Error:', error)
      }
    } else {
      console.warn('Unauthorized user: You cannot delete articles.')
    }
  }

  const handleEdit = async (id: number) => {
    navigate(`/edit-article/${id}`)
  }

  // const handleReadArticle = async (id: number) => {
  //   navigate(`/article/${id}`)
  // }

  const fetchPinnedArticles = async () => {
    try {
      const response = await fetch(`${HOST}/pinned-articles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 405) {
          navigate('/waiting')
        } else if (response.status === 403) {
          navigate('/login')
        } else {
          throw new Error('Failed to fetch articles')
        }
        return
      }
      const data = await response.json()
      setPinnedArticles(data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${HOST}/articles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 405) {
          navigate('/waiting')
        } else if (response.status === 403) {
          navigate('/login')
        } else {
          throw new Error('Failed to fetch articles')
        }
        return
      }
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPinnedArticles().then(fetchArticles)
  }, [token])

  const scrollToArticle = (articleId) => {
    activeArticleId.current = articleId

    const element = document.getElementById(articleId)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      const active = Array.from(document.querySelectorAll('.article')).find(
        ({ id }) => {
          const element = document.getElementById(id)

          if (element) {
            const offsetTop = element.offsetTop * 0.75
            const offsetBottom = offsetTop + element.offsetHeight

            return scrollPosition >= offsetTop && scrollPosition < offsetBottom
          }

          return false
        }
      )

      if (!active) {
        return
      }

      activeArticleId.current = parseInt(active.id, 10)

      toc.current.querySelectorAll('li').forEach((li) => {
        li.classList.remove('active')

        if (li.id === `li-${activeArticleId.current}`) {
          li.classList.add('active')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [token])

  if (loading) return <Loading />

  if (articles.length == 0) {
    return (
      <>
        <div className='flex flex-col w-72 md:w-full items-center mx-auto md:pr-20 mt-12'>
          <p className='text-lg md:text-xl text-center'>
            No articles are currently available. <br />
          </p>
          {(role == 'ADMIN_USER' || role === 'EDITOR_USER') && (
            <>
              <p className='text-center text-gray-600 dark:text-gray-400'>
                You can start by creating a new article using the button below.
              </p>
              <button
                className='btn btn-primary mt-6 mx-auto'
                onClick={() => navigate('/create-article')}
              >
                <span>Create new</span>
              </button>
            </>
          )}
        </div>
      </>
    )
  }

  return (
    <div>
      <div className='flex'>
        <div className='flex flex-col w-full md:w-3/4'>
          {pinnedArticles.length !== 0 && (
            <div className='block'>
              <div className='flex-col flex-1 mb-6'>
                <h1 className='text-xl font-bold'>Pinned Articles</h1>
              </div>

              <div className='flex flex-wrap gap-6'>
                {pinnedArticles.map((article) => (
                  <div className='flex flex-col'>
                    <a
                      key={article.id}
                      id={article.id.toString()}
                      className='card w-80 h-80 bg-base-100 shadow-sm hover:scale-105 overflow-hidden transition-all'
                      href={`/article/${article.id}`}
                    >
                      <div className='card-body flex flex-col p-4'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `${extractHighlightImageFromContent(
                              article.content
                            )}`,
                          }}
                          className='max-h-40 object-contain'
                        />

                        <div className='bg-white'>
                          <h2 className='card-title text-xl mb-4'>
                            {' '}
                            {article.title}
                          </h2>

                          <div
                            dangerouslySetInnerHTML={{
                              __html: `${extractHighlightTextFromContent(
                                article.content
                              )}`,
                            }}
                          />
                        </div>
                      </div>
                    </a>
                    <div className='card-actions mt-4'>
                      <div className='flex gap-x-2'>
                        {(role === 'ADMIN_USER' ||
                          (role === 'EDITOR_USER' &&
                            article.authorId.toString() == userId)) && (
                          <>
                            <button
                              onClick={() => handleEdit(article.id)}
                              className='btn btn-sm btn-ghost'
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className='btn btn-sm btn-ghost'
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                      {/* <button
                          onClick={() => handleReadArticle(article.id)}
                          className='btn btn-neutral'
                        >
                          Read More
                        </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className='my-12 dark:border-gray-900' />

          <div className='flex flex-wrap gap-6'>
            {articles.map((article) => (
              <div className='flex flex-col'>
                <a
                  key={article.id}
                  id={article.id.toString()}
                  className='card w-80 h-80 bg-base-100 shadow-sm hover:scale-105 overflow-hidden transition-all'
                  href={`/article/${article.id}`}
                >
                  <div className='card-body flex flex-col p-4'>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `${extractHighlightImageFromContent(
                          article.content
                        )}`,
                      }}
                      className='max-h-40 object-contain'
                    />

                    <div className='bg-white'>
                      <h2 className='card-title text-xl mb-4'>
                        {' '}
                        {article.title}
                      </h2>

                      <div
                        dangerouslySetInnerHTML={{
                          __html: `${article.content.substring(0, 127)}...`,
                        }}
                      />
                    </div>
                  </div>
                </a>
                <div className='card-actions mt-4'>
                  <div className='flex gap-x-2'>
                    {(role === 'ADMIN_USER' ||
                      (role === 'EDITOR_USER' &&
                        article.authorId.toString() == userId)) && (
                      <>
                        <button
                          onClick={() => handleEdit(article.id)}
                          className='btn btn-sm btn-ghost'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className='btn btn-sm btn-ghost'
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  {/* <button
                      onClick={() => handleReadArticle(article.id)}
                      className='btn btn-neutral'
                    >
                      Read More
                    </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='gap-y-5 fixed top-44 right-0 hidden md:block md:w-1/4'>
          {(role == 'ADMIN_USER' || role === 'EDITOR_USER') && (
            <button
              className='btn btn-primary mx-auto'
              onClick={() => navigate('/create-article')}
            >
              Create new
            </button>
          )}
          <div className='mt-6'>
            <ul
              className='max-w-md space-y-2 text-black list-none list-inside dark:text-gray-400'
              ref={toc}
            >
              {articles.map((article) => (
                <li
                  key={article.id}
                  id={`li-${article.id}`}
                  className={`hover:cursor-pointer list-item ${
                    activeArticleId.current === article.id ? 'active' : ''
                  }`}
                  onClick={() => scrollToArticle(article.id.toString())}
                >
                  {article.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
