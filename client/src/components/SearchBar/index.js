import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import {InputBase} from '@mui/material'
import {ConstructionOutlined, Search as SearchIcon} from '@mui/icons-material'
import {styled, alpha} from '@mui/material/styles'

import './styles.scss'

const SearchBar = ({containterStyles}) => {

  const navigate = useNavigate()

  const [clicked, setClicked] = useState(false)
  const [isClickOutAdded, setIsClickOutAdded] = useState(false)

  const [ listings, setListings ] = useState([])
  const [ filteredListings, setFilteredListings ] = useState([])
  const [ searched, setSearched ] = useState('')

  const handleSearchClick = () => {
    setClicked(true)
  }

  const clickOutDropdown = (e) => {
    if (e.target.classList.contains('search-list-input')) return
    if (!e.target.classList.contains('MuiInputBase-input') && isClickOutAdded) {
      setClicked(false)
      setFilteredListings([])
      setSearched('')
      setIsClickOutAdded(false)
    }
  }

  window.addEventListener('click', clickOutDropdown)

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

  const handleSearchInput = (e) => {
    if (e.key === 'Enter') {
      setSearched(e.target.value)
    }
  }
  const filterByTitle = () => {
    const regex = new RegExp(searched, 'i')
    const matchingProducts = listings.filter(listing => {
      return regex.test(listing.title)
    })
    setFilteredListings(matchingProducts.slice(0,8))    
  }

  const clearSearch = (e) => {
    setSearched('')
    setFilteredListings([])
  }

  useEffect(() => {
    filterByTitle()
  }, [searched])

  useEffect(() => {
    if (searched && clicked) {
      setIsClickOutAdded(true)
      return window.addEventListener('click', clickOutDropdown)
    }
    if (clicked && !searched) {
      return
    }
    setIsClickOutAdded(false)
    window.removeEventListener('click', clickOutDropdown)
  }, [searched, clicked])

  const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  }))

  const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }))

  const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width')
    }
  }))

  return (
    <Search className='search-bar' sx={{...containterStyles}}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder='Search…'
        inputProps={{'aria-label': 'search'}}
        sx={{width: '100%'}}
        onKeyPress={handleSearchInput}
        onClick={handleSearchClick}
      />
      {searched && <div className="search-dropdown-container search-bar">
        {filteredListings.length > 0 ? 
          filteredListings.map(listing => {
            const { id, title, image } = listing
            return (
              <Link onClick={clearSearch} key={id} to={`/listings/${id}/`}>
                <div className="search-list">
                  <img className="search-img" src={image} alt={title}/>
                  <h6 className="search-title">{title}</h6>
                </div>
              </Link>
            )
          }
          )
          :
          <div className="search-list" onClick={clickOutDropdown}>
            <h6>No results. Please try something else.</h6>
          </div>
        }
      </div>}
    </Search>
  )
}

export default SearchBar
