import * as React from 'react';
import {useNavigate} from 'react-router-dom';
// MUI
import {
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Badge,
  Box
} from '@mui/material';

import {Menu, AddCircle, Bookmark, AccountCircle} from '@mui/icons-material';

// Components
import MobileMenu from './MobileMenu';
import SearchBar from '../SearchBar';

const NavBar = () => {
  const navigate = useNavigate();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const containerPadding = {
    xs: 2,
    md: 10,
    lg: 30,
    xl: 47
  };

  const toolBar = (
    <Toolbar>
      <Typography
        sx={{
          flexGrow: {
            xs: 1,
            sm: 0
          },
          pr: 10,
          cursor: 'pointer'
        }}
        variant='h5'
        noWrap
        component='div'
        onClick={() => navigate('/')}
      >
        Thrift.
      </Typography>

      <SearchBar
        containterStyles={{
          display: {
            xs: 'none',
            sm: 'block',
            backgroundColor: '#f1f1f1',
            flexGrow: 1
          }
        }}
      />

      <Box sx={{pl: 10, display: {xs: 'none', md: 'flex'}}}>
        <IconButton
          size='medium'
          aria-label='show 4 new mails'
          color='inherit'
          sx={{
            mr: 0.75
          }}
        >
          {/* <Badge badgeContent={4} color='error'> */}
          <AddCircle />
          {/* </Badge> */}
        </IconButton>
        <IconButton
          size='small'
          aria-label='show 17 new notifications'
          color='inherit'
          sx={{
            m: 0.75
          }}
        >
          {/* <Badge badgeContent={17} color='error'> */}
          <Bookmark />
          {/* </Badge> */}
        </IconButton>
        <IconButton
          size='medium'
          edge='end'
          aria-label='account of current user'
          aria-controls={menuId}
          aria-haspopup='true'
          // onClick={}
          color='inherit'
          sx={{
            ml: 0.75
          }}
        >
          <AccountCircle />
        </IconButton>
      </Box>
      <Box sx={{pl: 10, display: {xs: 'flex', md: 'none'}}}>
        <IconButton
          size='medium'
          aria-label='show more'
          aria-controls={mobileMenuId}
          aria-haspopup='true'
          onClick={handleMobileMenuOpen}
          color='inherit'
        >
          <Menu />
        </IconButton>
      </Box>
    </Toolbar>
  );

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar
        sx={{
          pt: 0.45,
          pb: 0.45,
          pr: {
            ...containerPadding
          },
          pl: {
            ...containerPadding
          }
        }}
        elevation={3}
        color='inherit'
        position='static'
      >
        {toolBar}
      </AppBar>
      <MobileMenu
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
        mobileMenuId={mobileMenuId}
      />
    </Box>
  );
};

export default NavBar;
