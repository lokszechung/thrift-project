import { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {Link} from 'react-router-dom'
import Button from '../../components/Button'
import './styles.scss'
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import {Box} from '@mui/material'
// import ReactMapGL from 'react-map-gl'
import axios from 'axios'
// import {useNavigate} from 'react-router-dom'


const ProductView = () => {
  // const carousel = useRef()
  // const noOfImgs = 4;
  // const [currentImgIndex, setCurrentImgIndex] = useState(1)

  // const navigate = useNavigate()

  const { productId } = useParams()
  const [listing, setListing] = useState()
  const [users, setUsers] = useState()

  useEffect(() => {
    const getSingleListing = async () => {
      try {
        const { data } = await axios.get(`api/listings/${productId}`)
        setListing(data)
      } catch (err) {
        console.log(err)
      }
    }
    getSingleListing()
  },[])

  // console.log(listing)

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get('api/auth/users')
        setUsers(data)
      } catch (err) {
        console.log(err)
      }
    }
    getUsers()
  },[])

  // const handleUserDirect = (itemOwner) => {
  //   navigate(`/user/${itemOwner.id}`)
  // }

  // console.log(users)
  
  const itemOwner = users && listing ? users.find(user => user.id === listing.owner) : null

  // const [viewport, setViewport] = useState({
  //   latitude: 51.4171739,
  //   longitude: -0.1520928,
  //   width: '100%',
  //   height: '100%',
  //   zoom: 17
  // })

  // const handleCarouselSlider = (direction) => {
  //   const preventTransition =
  //     (direction === 'back' && currentImgIndex === 1) ||
  //     (direction === 'forward' && currentImgIndex === noOfImgs);

  //   if (preventTransition) {
  //     return;
  //   }

  //   const element = carousel.current;
  //   const currentTransition =
  //     +element.style.transform.match(/\(([^)]+)\)/)?.[1].replace('px', '') || 0;

  //   const pxToMove =
  //     direction === 'back' ? currentTransition + 500 : currentTransition - 500;

  //   element.style.transform = `translateX(${pxToMove}px)`;
  //   setCurrentImgIndex((prev) => (direction === 'back' ? prev - 1 : prev + 1));
  // };

  const containerPadding = {
    xs: 3,
    md: 6,
    lg: 15,
    xl: 33
  };

  return (
    <Box
      sx={{
        pt: 7,
        pb: 5,
        pr: {...containerPadding},
        pl: {...containerPadding}
      }}
    >
      <div className='info-container'>
        <div className='carousel'>
          {/* <ArrowForwardIosIcon
            onClick={() => handleCarouselSlider('forward')}
            fontSize='medium'
          />
          <ArrowBackIosIcon
            onClick={() => handleCarouselSlider('back')}
            fontSize='medium'
          /> */}
          <div className='carousel-inner'>
          {/* ref={carousel} */}
            <img
              src={listing ? listing.image : null}
              alt={`${listing ? listing.title : 'product'}`}
            />
            {/* <img
              src='https://images.unsplash.com/photo-1611403119860-57c4937ef987?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
              alt='chink'
            />
            <img
              src='https://images.unsplash.com/photo-1544168190-79c17527004f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80'
              alt='chink'
            />
            <img
              src='https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80'
              alt='chink'
            /> */}
          </div>
        </div>

        <div className='info-text'>
          <h5>{listing ? listing.title : null}</h5>
          <h6>£{listing ? (listing.price % 1 === 0 ? listing.price.split('.')[0] : listing.price) : null}</h6>
          <span>Added {listing ? listing.created_at.split('T')[0] : null}</span>
          <p className='description'>
          {listing ? listing.description : null}
          </p>
          <span>
            Posted by <Link to={`/user/${listing && users ? itemOwner.id : null}`}>{listing && users ? itemOwner.first_name : null} {listing && users ? itemOwner.last_name : null}</Link>
          </span>
          {/* onClick={() => handleUserDirect(itemOwner)} */}
          <Button text={`Contact ${listing && users ? itemOwner.first_name : null}`} type='primary' />
        </div>
      </div>

      {/* <div className='location-info'>
        <h6>Location</h6>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken='pk.eyJ1Ijoic2VhbmdwYWNoYXJlb25zdWIiLCJhIjoiY2s5OGE2NGduMDBveTNubW43ang4NnFoayJ9.6qxOtlGy2vVtypOyGd7-DA'
          mapStyle='mapbox://styles/seangpachareonsub/clbijwqd2000q14n2sd5se2zh'
          onViewportChange={(viewport) => setViewport(viewport)}
        ></ReactMapGL>
      </div> */}
    </Box>
  );
};

export default ProductView;
