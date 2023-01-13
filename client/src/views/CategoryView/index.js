import React, {useState, useRef, useEffect, useCallback} from 'react'
import './styles.scss'
import {useLocation, useNavigate} from 'react-router-dom'
import ProductFilterBar from '../../components/productFilterBar'
import TuneIcon from '@mui/icons-material/Tune'
import useWindowDimensions from '../../utils/useWindowDimensions'
// import useOnScreen from '../../utils/useOnScreen'
import ProductCard from '../../components/productCard'
import axios from 'axios'

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

  const forceUpdate = useCallback((arr) => setCategorisedListings(arr), []);

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

  // console.log(listings)

  useEffect(() => {
    setCategory(listings.find(listing => listing.name === bannerText))
    const findCategory = category ? category.subcategories : null
    const withListings = findCategory ? findCategory.filter(subcat => subcat.listings.length > 0) : null
    const listingArray = []
    if (withListings) withListings.map(subcat => subcat.listings.map(singleListing => listingArray.push(singleListing))) 
    setRawListings(listingArray)
    setCategorisedListings(listingArray)
  }, [bannerText, listings, category])

  const getImageUrlPath = () => {
    const baseUrl = '../../resources/img/banners'
    const formattedRoute = pathname.replaceAll('%20', '_')
    return `${baseUrl}${formattedRoute}.png`
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
        // value={selectedListingOrder}
        onChange={(e) => sortListingsByDropdownOption(e.target.value)
          // setSelectedListingOrder(e.target.value)
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
    console.log(listings)
    if (isMobileScreen) {
      setShowFilterModal(false)
    }

    const {price, radius, condition, subcategory} = selectedFilters

    const filteredListings = rawListings.filter(listing => {
      // console.log({listing, price, condition, subcategory})
      const findSubcategoryIndex = subcategoriesIndexed[bannerText.toLowerCase().replaceAll(' ','')].find(category => category.value === listing.subcategory)?.label
      console.log(findSubcategoryIndex)
      const findConditionIndex = conditions[listing.condition - 1]
      console.log(findConditionIndex)
      return findSubcategoryIndex === subcategory && (condition.length === 0 || condition.includes(findConditionIndex)) && parseFloat(listing.price) <= price
    })  

    // listing.category === category
    // condition.includes(listing.condition)
    // listing.price <= price
    setCategorisedListings(filteredListings)
  };

  // useEffect(() => {
  //   console.log(categorisedListings)
  // }, [categorisedListings])
  // const arrFake = [...Array(10).keys()];

  const handleProductDirect = (product) => {
    console.log(product.id)
    navigate(`/listings/${product.id}`)
  }

  const onChangeFilters = (key, value) => {
    if (key === 'condition') {
      const {condition} = selectedFilters;
      const updatedSelectedConditions = condition.includes(value)
        ? condition.filter((c) => c !== value)
        : [...condition, value];
      return setSelectedFilters({
        ...selectedFilters,
        condition: updatedSelectedConditions
      });
    }

    return setSelectedFilters({...selectedFilters, [key]: value});
  };

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
