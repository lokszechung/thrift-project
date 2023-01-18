import React from 'react'
import './styles.scss'
import {useNavigate} from 'react-router-dom'
import {categoryRoutes} from '../../routes'

const CategoryBar = () => {
  const navigate = useNavigate()

  const handleDirectToCategoryView = (e) => {
    const {textContent: path} = e.target
    navigate(`/${path.toLowerCase()}`)
  }

  const categoryBar = categoryRoutes.map((category) => (
    <span onClick={handleDirectToCategoryView} key={category}>
      {category}
    </span>
  ))

  return (
    <div className='categoryBar'>
      <div className='bar-inner'>
        <ul>{categoryBar}</ul>
      </div>
    </div>
  )
}

export default CategoryBar
