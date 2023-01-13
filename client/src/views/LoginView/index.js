import './styles.scss'

import { useState } from 'react'
import axios from 'axios'

import { useNavigate, Link } from 'react-router-dom'
import {TextField, Box} from '@mui/material'

import { setToken } from '../../utils/auth.js'
import Button from '../../components/button'

const LoginView = () => {

  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login/', formFields)
      console.log(data)
      console.log(data.token)
      setToken(data.token)
      navigate('/')
    } catch (err) {
      console.log(err)
      setError(err.response.data.detail)
    }
  }

  return (
    <Box className='login-form-container'>
      <form onSubmit={handleSubmit}>
        <h4>Login</h4>
        <div className='formfields'>
        <TextField
          required
          onChange={handleChange}
          name='email'
          label='Email'
          variant='outlined'
          margin='dense'
        />
        <TextField 
          required
          onChange={handleChange}
          name='password'
          label='Password'
          type='password'
          variant='outlined'
          margin='dense'
        />
        </div>
        {error && <small>{error}</small>}
        <Button onClick={handleSubmit} text='Login' type='primary' />
      </form>
      <span>Don't have an account?</span>
      <Link to={'/register'}>Create an account</Link>
    </Box>
  )

}

export default LoginView