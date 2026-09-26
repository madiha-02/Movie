import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Hidden,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import homeIcon from '../../assets/icons/icon-nav-home.svg';
import movieIcon from '../../assets/icons/icon-nav-movies.svg';
import tvSeriesIcon from '../../assets/icons/icon-nav-tv-series.svg';
import bookmarkIcon from '../../assets/icons/icon-nav-bookmark.svg';

const navLinks = [
  {
    name: 'Home',
    icon: homeIcon,
    link: '/home',
  },
  {
    name: 'Movies',
    icon: movieIcon,
    link: '/movies',
  },
  {
    name: 'TV Series',
    icon: tvSeriesIcon,
    link: '/tv-series',
  },
  {
    name: 'Bookmarks',
    icon: bookmarkIcon,
    link: '/bookmarks',
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#161d2f',
        padding: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: {
          xs: 'row',
          lg: 'column',
        },
        alignItems: 'center',
        justifyContent: 'space-between', 
        width: expanded ? 200 : 60,
        transition: 'width 0.3s',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'row',
            lg: 'column',
          },
          gap: 5,
          alignItems: {
            xs: 'center',
            lg: 'start',
          },
          width: '100%',
        }}
      >
        <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
          {expanded ? <ArrowBackIcon /> : <ArrowForwardIcon />}
        </IconButton>

        <Hidden smDown>
          {expanded && (
            <Typography
              variant="h5"
              component="h1"
              my={2}
              fontWeight={400}
              fontSize={18}
            >
             Movie Store
            </Typography>
          )}
        </Hidden>

        <Box
          sx={{
            py: {
              xs: '0px',
              lg: '16px',
            },
            display: 'flex',
            flexDirection: {
              xs: 'row',
              lg: 'column',
            },
            gap: 4,
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  style={{
                    width: '18px',
                    filter: `${
                      pathname === item.link
                        ? 'invert(58%) sepia(14%) saturate(3166%) hue-rotate(215deg) brightness(91%) contrast(87%)'
                        : 'invert(84%)'
                    }`,
                  }}
                />
                <Hidden mdDown>
                  {expanded && <Typography>{item.name}</Typography>}
                </Hidden>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
