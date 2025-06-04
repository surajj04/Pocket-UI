import axios from 'axios'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../store/userSlice'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

// Inline components
const SuccessAlert = ({ message, onClose }) => (
  <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4'>
    <span className='block sm:inline'>{message}</span>
    <span
      className='absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer'
      onClick={onClose}
    >
      <svg
        className='fill-current h-6 w-6 text-green-500'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
      >
        <title>Close</title>
        <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
      </svg>
    </span>
  </div>
)

const ErrorAlert = ({ message, onClose }) => (
  <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4'>
    <span className='block sm:inline'>{message}</span>
    <span
      className='absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer'
      onClick={onClose}
    >
      <svg
        className='fill-current h-6 w-6 text-red-500'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
      >
        <title>Close</title>
        <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
      </svg>
    </span>
  </div>
)

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  }

  return (
    <div
      className={`inline-block ${sizes[size]} animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role='status'
    >
      <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
        Loading...
      </span>
    </div>
  )
}

const GenderDropdown = ({ value, onChange }) => {
  const options = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-Binary' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ]

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default function ProfilePage () {
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)
  const [invalidAlert, setInvalidAlert] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Updated location data to match backend format
  const countries = [
    { value: '', label: 'Select Country' },
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Australia', label: 'Australia' },
    { value: 'India', label: 'India' }
  ]

  const statesByCountry = {
    'United States': [
      { value: '', label: 'Select State' },
      { value: 'California', label: 'California' },
      { value: 'Texas', label: 'Texas' },
      { value: 'Florida', label: 'Florida' },
      { value: 'New York', label: 'New York' }
    ],
    Canada: [
      { value: '', label: 'Select Province' },
      { value: 'Ontario', label: 'Ontario' },
      { value: 'Quebec', label: 'Quebec' },
      { value: 'British Columbia', label: 'British Columbia' }
    ],
    India: [
      { value: '', label: 'Select State' },
      { value: 'Maharashtra', label: 'Maharashtra' },
      { value: 'Delhi', label: 'Delhi' },
      { value: 'Karnataka', label: 'Karnataka' },
      { value: 'Maharastra', label: 'Maharastra' } // Match backend spelling
    ]
  }

  const citiesByState = {
    California: [
      { value: '', label: 'Select City' },
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'San Francisco', label: 'San Francisco' },
      { value: 'San Diego', label: 'San Diego' }
    ],
    Maharashtra: [
      { value: '', label: 'Select City' },
      { value: 'Mumbai', label: 'Mumbai' },
      { value: 'Pune', label: 'Pune' }
    ],
    Maharastra: [
      // Match backend spelling
      { value: '', label: 'Select City' },
      { value: 'Pune', label: 'Pune' },
      { value: 'Mumbai', label: 'Mumbai' }
    ]
  }

  const formatDate = isoDate => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    return date.toISOString().split('T')[0]
  }

  // Initialize form data
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    dob: '',
    gender: '',
    phoneNo: '',
    country: '',
    state: '',
    city: ''
  })

  // Sync form with Redux user
  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.userId || '',
        name: user.name || '',
        email: user.email || '',
        dob: formatDate(user.dob),
        gender: user.gender || '',
        phoneNo: user.phoneNo || '', // Handle null
        country: user.country || '',
        state: user.state || '',
        city: user.city || ''
      })
    }
  }, [user])

  // Handle form input
  const handleChange = e => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))

    // Reset dependent fields when country changes
    if (id === 'country') {
      setFormData(prev => ({
        ...prev,
        country: value,
        state: '',
        city: ''
      }))
    } else if (id === 'state') {
      setFormData(prev => ({
        ...prev,
        state: value,
        city: ''
      }))
    }

    // Clear error when field is edited
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  const handlePasswordChange = e => {
    const { id, value } = e.target
    setPasswordForm(prev => ({ ...prev, [id]: value }))
    if (passwordErrors[id]) setPasswordErrors(prev => ({ ...prev, [id]: '' }))
  }

  const handlePhoneChange = value => {
    setFormData(prev => ({ ...prev, phoneNo: value || '' }))
    if (errors.phoneNo) setErrors(prev => ({ ...prev, phoneNo: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email address'
    if (formData.dob) {
      const dobDate = new Date(formData.dob)
      const today = new Date()
      if (dobDate > today) newErrors.dob = 'Date cannot be in future'
    }
    // More flexible phone validation
    if (formData.phoneNo && !/^\+?[\d\s()-]{7,}$/.test(formData.phoneNo))
      newErrors.phoneNo = 'Invalid phone number'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}
    if (!passwordForm.currentPassword)
      newErrors.currentPassword = 'Current password is required'
    if (!passwordForm.newPassword)
      newErrors.newPassword = 'New password is required'
    else if (passwordForm.newPassword.length < 6)
      newErrors.newPassword = 'Password must be at least 6 characters'
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // FIXED: Profile update handler with proper alert handling
  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) return

    // Reset alerts before making the request
    setSuccessAlert(false)
    setInvalidAlert(false)
    setIsUpdating(true)

    try {
      const payload = {
        userId: formData.userId,
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob ? new Date(formData.dob).toISOString() : null,
        phoneNo: formData.phoneNo || null,
        country: formData.country,
        state: formData.state,
        city: formData.city
      }

      // FIXED: Correct API endpoint path
      const response = await axios.put(`${API_KEY}/updateProfile`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })

      const updatedUser = response.data
      localStorage.setItem('userDetail', JSON.stringify(updatedUser))
      dispatch(fetchData(user.token))

      if (response.status === 200) {
        setSuccessAlert(true)
        setTimeout(() => setSuccessAlert(false), 5000)
      } else {
        setInvalidAlert(true)
        throw new Error('Password update failed')
      }
    } catch (error) {
      console.error('Error updating profile:', error)

      let message = 'Error updating profile. Please try again.'
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.response?.statusText) {
        message = error.response.statusText
      }

      setErrors({ server: message })
      setInvalidAlert(true)
      setTimeout(() => setInvalidAlert(false), 5000)
    } finally {
      setIsUpdating(false)
    }
  }

  // FIXED: Password update handler with proper alert handling
  const handlePasswordSubmit = async e => {
    e.preventDefault()

    if (!validatePasswordForm()) return

    // Reset alerts before sending request
    setPasswordSuccess(false)
    setPasswordError(false)
    setIsUpdatingPassword(true)

    try {
      const payload = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }

      // FIXED: Correct API endpoint path
      const response = await axios.put(`${API_KEY}/updatePassword`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })

      // Check for successful response
      if (response.status === 200) {
        setPasswordSuccess(true)
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => setPasswordSuccess(false), 5000)
      } else {
        throw new Error('Password update failed')
      }
    } catch (error) {
      console.error('Error changing password:', error)

      let message = 'Error changing password. Please try again.'
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.response?.statusText) {
        message = error.response.statusText
      } else if (error.message) {
        message = error.message
      }

      setPasswordErrors({ server: message })
      setPasswordError(true)
      setTimeout(() => setPasswordError(false), 5000)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (!user) {
    return (
      <div className='flex justify-center items-center h-64'>
        <LoadingSpinner size='lg' />
        <span className='ml-3 text-gray-600'>Loading user data...</span>
      </div>
    )
  }

  // Get states and cities based on selections
  const states = statesByCountry[formData.country] || [
    { value: '', label: 'Select State' }
  ]
  const cities = citiesByState[formData.state] || [
    { value: '', label: 'Select City' }
  ]

  return (
    <div className='mx-auto px-4 max-sm:px-0 sm:px-6 lg:px-8 pb-10'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl md:text-4xl font-bold text-violet-900 mb-6 mt-5 max-sm:text-center'>
          Your Financial Profile
        </h1>

        {/* Success Alert */}
        {successAlert && (
          <div className='mb-6'>
            <SuccessAlert
              message='Profile updated successfully!'
              onClose={() => setSuccessAlert(false)}
            />
          </div>
        )}

        {/* Error Alert */}
        {invalidAlert && (
          <div className='mb-6'>
            <ErrorAlert
              message='Failed to update profile. Please try again.'
              onClose={() => setInvalidAlert(false)}
            />
          </div>
        )}

        <div className='grid grid-cols-1 gap-8'>
          {/* Personal Information Section */}
          <div className='p-6 rounded-lg bg-white shadow-lg border border-gray-100'>
            <h2 className='text-xl font-semibold mb-6 pb-2 border-b border-gray-200'>
              Personal Information
            </h2>

            <form className='space-y-6' onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium mb-1 text-gray-700'
                  >
                    Full Name *
                  </label>
                  <input
                    id='name'
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 p-3 w-full border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  />
                  {errors.name && (
                    <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium mb-1 text-gray-700'
                  >
                    Email Address *
                  </label>
                  <input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 p-3 w-full border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  />
                  {errors.email && (
                    <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <label
                    htmlFor='dob'
                    className='block text-sm font-medium mb-1 text-gray-700'
                  >
                    Date of Birth
                  </label>
                  <input
                    id='dob'
                    type='date'
                    value={formData.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`mt-1 p-3 w-full border ${
                      errors.dob ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.dob && (
                    <p className='mt-1 text-sm text-red-600'>{errors.dob}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1 text-gray-700'>
                    Gender
                  </label>
                  <GenderDropdown
                    value={formData.gender}
                    onChange={value =>
                      setFormData(prev => ({ ...prev, gender: value }))
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor='phoneNo'
                    className='block text-sm font-medium mb-1 text-gray-700'
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    international
                    defaultCountry='IN'
                    value={formData.phoneNo}
                    onChange={handlePhoneChange}
                    className={`mt-1 ${errors.phoneNo ? 'border-red-500' : ''}`}
                    inputClassName={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phoneNo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phoneNo && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.phoneNo}
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <label
                    htmlFor='country'
                    className='block text-sm font-medium mb-1 text-gray-700'
                  >
                    Country
                  </label>
                  <select
                    id='country'
                    value={formData.country}
                    onChange={handleChange}
                    className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='state'
                    className='block text-sm font-medium mb-1 text-gray-700'
                  >
                    State/Province
                  </label>
                  <select
                    id='state'
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!formData.country}
                    className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50'
                  >
                    {states.map(state => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='city'
                    className='block text-sm font-medium mb-1 text-gray-700'
                  >
                    City
                  </label>
                  <select
                    id='city'
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!formData.state}
                    className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50'
                  >
                    {cities.map(city => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='pt-4'>
                <button
                  type='submit'
                  disabled={isUpdating}
                  className='w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-300 flex items-center justify-center disabled:opacity-70'
                >
                  {isUpdating ? (
                    <>
                      <LoadingSpinner size='sm' className='mr-2' />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Password Change Section */}
          <div className='p-6 rounded-lg bg-white shadow-lg border border-gray-100'>
            <h2 className='text-xl font-semibold mb-6 pb-2 border-b border-gray-200'>
              Change Password
            </h2>

            {/* Password Alerts */}
            {passwordSuccess && (
              <div className='mb-6'>
                <SuccessAlert
                  message='Password changed successfully!'
                  onClose={() => setPasswordSuccess(false)}
                />
              </div>
            )}

            {passwordError && (
              <div className='mb-6'>
                <ErrorAlert
                  message='Failed to change password. Please try again.'
                  onClose={() => setPasswordError(false)}
                />
              </div>
            )}

            <form className='space-y-6' onSubmit={handlePasswordSubmit}>
              <div>
                <label
                  htmlFor='currentPassword'
                  className='block text-sm font-medium mb-1 text-gray-700'
                >
                  Current Password *
                </label>
                <input
                  id='currentPassword'
                  type='password'
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={`mt-1 p-3 w-full border ${
                    passwordErrors.currentPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder='Enter your current password'
                />
                {passwordErrors.currentPassword && (
                  <p className='mt-1 text-sm text-red-600'>
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='newPassword'
                    className='block text-sm font-medium mb-1 text-gray-700'
                  >
                    New Password *
                  </label>
                  <input
                    id='newPassword'
                    type='password'
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={`mt-1 p-3 w-full border ${
                      passwordErrors.newPassword
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder='At least 6 characters'
                  />
                  {passwordErrors.newPassword && (
                    <p className='mt-1 text-sm text-red-600'>
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium mb-1 text-gray-700'
                  >
                    Confirm New Password *
                  </label>
                  <input
                    id='confirmPassword'
                    type='password'
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`mt-1 p-3 w-full border ${
                      passwordErrors.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder='Re-enter your new password'
                  />
                  {passwordErrors.confirmPassword && (
                    <p className='mt-1 text-sm text-red-600'>
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className='pt-4'>
                <button
                  type='submit'
                  disabled={isUpdatingPassword}
                  className='w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-300 flex items-center justify-center disabled:opacity-70'
                >
                  {isUpdatingPassword ? (
                    <>
                      <LoadingSpinner size='sm' className='mr-2' />
                      Updating Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
