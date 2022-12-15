import './styles.scss'

import { useEffect, useState } from 'react'
import axios from 'axios'

import { useNavigate, Link } from 'react-router-dom'
import {TextField, Box} from '@mui/material'

import Button from '../../components/Button'
import { getToken } from '../../utils/auth'
import ProductForm from '../../components/ProductForm'

const SellView = () => {

  const navigate = useNavigate()

  const [ formFields, setFormFields ] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    condition: '',
    subcategory: '',
    image: '',
  })

  const [ errors, setErrors ] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submit clicked')
    try {
      const { data } = await axios.post('/api/listings/', formFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('submit successful', data.id)
      navigate(`/${data.id}`)
    } catch (err) {
      console.log(err)
      setErrors(err.response.data)
    }
  }

  return (
    <ProductForm 
    handleSubmit={handleSubmit} 
    formFields={formFields} 
    setFormFields={setFormFields}
    errors={errors}
    setErrors={setErrors} 
    formName="Post a listing"
    buttonName="Post listing"
    />
  )


}

export default SellView