import React from 'react'
import Button from '../Button'
import FavoriteIcon from '@mui/icons-material/Favorite'
import './styles.scss'

const ProductCard = ({onCardClick, image, title, price, description, createdAt}) => (
  <div className='product-card-container'>
    <div className='card-image'>
      <img src={image} alt={title} />
    </div>

    <div className='card-content'>
      {/* <FavoriteIcon color='action' /> */}

      <h6 className='title'>{title}</h6>
      <p className='price'>£{price % 1 === 0 ? price.split('.')[0] : price}</p>

      <span className='description'>
        {description}
      </span>

      <div className='card-actions'>
        <span>Listed on {createdAt.split('T')[0]}</span>
        <Button onClick={onCardClick} text='View Listing' />
      </div>
    </div>
  </div>
)

export default ProductCard
