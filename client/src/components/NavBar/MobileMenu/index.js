import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import IconButton from '@mui/material/IconButton'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { isAuthenticated } from '../../../utils/auth'
import { useNavigate } from 'react-router-dom'

// import {
//   Bookmark,
// } from '@mui/icons-material';

const MobileMenu = ({mobileMoreAnchorEl, isMobileMenuOpen, handleMobileMenuClose, mobileMenuId}) => {
  
  const navigate = useNavigate()

  return(
    <Menu
    anchorEl={mobileMoreAnchorEl}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    id={mobileMenuId}
    keepMounted
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    open={isMobileMenuOpen}
    onClose={handleMobileMenuClose}
  >
    <MenuItem onClick={!isAuthenticated() ? () => navigate('/login') : () => navigate('/sell')}  >
      <IconButton size='small' aria-label='show 4 new mails' color='inherit'>
        {/* <Badge badgeContent={4} color='error'> */}
        <AddCircleIcon
          sx={{
            mr: 0.7
          }}
        />
        {/* </Badge> */}
      </IconButton>
      <p>Sell</p>
    </MenuItem>
    <MenuItem onClick={() => navigate('/saved')} >
      <IconButton
        size='small'
        aria-label='show 17 new notifications'
        color='inherit'
      >
        {/* <Badge badgeContent={17} color='error'> */}
        <BookmarkIcon
          sx={{
            mr: 0.7
          }}
        />
        {/* </Badge> */}
      </IconButton>
      <p>Favourites</p>
    </MenuItem>
    <MenuItem onClick={isAuthenticated() ? () => navigate('/myprofile') : () => navigate('/login')} >
      <IconButton
        size='small'
        aria-label='account of current user'
        aria-controls='primary-search-account-menu'
        aria-haspopup='true'
        color='inherit'
      >
        <AccountCircle
          sx={{
            mr: 0.7
          }}
        />
      </IconButton>
      <p>Profile</p>
    </MenuItem>
  </Menu>
  )
}

export default MobileMenu
