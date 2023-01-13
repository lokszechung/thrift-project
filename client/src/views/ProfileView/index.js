import React, {useEffect, useState} from 'react'
import {Box} from '@mui/material'
import Button from '../../components/button'
import './styles.scss';
import ProductFilterBar from '../../components/productFilterBar'
import FeaturedItem from '../../components/featuredItem'
import axios from 'axios'
import moment from 'moment'

import { getToken, handleLogout } from '../../utils/auth'
import { useNavigate } from 'react-router-dom';

const UserView = () => {

  const navigate = useNavigate()

  const [showFilterModal, setShowFilterModal] = useState(false)

  const containerPadding = {
    xs: 3,
    md: 6,
    lg: 15,
    xl: 33
  };

  const applyFilters = () => {
    setShowFilterModal(false)
  }

  const [user, setUser] = useState([])
  const [listings, setListings] = useState([])

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/myprofile/',{
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setUser(data)
      } catch (err) {
        console.log(err)
      }
    }
    getUser()
  },[])

  console.log(user)
  // console.log(user.listings)

  useEffect(() => {
    console.log(user.listings)
    setListings(user.listings)
  }, [user])

  // const arrFake = [...Array(14).keys()]

  return (
    <Box
      sx={{
        pt: 7,
        pb: 5,
        pr: {...containerPadding},
        pl: {...containerPadding}
      }}
    >
      <div className='seller-header-info'>
        <img
          src={user.image ? user.image : '../../resources/img/empty_image.jpeg'}
          alt='profile-img'
        />
        <div className='seller-info-text'>
          <div className='log-out-container'>
            <h4>{user.first_name} {user.last_name}</h4>
            <Button
              onClick={() => handleLogout(navigate)}
              text='Log out'
            />
          </div>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Tel:</b> {user.telephone}
          </p>
          <p>
            <b>Posting since:</b> {user ? moment(user.date_joined).startOf('second').fromNow() : null}
          </p>
          {/* <Button text='Edit Profile' /> */}
        </div>
      </div>
      <div className='seller-listings'>
        <div className='listings-header'>
          <h6>Listings</h6>
          {/* <Button
            onClick={() => setShowFilterModal(true)}
            text='Filter'
            type='secondary'
          /> */}
        </div>

        <div className='cards-grid'>
          {listings ? listings.map((item) => (
            <FeaturedItem key={item.id} image={item.image} price={item.price} title={item.title} owner={item.owner} id={item.id} />
          )) : null}
        </div>
      </div>
      {/* <productFilterBar
        // setSelectedSubCategory={setSelectedSubCategory}
        // selectedSubCategory={selectedSubCategory}
        sellerCategories={[
          'Appliances',
          'Mobile Phones & Communication',
          'Computing, Tablets & Networking',
          'Sound & Vision',
          'Video Games & Consoles',
          'Cameras & Photography',
          'Televisions',
          'Smartwatches',
          'GPS & In-car Technology',
          'Smart Home & Surveillance',
          'Heating, Cooling & Air'
        ]}
        isModal
        showFilterModal={showFilterModal}
        applyFilters={applyFilters}
      /> */}
    </Box>
  )
}

export default UserView
