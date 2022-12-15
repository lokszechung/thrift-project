import axios from "axios"
import {TextField, Box, FormControl, InputLabel, OutlinedInput, InputAdornment, MenuItem, Input} from '@mui/material'


const ImageUpload = ({ formFields, setFormFields }) => {

  const handleChange = async (e) => {
    try {
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
      const { data } = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData)
      setFormFields({ ...formFields, image: data.secure_url })
    } catch (err) {
      console.log(err)
    }
  }  

  return (
    <FormControl
      margin='dense'
      required
    >
      <InputLabel htmlFor="image">Image</InputLabel>
      <OutlinedInput
        name='image'
        startAdornment={<InputAdornment position="start"> </InputAdornment>}
        type='file'
        label='image'
        onChange={handleChange}
      />
    </FormControl>
  )
} 

export default ImageUpload