import React, {useState, useRef, useEffect} from 'react'
import './styles.scss'
import {useLocation, useNavigate} from 'react-router-dom'
import ProductFilterBar from '../../components/ProductFilterBar'
import TuneIcon from '@mui/icons-material/Tune'
import useWindowDimensions from '../../utils/useWindowDimensions'
// import useOnScreen from '../../utils/useOnScreen'
import ProductCard from '../../components/ProductCard'
import axios from 'axios'

const CategoryView = ({bannerText}) => {
  const {pathname} = useLocation()
  const navigate = useNavigate()

  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  // const bannerRef = useRef()


  const [listings, setListings] = useState([])
  const [categorisedListings, setCategorisedListings] = useState([])
  const [category, setCategory] = useState([])

  const categoryIndex = {
    'Home & Garden': 1,
    'Electronics': 2,
    'Fashion': 3,
    'Sports & Leisure': 4,
    'Health & Beauty': 5,
    'Toys': 6, 
    'Motors': 7, 
    'Collectibles': 8, 
    'Property': 9, 
    'Jobs': 10,
    'Pets': 11
  }

  useEffect(() => {
    const getListings = async () => {
      try {
        const { data } = await axios.get('/api/categories')
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
    console.log(category)
    const findCategory = category ? category.subcategories : null
    console.log(findCategory)
    const withListings = findCategory ? findCategory.filter(subcat => subcat.listings.length > 0) : null
    console.log(withListings)
    const listingArray = []
    if (withListings) withListings.map(subcat => subcat.listings.map(singleListing => listingArray.push(singleListing))) 
    console.log(listingArray)
    setCategorisedListings(listingArray)
  }, [bannerText, listings, category])
  const isMobileScreen = useWindowDimensions().width <= 900;
  // const isStickySidebar = useOnScreen(bannerRef);

  const getImageUrlPath = () => {
    const baseUrl = '../../resources/img/banners'
    const formattedRoute = pathname.replaceAll('%20', '_')
    return `${baseUrl}${formattedRoute}.png`
  }

  const formattedRouteText = bannerText.toLowerCase().replaceAll(' ', '')

  const sortByDropdown = (
    <div className='sort-dropdown'>
      <p>Sort by:</p>
      <select>
        <option>A-Z</option>
        <option>Z-A</option>
        <option>Highest Price</option>
        <option>Lowest Price</option>
        <option>Newly Added</option>
      </select>
    </div>
  );

  const applyFilters = () => {
    if (isMobileScreen) {
      setShowFilterModal(false);
    }
  };

  // const arrFake = [...Array(10).keys()];

  const handleProductDirect = (product) => {
    console.log(product.id)
    navigate(`/${product.id}`)
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
              createdAt={i.created_at}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
