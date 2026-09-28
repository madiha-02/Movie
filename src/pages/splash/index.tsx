import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import TvIcon from '@mui/icons-material/Tv';

const Splash = () => {
  const [showText, setShowText] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 1000);
    const navigateTimer = setTimeout(() => navigate('/home'), 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

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
      onClick={() => navigate('/home')}
    >
      <TvIcon className="tv-icon" />
      {showText && (
        <Typography variant="h3" className="fade-in-text">
          THE MOVIES APP
        </Typography>
      )}
    </Box>
  );
};

export default Splash;
