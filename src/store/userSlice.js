import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_APP_API_BASE_URL

export const fetchData = createAsyncThunk(
  'user/fetchData',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_KEY}/userDetail/${token}`)
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching data')
    }
  }
)

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  status: 'idle',
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    logout: state => {
      state.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('data')
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchData.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
