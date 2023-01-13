import './styles.scss'

import { useEffect, useState } from 'react'
import axios from 'axios'

import { useNavigate, useParams } from 'react-router-dom'
// import {TextField, Box} from '@mui/material'

import Button from '../../components/button'
import { getToken } from '../../utils/auth'
import ProductForm from '../../components/productForm'

const SellView = () => {

  const { productId } = useParams()
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

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/listings/${productId}/`)
        console.log(data)
        setFormFields(data)
      } catch (err) {
        console.log(err)
        setErrors(err.response.data)
      }
    }
    getData()
  }, [productId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submit clicked')
    try {
      const { data } = await axios.put(`/api/listings/${productId}/`, formFields, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      console.log('submit successful', data.id)
      navigate(`/listings/${data.id}`)
    } catch (err) {
      console.log(err)
      setErrors(err.response.data)
    }
  }

  const handleDelete = async (e) => {
    try {
      await axios.delete(`/api/listings/${productId}/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      navigate('/myprofile')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='edit-page-container'>
      <ProductForm 
        handleSubmit={handleSubmit} 
        formFields={formFields} 
        setFormFields={setFormFields}
        errors={errors}
        setErrors={setErrors} 
        formName="Edit a listing"
        buttonName="Save changes"
      />
      <Button 
        className='delete-button' 
        text='Delete listing' 
        type='secondary'
        onClick={handleDelete}/>
    </div>
  )


}

export default SellView