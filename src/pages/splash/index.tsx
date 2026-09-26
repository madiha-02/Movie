import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import TvIcon from '@mui/icons-material/Tv';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Splash: React.FC = () => {
  const [showText, setShowText] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    navigate('/home');
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#161d2f',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '& .tv-icon': {
          animation: 'pop-in 1s ease-in-out',
          fontSize: 100,
        },
        '& .fade-in-text': {
          animation: 'fade-in 1s ease-in-out',
        },
        '@keyframes pop-in': {
          '0%': {
            opacity: 0,
            transform: 'scale(0.5)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
        '@keyframes fade-in': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
      }}
      onClick={handleClick}
    >
      <TvIcon className="tv-icon" />
      {showText && (
        <Typography variant="h3" className="fade-in-text">
          THE MOVIE APPS
        </Typography>
      )}
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
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
        }}
      >
        <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
          {expanded ? <ArrowBackIcon /> : <ArrowForwardIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Splash;
