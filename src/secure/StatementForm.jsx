import axios from 'axios'
import { useState } from 'react'
import Loading from '../components/Loading'

const API_URL = import.meta.env.VITE_APP_API_BASE_URL

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0])
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!selectedFile) {
      alert('Please select a file to upload.')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await axios.post(`${API_URL}/extract`, formData)

      let data = res.data

      // If the response is a string (possibly markdown-wrapped JSON)
      if (typeof data === 'string') {
        data = data.replace('```json', '').replace('```', '')
        data = JSON.parse(data)
      }

      localStorage.setItem('data', JSON.stringify(data))
      window.location.href = '/import-statements'
      setSelectedFile(null)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert(
        'Failed to upload file: ' +
          (error.response?.data?.message || error.message)
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center p-12 sm:bg-white rounded-md sm:shadow-xl sm:border-l-4 sm:border-purple-300'>
      <div className='mx-auto w-full max-w-[550px] sm:bg-white'>
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit} className='py-6 px-9 sm:px-6'>
            <div className='mb-6 pt-4'>
              <label className='mb-5 block font-semibold text-[#07074D] text-center text-3xl'>
                Upload Statements
              </label>
              <div className='mb-8'>
                <input
                  type='file'
                  id='file'
                  className='sr-only'
                  onChange={handleFileChange}
                />
                <label
                  htmlFor='file'
                  className='relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center cursor-pointer'
                >
                  <div>
                    <span className='mb-2 block text-xl font-semibold text-[#07074D]'>
                      Select a file here
                    </span>
                    <span className='inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]'>
                      Browse
                    </span>
                  </div>
                </label>
              </div>

              {selectedFile && (
                <div className='mb-5 rounded-md bg-[#F5F7FB] py-4 px-8'>
                  <div className='flex items-center justify-between'>
                    <span className='truncate pr-3 text-base font-medium text-[#07074D]'>
                      {selectedFile.name}
                    </span>
                    <button
                      type='button'
                      onClick={handleRemoveFile}
                      className='text-[#07074D]'
                    >
                      <svg
                        width='10'
                        height='10'
                        viewBox='0 0 10 10'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z'
                          fill='currentColor'
                        />
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z'
                          fill='currentColor'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type='submit'
                className='hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none cursor-pointer'
              >
                Send File
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default FileUploadForm
