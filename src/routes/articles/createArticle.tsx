import { Editor } from '@tinymce/tinymce-react'
import { useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

declare const tinymce: any

export default function CreateArticle() {
  const [displayMode, ,] = useOutletContext() as [Boolean, Function, Function]
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const editorRef = useRef<any>(null)
  const [title, setTitle] = useState('')
  const [pinned, setPinned] = useState(false)
  const [published, setPublished] = useState(false)
  const HOST = import.meta.env.VITE_REACT_API_URL

  const handleSave = async () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
      const editor = editorRef.current.getContent()
      try {
        const response = await fetch(`${HOST}/admin/article`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: editor,
            title: title,
            published: published,
            pinned,
          }),
        })
        if (response.status == 403) {
          navigate('/login')
          return
        }
        navigate('/articles')
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <div className='text-3xl mt-2 mb-5 text-left'>Write an article</div>
      <div className='form-control'>
        <span className='label'>Title:</span>
        <input
          type='text'
          value={title}
          placeholder='Title of article'
          className='input'
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className='form-control'>
        <span className='label'>Is Pinned?</span>
        <input
          type='checkbox'
          checked={pinned}
          placeholder='Title of article'
          className='checkbox'
          required
          onChange={(e) => setPinned(e.target.checked)}
        />
      </div>

      <div className='form-control'>
        <span className='label'>Is Published?</span>
        <input
          type='checkbox'
          checked={published}
          placeholder='Title of article'
          className='checkbox'
          required
          onChange={(e) => setPublished(e.target.checked)}
        />
      </div>

      <div className='form-control'>
        {/* <span className='label'>
          Article:
        </span> */}
        <Editor
          key={displayMode + ''}
          tinymceScriptSrc={'/tinymce/tinymce.min.js'}
          onInit={(evt, editor) => {
            evt
            editorRef.current = editor
          }}
          initialValue='<h2><strong>Start writing your article here</strong></h2>'
          init={{
            image_caption: true,
            height: 500,
            width: '100%',
            menubar: true,
            body_class: 'mceBody',
            skin: `${displayMode ? 'oxide-dark' : 'oxide'}`,
            content_css: `${displayMode ? 'dark' : 'transparent'}`,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'image',
              'code',
              'charmap',
              'anchor',
              'searchreplace',
              'visualblocks',
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
              'removeformat | help' +
              ' | image',

            image_title: true,
            automatic_uploads: true,

            file_picker_types: 'image',
            file_picker_callback: function (cb, value, meta) {
              value
              meta
              const input = document.createElement('input')
              input.setAttribute('type', 'file')
              input.setAttribute('accept', 'image/*')

              input.onchange = function (this: HTMLInputElement) {
                const file = this.files ? this.files[0] : null

                const reader = new FileReader()
                reader.onload = function () {
                  const id = 'blobid' + new Date().getTime()
                  const blobCache = tinymce.activeEditor.editorUpload.blobCache
                  const base64 = (reader.result as string).split(',')[1]
                  const blobInfo = blobCache.create(id, file, base64)
                  blobCache.add(blobInfo)

                  cb(blobInfo.blobUri(), { title: file.name })
                }
                reader.readAsDataURL(file)
              }

              input.click()
            },
            content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: ${
              displayMode ? '#1D232A' : 'white'
            } ; color: ${displayMode ? 'white' : 'dark'} ; }`,
          }}
        />
      </div>

      <div className='flex flex-row justify-end gap-x-2'>
        <button
          className='btn btn-outline btn-error mt-2 self-baseline'
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button
          className='btn btn-outline btn-primary mt-2 self-baseline'
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </>
  )
}
