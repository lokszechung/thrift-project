import './styles.scss'

import { useEffect, useState } from 'react'
import axios from 'axios'

import { useNavigate, Link } from 'react-router-dom'
import {TextField, Box} from '@mui/material'

import Button from '../../components/button'

const RegisterView = () => {

  const navigate = useNavigate()

  const [formFields, setFormFields] = useState({
    first_name: '',
    last_name: '',
    email: '',
    telephone: '',
    password: '',
    password_confirmation: '',
  })

  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/auth/register/', formFields)
      navigate('/login')
    } catch (err) {
      console.log(err.response.data)
      setError(err.response.data)
    }
  }

  const handleChange = (e) => {
    const updatedFormFields = {
      ...formFields,
      [e.target.name]: e.target.value,
    }
    setFormFields(updatedFormFields)

    if (error) setError(null)
  }  

  return(
    <Box className='register-form-container'>
      <form onSubmit={handleSubmit}>
        <h4 className='register-title'>Create an account</h4>
        <div className='formfields'>
          <TextField 
            required
            onChange={handleChange}
            name='first_name'
            label='First name'
            variant='outlined'
            margin='dense'
          />
          {error && <small>{error.first_name?.[0]}</small>}
          <TextField 
            required
            onChange={handleChange}
            name='last_name'
            label='Last name'
            variant='outlined'
            margin='dense'
          />
          {error && <small>{error.last_name?.[0]}</small>}
          <TextField 
            required
            onChange={handleChange}
            name='username'
            label='Username'
            variant='outlined'
            margin='dense'
          />
          {error && <small>{error.username?.[0]}</small>}
          <TextField 
            required
            onChange={handleChange}
            name='email'
            label='Email'
            type='email'
            variant='outlined'
            margin='dense'
          />
          {error && <small>{error.email?.[0]}</small>}
          <TextField 
            required
            onChange={handleChange}
            name='telephone'
            label='Telephone'
            variant='outlined'
            margin='dense'
          />
          {error && <small>{error.telephone?.[0]}</small>}
          <TextField 
            required
            onChange={handleChange}
            name='password'
            label='Password'
            type='password'
            variant='outlined'
            margin='dense'
          />
          {error && <small>{error.password?.[0] || error.non_field_errors?.[0]}</small>}
          <TextField 
            required
            onChange={handleChange}
            name='password_confirmation'
            label='Confirm Password'
            type='password'
            variant='outlined'
            margin='dense'
          />
          {error && <small>{error.password_confirmation?.[0]}</small>}
        </div>
        <Button onClick={handleSubmit} text='Register' type='primary' />
      </form>
      <span>Already have an account?</span>
      <Link to={'/login'}>Log in</Link>
    </Box>
  )
}

export default RegisterView
