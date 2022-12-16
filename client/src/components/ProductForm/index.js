import './styles.scss'

import Button from '../Button'
import {Link} from 'react-router-dom'
import ImageUpload from '../ImageUpload'
import {categoryRoutes} from '../../../src/routes'
import { subcategoriesIndexed } from '../ProductFilterBar/subcategories'

import {TextField, Box, FormControl, InputLabel, OutlinedInput, InputAdornment, MenuItem} from '@mui/material'
import { useEffect, useState } from 'react'

const ProductForm = ({ 
  handleSubmit, 
  formFields, 
  setFormFields, 
  errors, 
  setErrors, 
  formName, 
  buttonName}) => {

  const conditions = [
    {
      value: 1,
      label: 'New',
    },
    {
      value: 2,
      label: 'Excellent',
    },
    {
      value: 3,
      label: 'Very Good',
    },
    {
      value: 4,
      label: 'Good',
    },
    {
      value: 5,
      label: 'Used',
    },
    {
      value: 6,
      label: 'Poor',
    }
  ]
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subcategoryOptions, setSubcategoryOptions] = useState([])

  const handleChange = (e) => {
    if (e.target.name === 'category') {
      setSelectedCategory(e.target.value.toLowerCase().replaceAll(' ',''))
    }
      console.log(`${e.target.name} - ${e.target.value}`)
      setFormFields({ ...formFields, [e.target.name]: e.target.value })
      return setErrors({ ...errors, [e.target.name]: '', message: '' })
  }

  useEffect(() => {
    setSubcategoryOptions(subcategoriesIndexed[selectedCategory])
  }, [selectedCategory])

  useEffect(() => {
    console.log(formFields)
  }, [formFields])

  return (

    <Box className='product-form-container'>
      <form onSubmit={handleSubmit}>
        <h4 className='product-form-title'>{formName}</h4>
        <div className='formfields'>
          <TextField 
            required
            onChange={handleChange}
            name='title'
            label='Title'
            variant='outlined'
            margin='dense'
            value={formFields.title}
          />
          <TextField 
            required
            multiline
            rows={6}
            onChange={handleChange}
            name='description'
            label='Description'
            variant='outlined'
            margin='dense'
            value={formFields.description}
          />
          <TextField 
            required
            onChange={handleChange}
            name='location'
            label='Location'
            variant='outlined'
            margin='dense'
            value={formFields.location}
          />
          <FormControl
            margin='dense'
            required
            onChange={handleChange}
          >
            <InputLabel htmlFor="price">Price</InputLabel>
            <OutlinedInput
              name='price'
              startAdornment={<InputAdornment position="start">£</InputAdornment>}
              label='price'
              value={formFields.price}
            />
          </FormControl>
          <div className='dropdown'>
            <TextField 
              
              select
              onChange={handleChange}
              name='condition'
              label='Condition'
              variant='outlined'
              margin='dense'
              fullWidth
              value={conditions[formFields.condition - 1]?.label}
            >
              {conditions.map(condition => (
                <MenuItem key={condition.value} value={condition.value}>
                  {condition.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className='dropdown'>
            <TextField 
              
              select
              onChange={handleChange}
              name='category'
              label='Category'
              variant='outlined'
              margin='dense'
              fullWidth
            >
              {categoryRoutes.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className='dropdown'>
            <TextField 
              
              select
              onChange={handleChange}
              name='subcategory'
              label='Subcategory'
              variant='outlined'
              margin='dense'
              fullWidth
            >
              {subcategoryOptions ?
                subcategoryOptions.map(subcategory => (
                  <MenuItem key={subcategory.value} value={subcategory.value}>
                    {subcategory.label}
                  </MenuItem>
                ))
                :
                null
              }
            </TextField>
            <ImageUpload 
              formFields={formFields}
              setFormFields={setFormFields}
            />
          </div>
        </div>
        <Button onSubmit={handleSubmit} text={buttonName}/>
      </form>
    </Box>
    
  )


}

export default ProductForm