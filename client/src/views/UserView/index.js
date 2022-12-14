import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import {Box} from '@mui/material'
import Button from '../../components/Button'
import './styles.scss';
import ProductFilterBar from '../../components/ProductFilterBar'
import FeaturedItem from '../../components/FeaturedItem'
import axios from 'axios'

const UserView = () => {
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

  // const [user, setUser] = useState([])
  // const { userId } = useParams()

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const { data } = await axios.get(`api/auth/profile/${userId}`)
  //       setUser(data)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  //   getUser()
  // },[])

  // console.log(user)

  const arrFake = [...Array(14).keys()]

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
          src='https://images.unsplash.com/photo-1608176906358-808c28865e2e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2148&q=80'
          alt='profile-img'
        />
        <div className='seller-info-text'>
          <h4>Lok Sze Chung</h4>
          <p>
            <b>Email:</b> kennkenns@hotmail.com
          </p>
          <p>
            <b>Tel:</b> +44 77192 77992
          </p>
          <p>
            <b>Address:</b> Address here please @ London
          </p>
          <Button text='Edit Profile' />
        </div>
      </div>
      <div className='seller-listings'>
        <div className='listings-header'>
          <h6>Listings</h6>
          <Button
            onClick={() => setShowFilterModal(true)}
            text='Filter'
            type='secondary'
          />
        </div>

        <div className='cards-grid'>
          {arrFake.map((i) => (
            <FeaturedItem />
          ))}
        </div>
      </div>
      <ProductFilterBar
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
      />
    </Box>
  );
};

export default UserView;
