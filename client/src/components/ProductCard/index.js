import React from 'react'
import Button from '../button'
import FavoriteIcon from '@mui/icons-material/Favorite'
import './styles.scss'
import moment from 'moment'

const ProductCard = ({onCardClick, image, title, price, description, location, createdAt}) => (
  <div className='product-card-container'>
    <div className='card-image'>
      <img src={image} alt={title} />
    </div>

    <div className='card-content'>
      {/* <FavoriteIcon color='action' /> */}

      <h5 className='title'>{title}</h5>
      
      <div className='price-location-container'>
        <h6 className='price'>£{price % 1 === 0 ? price.split('.')[0] : price}</h6>
        <h6 className='location-span'>{location}</h6>
      </div>
    

      <span className='description'>
        {description}
      </span>

      <div className='card-actions'>
        <span>Listed {moment(createdAt).startOf('second').fromNow()}</span>
        <Button onClick={onCardClick} text='View Listing' />
      </div>
    </div>
  </div>
)

export default ProductCard
