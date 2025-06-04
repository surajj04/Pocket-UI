import { useState } from 'react'
import RegistrationSuccessAlert from '../components/SuccessAlert'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/userSlice'
import axios from 'axios'
<<<<<<< HEAD
import InvalidCredentialsAlert from '../components/InvalidAlert'
=======
import ErrorAlert from '../components/ErrorAlert'
>>>>>>> dafafa2 (updated code)

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

export default function Login () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loginSuccess, setLoginSuccess] = useState(false)
<<<<<<< HEAD
  const [invalidAlert, setInvalidAlert] = useState(false)
=======
  const [errorMessage, setErrorMessage] = useState(null)
>>>>>>> dafafa2 (updated code)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const res = await axios.post(`${API_KEY}/login`, {
        email: formData.email,
        password: formData.password
      })
<<<<<<< HEAD
      if (res.data.userId !== undefined) {
=======

      if (res?.data) {
>>>>>>> dafafa2 (updated code)
        setLoginSuccess(true)
        dispatch(login(res.data))
        navigate('/')
      } else {
<<<<<<< HEAD
        setInvalidAlert(true)
        return
      }
    } catch (error) {
      console.log(error)
      setInvalidAlert(true) // Optionally handle error here
=======
      }
    } catch (error) {
      console.error(error)
      if (error.response?.data === 'Invalid email or password') {
        setErrorMessage('Invalid email or password')
      } else {
        setErrorMessage('Something went wrong. Please try again.')
      }
>>>>>>> dafafa2 (updated code)
    }
  }

  return (
<<<<<<< HEAD
    <>
      <div className=''>
        {loginSuccess && (
          <RegistrationSuccessAlert
            message1='Login Successful!'
            message2='You can now access your account.'
          />
        )}

        {invalidAlert && (
          <InvalidCredentialsAlert
            message1='Invalid credentials!'
            message2='Please check your username and password and try again.'
          />
        )}
      </div>

      <div className='flex items-center justify-center min-h-[80vh] max-sm:my-10'>
        <div className='w-full max-w-md'>
          <div className='bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 transition-all duration-500 hover:shadow-xl'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Welcome Back
              </h2>
              <p className='text-gray-500 mt-2'>Please sign in to continue</p>
=======
    <div className='flex items-center justify-center min-h-[80vh]'>
      {loginSuccess && (
        <RegistrationSuccessAlert
          message1='Login Successful!'
          message2='You can now access your account.'
        />
      )}
      {errorMessage && (
        <ErrorAlert message1='Login Failed' message2={errorMessage} />
      )}
      <div className='w-full max-w-md'>
        <div className='bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 transition-all duration-500 hover:shadow-xl'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Welcome Back
            </h2>
            <p className='text-gray-500 mt-2'>Please sign in to continue</p>
          </div>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='relative'>
              <label
                className='block text-gray-700 text-sm font-medium mb-2'
                htmlFor='email'
              >
                Email Address
              </label>
              <div className='relative'>
                <i className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50'
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Enter your email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
>>>>>>> dafafa2 (updated code)
            </div>

            <form className='space-y-6' onSubmit={handleSubmit}>
              <div className='relative'>
                <label
                  className='block text-gray-700 text-sm font-medium mb-2'
                  htmlFor='email'
                >
                  Email Address
                </label>
                <div className='relative'>
                  <i className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50'
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Enter your email'
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='relative'>
                <label
                  className='block text-gray-700 text-sm font-medium mb-2'
                  htmlFor='password'
                >
                  Password
                </label>
                <div className='relative'>
                  <i className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50'
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    placeholder='Enter your password'
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <a
                  href='#'
                  className='text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200'
                >
                  Forgot password?
                </a>
              </div>

              <button
                type='submit'
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
              >
                Sign In
              </button>

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white/80 text-gray-500'>
                    Or continue with
                  </span>
                </div>
              </div>
            </form>

            <p className='text-center text-sm text-gray-600'>
              Don't have an account? &ensp;
              <Link
                to='/register'
                className='text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
