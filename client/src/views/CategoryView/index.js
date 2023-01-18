import React, {useState, useRef, useEffect, useCallback} from 'react'
import './styles.scss'
import {useLocation, useNavigate} from 'react-router-dom'
import ProductFilterBar from '../../components/productFilterBar'
import TuneIcon from '@mui/icons-material/Tune'
import useWindowDimensions from '../../utils/useWindowDimensions'
// import useOnScreen from '../../utils/useOnScreen'
import ProductCard from '../../components/productCard'
import axios from 'axios'
import collectibles from '../../img/banners/collectibles.png'
import electronics from '../../img/banners/electronics.png'
import fashion from '../../img/banners/fashion.png'
import healthbeauty from '../../img/banners/health_&_beauty.png'
import homegarden from '../../img/banners/home_&_garden.png'
import jobs from '../../img/banners/jobs.png'
import motors from '../../img/banners/motors.png'
import pets from '../../img/banners/pets.png'
import property from '../../img/banners/property.png'
import sportsleisure from '../../img/banners/sports_&_leisure.png'
import toys from '../../img/banners/toys.png'

import {subcategoriesIndexed, conditions} from '../../components/productFilterBar/subcategories'

const CategoryView = ({bannerText}) => {
  const {pathname} = useLocation()
  const navigate = useNavigate()

  const [selectedListingOrder, setSelectedListingOrder] = useState('a-z')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)

  const [selectedFilters, setSelectedFilters] = useState({
    subcategory: '',
    condition: [],
    price: '',
    radius: ''
  })
  // const bannerRef = useRef()


  const [listings, setListings] = useState([])
  const [rawListings, setRawListings] = useState([])
  const [categorisedListings, setCategorisedListings] = useState([])
  const [category, setCategory] = useState([])

  const forceUpdate = useCallback((arr) => setCategorisedListings(arr), [])

  useEffect(() => {
    const getListings = async () => {
      try {
        const { data } = await axios.get('/api/categories/')
        setListings(data)
      } catch (err) {
        console.log(err)
      }
    }
    getListings()
  }, [])

  useEffect(() => {
    setCategory(listings.find(listing => listing.name === bannerText))
    const findCategory = category ? category.subcategories : null
    const withListings = findCategory ? findCategory.filter(subcat => subcat.listings.length > 0) : null
    const listingArray = []
    if (withListings) withListings.map(subcat => subcat.listings.map(singleListing => listingArray.push(singleListing))) 
    setRawListings(listingArray)
    setCategorisedListings(listingArray)
  }, [bannerText, listings, category])

  const bannerImage = [
    {
      path: '/home%20&%20garden',
      url: homegarden
    },
    {
      path: '/electronics',
      url: electronics
    },
    {
      path: '/fashion',
      url: fashion
    },
    {
      path: '/sports%20&%20leisure',
      url: sportsleisure
    },
    {
      path: '/health%20&%20beauty',
      url: healthbeauty
    },
    {
      path: '/toys',
      url: toys
    },
    {
      path: '/motors',
      url: motors
    },
    {
      path: '/collectibles',
      url: collectibles
    },
    {
      path: '/property',
      url: property
    },
    {
      path: '/jobs',
      url: jobs
    },
    {
      path: '/pets',
      url: pets
    }
  ]

  const getImageUrlPath = () => {
    const findBannerObject = bannerImage.find(item => item.path === pathname)
    return findBannerObject.url
  }

  const formattedRouteText = bannerText.toLowerCase().replaceAll(' ', '')

  const sort = (sortFn, prev) => prev.sort(sortFn)

  const sortListingsByDropdownOption = (value) => {
      const sortFnMap = {
        'a-z': (a,b) => a.title.localeCompare(b.title),
        'z-a': (a,b) => b.title.localeCompare(a.title),
        'highest price': (a,b) => parseFloat(b.price) - parseFloat(a.price),
        'lowest price': (a,b) => parseFloat(a.price) - parseFloat(b.price),
        'added': (a,b) => new Date(b.created_at) - new Date(a.created_at)
      }
      return forceUpdate(sort(sortFnMap[value] , categorisedListings))
  }
    

  const sortByDropdown = (
    <div className='sort-dropdown'>
      <p>Sort by:</p>
      <select
        onChange={(e) => sortListingsByDropdownOption(e.target.value)
        }
      >
        <option value='a-z'>A-Z</option>
        <option value='z-a'>Z-A</option>
        <option value='highest price'>Highest Price</option>
        <option value='lowest price'>Lowest Price</option>
        <option value='added'>Newly Added</option>
      </select>
    </div>
  )

  const isMobileScreen = useWindowDimensions().width <= 900;
  // let isMobileScreen
  // const isStickySidebar = useOnScreen(bannerRef);
  // sortListingsByDropdownOption()

  const applyFilters = () => {
    if (isMobileScreen) {
      setShowFilterModal(false)
    }

    const {price, radius, condition, subcategory} = selectedFilters

    const filteredListings = rawListings.filter(listing => {
      const findSubcategoryIndex = subcategoriesIndexed[bannerText.toLowerCase().replaceAll(' ','')].find(category => category.value === listing.subcategory)?.label
      const findConditionIndex = conditions[listing.condition - 1]
      return findSubcategoryIndex === subcategory && (condition.length === 0 || condition.includes(findConditionIndex)) && parseFloat(listing.price) <= price
    })  

    setCategorisedListings(filteredListings)
  }


  const handleProductDirect = (product) => {
    navigate(`/listings/${product.id}`)
  }

  const onChangeFilters = (key, value) => {
    if (key === 'condition') {
      const {condition} = selectedFilters;
      const updatedSelectedConditions = condition.includes(value)
        ? condition.filter((c) => c !== value)
        : [...condition, value]
      return setSelectedFilters({
        ...selectedFilters,
        condition: updatedSelectedConditions
      })
    }

    return setSelectedFilters({...selectedFilters, [key]: value})
  }

  const handleClear = () => {
    setSelectedFilters({
      subcategory: '',
      condition: [],
      price: '',
      radius: ''
    })
    setCategorisedListings(rawListings)
  }

  return (
    <div className='category-view-container'>
      <div className='category-banner'>
        <img src={getImageUrlPath()} alt='banner' />
        <div className='bannerText'>
          <h4>{bannerText}</h4>
          <p>View all listings</p>
        </div>
      </div>

      <div className='product-content'>
        <ProductFilterBar
          handleClear={handleClear}
          onChangeFilters={onChangeFilters}
          selectedFilters={selectedFilters}
          setSelectedSubCategory={setSelectedSubCategory}
          selectedSubCategory={selectedSubCategory}
          route={formattedRouteText}
          showFilterModal={isMobileScreen && showFilterModal}
          applyFilters={applyFilters}
          isModal={isMobileScreen}
        />
        <div className='listings'>
          <div className='listing-header'>
            <p className='listings-found-text'>
              <span>{categorisedListings.length}</span> Listings Found
            </p>
            {sortByDropdown}
            {isMobileScreen && (
              <span
                onClick={() => setShowFilterModal(true)}
                className='mobile-filter'
              >
                <TuneIcon />
              </span>
            )}
          </div>

          <div className='cards-grid'>
            {categorisedListings.map((i) => (
              <ProductCard 
              onCardClick={() => handleProductDirect(i)} 
              key={i.id}
              image={i.image}
              title={i.title}
              price={i.price}
              description={i.description}
              location={i.location}
              createdAt={i.created_at}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryView
