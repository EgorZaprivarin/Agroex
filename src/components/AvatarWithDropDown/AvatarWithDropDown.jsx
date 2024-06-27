import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Context } from '../../context/context.js';

import { Services } from '../../services/Services.js';

import { signOut } from '@aws-amplify/auth';

import styled from '@emotion/styled';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon, Divider, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import FlowerSvg from '../SVGComponents/FlowerSvg';
import HammerSvg from '../SVGComponents/HammerSvg';
import AccountSvg from '../SVGComponents/AccountSvg';
import LogOutSvg from '../SVGComponents/LogOutSvg';

import styles from './AvatarWithDropDown.module.scss';

const theme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          margin: '20px 0',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          display: 'flex',
          padding: '8px 16px',
          width: '300px',
          height: '56px',
          fontFamily: 'IBMPlexSansRegular',
          fontSize: '1.1rem',
          color: 'rgb(19, 19, 20)',
          '&.Mui-disabled': {
            opacity: 1,
            pointerEvents: 'none',
          },
        },
      },
    },
    Menu,
  },
});

const StyledAvatar = styled(Avatar)({
  marginLeft: '10px',
  cursor: 'pointer',
  '& .MuiSvgIcon-root': {
    fill: '#183C48',
  },
});

const AvatarWithDropDown = ({ role }) => {
  const { userData, userAvatar, setAuth } = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    setAuth(null);

    handleClose();

    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledAvatar
        alt="Avatar"
        src={userAvatar}
        onClick={handleClick}
        aria-controls="simple-menu"
        aria-haspopup="true"
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            elevation: 0,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem disabled>
          <span
            className={styles.profileName}
          >{`${userData.given_name} ${userData.family_name}`}</span>
        </MenuItem>
        <Divider className={styles.divider} />
        {role && (
          <div>
            <Link to={`/account/my_advertisement/${userData.sub}/Active`}>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <FlowerSvg />
                </ListItemIcon>
                My advertisements
              </MenuItem>
            </Link>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <HammerSvg />
              </ListItemIcon>
              Betting
            </MenuItem>
            <Link to={`/account/profile/${userData.sub}`}>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <AccountSvg />
                </ListItemIcon>
                My account
              </MenuItem>
            </Link>
            <Divider />
          </div>
        )}
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogOutSvg />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
};

export default AvatarWithDropDown;
