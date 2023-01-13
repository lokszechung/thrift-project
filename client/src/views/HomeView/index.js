import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './styles.scss'
import {Box} from '@mui/material'
import FeaturedItem from '../../components/featuredItem'

const HomeView = () => {
  const containerPadding = {
    xs: 2,
    md: 10,
    lg: 30,
    xl: 47
  };

  // const featured = [...Array(8).keys()];
  const [listings, setListings] = useState([])
  // const [featured, setFeatured] = useState([])

  useEffect(() => {
    const getListings = async () => {
      try {
        const { data } = await axios.get('/api/listings/')
        setListings(data)
      } catch (err) {
        console.log(err)
      }
    }
    getListings()
  }, [])

  const featured = listings.filter(listing => {
    return listing.featured === true
  })

  console.log(featured)

  return (
    <div className='home-view-container'>
      <div className='jumbotron'>
        <img
          src='../../resources/img/alternative_thrift.png'
          alt='large-img-home'
        />
        <div className='jumboton-text'>
          <h4>Thrift Beloved &amp; Pre-owned.</h4>
          <p>Christmas Sale! Shop now and get 15% off selected products.</p>
        </div>
      </div>

      <Box
        sx={{
          pt: 7,
          pr: {
            ...containerPadding
          },
          pl: {
            ...containerPadding
          },
          pb: 7
        }}
      >
        <div className='featured-list'>
          <h5>Featured Items</h5>
          <div className='featured-list-inner'>
            {featured.map((item) => (
              <FeaturedItem key={item.id} image={item.image} price={item.price} title={item.title} owner={item.owner} id={item.id} />
            ))}
          </div>
        </div>
      </Box>
    </div>
  )
}

export default HomeView
