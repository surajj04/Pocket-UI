import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import RegistrationSuccessAlert from '../components/SuccessAlert'
import InvalidCredentialsAlert from '../components/InvalidAlert'
=======
import RegistrationSuccessAlert from '../components/RegistrationSuccessAlert'
import ErrorAlert from '../components/ErrorAlert'
>>>>>>> dafafa2 (updated code)

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

const RegistrationForm = () => {
  const navigate = useNavigate()
<<<<<<< HEAD
=======

>>>>>>> dafafa2 (updated code)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: '',
    country: '',
    state: '',
    city: ''
  })

  const [stateOptions, setStateOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
<<<<<<< HEAD
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [showAgeErrorAlert, setShowAgeErrorAlert] = useState(false)
=======
  const [emailError, setEmailError] = useState('')
  const [ageError, setAgeError] = useState('')
>>>>>>> dafafa2 (updated code)

  const stateCityMap = {
    India: {
      states: [
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal'
      ],
      cities: {
        'Andhra Pradesh': [
          'Visakhapatnam',
          'Vijayawada',
          'Guntur',
          'Kurnool',
          'Rajahmundry',
          'Nellore',
          'Tirupati',
          'Chittoor'
        ],
        'Arunachal Pradesh': [
          'Itanagar',
          'Tawang',
          'Ziro',
          'Bomdila',
          'Tezpur',
          'Naharlagun',
          'Pasighat'
        ],
        Assam: [
          'Guwahati',
          'Dibrugarh',
          'Jorhat',
          'Nagaon',
          'Silchar',
          'Tezpur',
          'Dhulia',
          'Tinsukia',
          'Jorhat'
        ],
        Bihar: [
          'Patna',
          'Gaya',
          'Bhagalpur',
          'Muzaffarpur',
          'Munger',
          'Darbhanga',
          'Purnia',
          'Begusarai',
          'Chapra'
        ],
        Chhattisgarh: [
          'Raipur',
          'Bilaspur',
          'Durg',
          'Korba',
          'Jagdalpur',
          'Raigarh',
          'Rajnandgaon'
        ],
        Goa: [
          'Panaji',
          'Vasco da Gama',
          'Margao',
          'Mapusa',
          'Pernem',
          'Bicholim',
          'Cortalim'
        ],
        Gujarat: [
          'Ahmedabad',
          'Surat',
          'Vadodara',
          'Rajkot',
          'Bhavnagar',
          'Jamnagar',
          'Junagadh',
          'Anand',
          'Gandhinagar',
          'Vapi'
        ],
        Haryana: [
          'Chandigarh',
          'Gurgaon',
          'Faridabad',
          'Hisar',
          'Ambala',
          'Rohtak',
          'Panipat',
          'Sonipat',
          'Karnal'
        ],
        'Himachal Pradesh': [
          'Shimla',
          'Manali',
          'Kullu',
          'Dharamshala',
          'Solan',
          'Kangra',
          'Mandi',
          'Hamirpur'
        ],
        Jharkhand: [
          'Ranchi',
          'Jamshedpur',
          'Dhanbad',
          'Bokaro',
          'Hazaribagh',
          'Giridih',
          'Deoghar',
          'Dumka',
          'Chaibasa'
        ],
        Karnataka: [
          'Bengaluru',
          'Mysore',
          'Hubli',
          'Mangalore',
          'Tumkur',
          'Belagavi',
          'Davangere',
          'Bellary',
          'Mandya',
          'Chikmagalur'
        ],
        Kerala: [
          'Thiruvananthapuram',
          'Kochi',
          'Kozhikode',
          'Kollam',
          'Thrissur',
          'Kottayam',
          'Alappuzha',
          'Pathanamthitta',
          'Palakkad'
        ],
        'Madhya Pradesh': [
          'Bhopal',
          'Indore',
          'Gwalior',
          'Ujjain',
          'Jabalpur',
          'Sagar',
          'Satna',
          'Ratlam',
          'Mandsaur',
          'Dewas'
        ],
        Maharashtra: [
          'Mumbai',
          'Pune',
          'Nagpur',
          'Nashik',
          'Aurangabad',
          'Thane',
          'Nanded',
          'Solapur',
          'Kolhapur',
          'Jalgaon'
        ],
        Manipur: [
          'Imphal',
          'Thoubal',
          'Kakching',
          'Chandel',
          'Ukhrul',
          'Senapati',
          'Bishnupur'
        ],
        Meghalaya: [
          'Shillong',
          'Tura',
          'Jowai',
          'Nongstoin',
          'Williamnagar',
          'Mawlai'
        ],
        Mizoram: [
          'Aizawl',
          'Lunglei',
          'Champhai',
          'Kolasib',
          'Mamit',
          'Serchhip'
        ],
        Nagaland: [
          'Kohima',
          'Dimapur',
          'Mokokchung',
          'Mon',
          'Wokha',
          'Zunheboto'
        ],
        Odisha: [
          'Bhubaneswar',
          'Cuttack',
          'Rourkela',
          'Berhampur',
          'Sambalpur',
          'Balasore',
          'Puri',
          'Angul',
          'Rayagada'
        ],
        Punjab: [
          'Amritsar',
          'Ludhiana',
          'Jalandhar',
          'Patiala',
          'Mohali',
          'Bathinda',
          'Moga',
          'Hoshiarpur',
          'Pathankot'
        ],
        Rajasthan: [
          'Jaipur',
          'Udaipur',
          'Jodhpur',
          'Kota',
          'Ajmer',
          'Bikaner',
          'Alwar',
          'Nagaur',
          'Sikar',
          'Pali'
        ],
        Sikkim: ['Gangtok', 'Jorethang', 'Namchi', 'Mangan', 'Rangpo'],
        'Tamil Nadu': [
          'Chennai',
          'Coimbatore',
          'Madurai',
          'Salem',
          'Tiruchirappalli',
          'Erode',
          'Vellore',
          'Dindigul',
          'Tirunelveli'
        ],
        Telangana: [
          'Hyderabad',
          'Warangal',
          'Karimnagar',
          'Khammam',
          'Nizamabad',
          'Mahabubnagar',
          'Nalgonda'
        ],
        Tripura: ['Agartala', 'Udaipur', 'Dharmanagar', 'Sabroom'],
        'Uttar Pradesh': [
          'Lucknow',
          'Kanpur',
          'Agra',
          'Varanasi',
          'Ghaziabad',
          'Meerut',
          'Allahabad',
          'Mathura',
          'Aligarh',
          'Bareilly'
        ],
        Uttarakhand: [
          'Dehradun',
          'Haridwar',
          'Nainital',
          'Rishikesh',
          'Roorkee',
          'Haldwani',
          'Kashipur'
        ],
        'West Bengal': [
          'Kolkata',
          'Darjeeling',
          'Siliguri',
          'Durgapur',
          'Asansol',
          'Howrah',
          'Kolar',
          'Kanchrapara',
          'Malda'
        ]
      }
    }
  }

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const calculateAge = dob => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCountryChange = e => {
    const country = e.target.value
    setFormData(prev => ({
      ...prev,
      country,
      state: '',
      city: ''
    }))

    if (country === 'India') {
      setStateOptions(stateCityMap['India'].states)
    } else {
      setStateOptions([])
      setCityOptions([])
    }
  }

  const handleStateChange = e => {
    const state = e.target.value
    setFormData(prev => ({
      ...prev,
      state,
      city: ''
    }))

    if (state) {
      setCityOptions(stateCityMap['India'].cities[state])
    } else {
      setCityOptions([])
    }
  }

<<<<<<< HEAD
  const calculateAge = dob => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()

    // If the birthday hasn't occurred yet this year, subtract 1 from age
    if (
      month < birthDate.getMonth() ||
      (month === birthDate.getMonth() && day < birthDate.getDate())
    ) {
      age -= 1
    }
    return age
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const age = calculateAge(formData.dob)

    // Validate if the user is 18 or older
    if (age < 18) {
      setShowAgeErrorAlert(true)
      setTimeout(() => {
        setShowAgeErrorAlert(false)
      }, 5000) // Hide age error alert after 5 seconds
      return
    }

    if (formData.password === formData.confirmPassword) {
      try {
        const res = await axios.post(`${API_KEY}/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          dob: formData.dob,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          token: ''
        })

        if (res.status === 200) {
          setShowSuccessAlert(true)
          setTimeout(() => {
            setShowSuccessAlert(false)
            setFormData({
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              gender: '',
              dob: '',
              country: '',
              state: '',
              city: ''
            }) // Reset form after success
            navigate('/login') // Navigate to login page after success
          }, 2000) // Hide success alert after 5 seconds
        } else {
          setShowErrorAlert(true)
          setTimeout(() => {
            setShowErrorAlert(false)
          }, 2000) // Hide error alert after 5 seconds
        }
      } catch (error) {
        console.error(error)
        setShowErrorAlert(true)
        setTimeout(() => {
          setShowErrorAlert(false)
        }, 5000) // Hide error alert after 5 seconds
      }
=======
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()

    // Email validation
    if (!isValidEmail(formData.email)) {
      setEmailError('Please enter a valid email address.')
      return
>>>>>>> dafafa2 (updated code)
    } else {
      setEmailError('')
    }

    // Age validation
    const age = calculateAge(formData.dob)
    if (age < 16) {
      setAgeError('You must be at least 16 years old to register.')
      return
    } else {
      setAgeError('')
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.')
      return
    }

    try {
      const res = await axios.post(`${API_KEY}/register`, {
        ...formData,
        token: ''
      })

      if (res.status === 201) {
        setLoginSuccess(true)
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message)
      } else {
        console.error(error)
        setErrorMessage('An unexpected error occurred. Please try again.')
      }
    }
  }

  return (
    <div className='flex items-center justify-center my-5'>
      {loginSuccess && (
        <RegistrationSuccessAlert
          message1='Registration Successful!'
          message2='You can now access your account.'
        />
      )}
      {errorMessage && (
        <ErrorAlert message1='Registration Failed' message2={errorMessage} />
      )}
      <div className='w-full max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-2xl space-y-8'>
        <h2 className='text-3xl font-bold text-blue-600 mb-4 text-center'>
          Create an Account
        </h2>
        <p className='text-gray-500 mb-6 text-center'>
          Fill in the details below to register
        </p>

        {showSuccessAlert && (
          <RegistrationSuccessAlert
            message1={'Registration Successful!'}
            message2={'You can now log in to your account.'}
          />
        )}

        {showErrorAlert && (
          <InvalidCredentialsAlert
            message1={'Error!'}
            message2={
              'There was an issue with your registration. Please try again.'
            }
          />
        )}

        {showAgeErrorAlert && (
          <InvalidCredentialsAlert
            message1={'Error!'}
            message2={'You must be at least 18 years old to register.'}
          />
        )}

        <form
          onSubmit={handleSubmit}
          className='sm:grid sm:grid-cols-2 gap-6 space-y-4'
        >
          <div className='relative'>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Full Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your name'
              className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            />
          </div>

          <div className='relative'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                emailError ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 ${
                emailError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              } focus:border-transparent`}
              required
            />
            {emailError && (
              <p className='text-red-500 text-sm mt-1'>{emailError}</p>
            )}
          </div>

          <div className='relative'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter your password'
              className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            />
          </div>

          <div className='relative'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700'
            >
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Confirm your password'
              className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            />
          </div>

          <div className='relative'>
            <label
              htmlFor='gender'
              className='block text-sm font-medium text-gray-700'
            >
              Gender
            </label>
            <select
              id='gender'
              name='gender'
              value={formData.gender}
              onChange={handleChange}
              className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            >
              <option value=''>Select Gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
            </select>
          </div>

          <div className='relative'>
            <label
              htmlFor='dob'
              className='block text-sm font-medium text-gray-700'
            >
              Date of Birth
            </label>
            <input
              type='date'
              id='dob'
              name='dob'
              value={formData.dob}
              onChange={handleChange}
              className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            />
            {ageError && (
              <p className='text-red-500 text-sm mt-1'>{ageError}</p>
            )}
          </div>

          <div className='relative'>
            <label
              htmlFor='country'
              className='block text-sm font-medium text-gray-700'
            >
              Country
            </label>
            <select
              id='country'
              name='country'
              value={formData.country}
              onChange={handleCountryChange}
              className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            >
              <option value=''>Select Country</option>
              <option value='India'>India</option>
              {/* You can add other countries here */}
            </select>
          </div>

<<<<<<< HEAD
          {/* State */}
          <div className='relative'>
            <label
              htmlFor='state'
              className='block text-sm font-medium text-gray-700'
            >
              State
            </label>
            <select
              id='state'
              name='state'
              value={formData.state}
              onChange={handleStateChange}
              className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            >
              <option value=''>Select State</option>
              {stateOptions.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className='relative'>
            <label
              htmlFor='city'
              className='block text-sm font-medium text-gray-700'
            >
              City
            </label>
            <select
              id='city'
              name='city'
              value={formData.city}
              onChange={handleChange}
              className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            >
              <option value=''>Select City</option>
              {cityOptions.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className='mt-6'>
=======
          {formData.country === 'India' && (
            <div className='relative'>
              <label
                htmlFor='state'
                className='block text-sm font-medium text-gray-700'
              >
                State
              </label>
              <select
                id='state'
                name='state'
                value={formData.state}
                onChange={handleStateChange}
                className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              >
                <option value=''>Select State</option>
                {stateOptions.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.state && (
            <div className='relative'>
              <label
                htmlFor='city'
                className='block text-sm font-medium text-gray-700'
              >
                City
              </label>
              <select
                id='city'
                name='city'
                value={formData.city}
                onChange={handleChange}
                className='mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              >
                <option value=''>Select City</option>
                {cityOptions.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className='col-span-2'>
>>>>>>> dafafa2 (updated code)
            <button
              type='submit'
              className='w-full py-3 px-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700'
            >
              Register
            </button>
          </div>

          <p className='text-center text-sm text-gray-500 mt-4'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600'>
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm
