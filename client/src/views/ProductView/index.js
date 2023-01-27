import { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {Link} from 'react-router-dom'
import Button from '../../components/button'
import './styles.scss'
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import {Box, Modal, Typography} from '@mui/material'
// import ReactMapGL from 'react-map-gl'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import moment from 'moment'
import { getToken, isOwner } from '../../utils/auth'
import {conditions} from '../../components/productFilterBar/subcategories'


const ProductView = () => {
  // const carousel = useRef()
  // const noOfImgs = 4
  // const [currentImgIndex, setCurrentImgIndex] = useState(1)

  const navigate = useNavigate()

  const { productId } = useParams()
  const [listing, setListing] = useState()
  const [users, setUsers] = useState()

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    const getSingleListing = async () => {
      try {
        const { data } = await axios.get(`/api/listings/${productId}/`)
        setListing(data)
      } catch (err) {
        console.log(err)
      }
    }
    getSingleListing()
  },[])

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get('/api/auth/users/')
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
  //     (direction === 'forward' && currentImgIndex === noOfImgs)

  //   if (preventTransition) {
  //     return
  //   }

  //   const element = carousel.current
  //   const currentTransition =
  //     +element.style.transform.match(/\(([^)]+)\)/)?.[1].replace('px', '') || 0

  //   const pxToMove =
  //     direction === 'back' ? currentTransition + 500 : currentTransition - 500

  //   element.style.transform = `translateX(${pxToMove}px)`
  //   setCurrentImgIndex((prev) => (direction === 'back' ? prev - 1 : prev + 1))
  // }

  const containerPadding = {
    xs: 3,
    md: 6,
    lg: 15,
    xl: 33
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
  }

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
          </div>
        </div>

        <div className='info-text'>
          <h5>{listing ? listing.title : null}</h5>
          <h6>£{listing ? (listing.price % 1 === 0 ? listing.price.split('.')[0] : listing.price) : null} • {listing ? conditions[listing.condition - 1] : null} condition • {listing ? listing.location : null}</h6>
          <span>Added {listing ? moment(listing.created_at).startOf('second').fromNow() : null}</span>
          <p className='description'>
          {listing ? listing.description : null}
          </p>
          <span>
            {/* Posted by <Link to={`/user/${listing && users ? itemOwner.id : null}`}>{listing && users ? itemOwner.first_name : null} {listing && users ? itemOwner.last_name : null}</Link> */}
            Posted by <Link to={`/chilli/${listing && users ? itemOwner.id : null}`}>{listing && users ? itemOwner.first_name : null} {listing && users ? itemOwner.last_name : null}</Link>
          </span>
          {/* onClick={() => handleUserDirect(itemOwner)} */}
          { listing ? 
              (isOwner(listing.owner) ?
                <Button text={`Edit or delete`} type='primary' onClick={() => navigate(`/${productId}/edit`)} />
                :
                <div>
                  <Button onClick={handleOpen} text={`Contact ${listing && users ? itemOwner.first_name : ''}`} />
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                        <h6>Seller: {listing && users ? `${itemOwner.first_name} ${itemOwner.last_name}` : ''}</h6>
                        <br/>
                        <p>Email: {listing && users ? itemOwner.email : ''}</p>
                        <p>Telephone: {listing && users ? itemOwner.telephone : ''}</p>
                    </Box>
                  </Modal>
                </div>
                )
              :
              <Button text={`Contact ${listing && users ? itemOwner.first_name : ''}`} type='primary' />
          }
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
  )
}

export default ProductView

