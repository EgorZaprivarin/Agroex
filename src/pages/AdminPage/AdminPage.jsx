import { useState, useContext } from 'react';

import { Context } from '../../context/context';
import DataGridForAdminPage from '../../components/DataGridForAdminPage/DataGridForAdminPage';
import MenuItems from '../../components/MenuItems/MenuItems';

import { useMediaQuery, Button, Menu } from '@mui/material';
import { List } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import SpaIcon from '@mui/icons-material/Spa';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';

import style from './AdminPage.module.scss';

const AdminPage = () => {
  const { selectedItem, setSelectedItem } = useContext(Context);

  const [anchorEl, setAnchorEl] = useState(null);

  const is800px = useMediaQuery('(max-width:800px)');

  const handleDropDownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropDownClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    {
      icon: <PeopleIcon />,
      text: 'Users',
      hasCollapse: false,
      collapseItems: [],
    },
    {
      icon: <CategoryIcon />,
      text: 'Categories',
      hasCollapse: true,
      collapseItems: [
        { icon: <SpaIcon />, text: 'Vegetables' },
        { icon: <SpaIcon />, text: 'Fruits' },
        { icon: <SpaIcon />, text: 'Crops' },
        { icon: <SpaIcon />, text: 'Dry fruits' },
      ],
    },
    {
      icon: <ShoppingCartIcon />,
      text: 'Lots',
      hasCollapse: true,
      collapseItems: [
        { icon: <SellIcon />, text: 'Moderation' },
        { icon: <SellIcon />, text: 'Active' },
        { icon: <SellIcon />, text: 'Rejected' },
        { icon: <SellIcon />, text: 'Inactive' },
        { icon: <SellIcon />, text: 'Completed' },
      ],
    },
  ];

  return (
    <div className={style.wrapper}>
      <div className={style.main}>
        {is800px ? (
          <div className={style.dropdown}>
            <Button
              sx={{
                width: '128px',
                backgroundColor: '#183C48',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#305663',
                  boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                },
              }}
              aria-controls="menu"
              aria-haspopup="true"
              onClick={handleDropDownOpen}
              variant="contained"
              endIcon={<KeyboardArrowDown />}
            >
              Menu
            </Button>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleDropDownClose}
            >
              <MenuItems
                menuItems={menuItems}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            </Menu>
          </div>
        ) : (
          <aside className={style.admin__side}>
            <h1 className={style.panel__title}>Menu</h1>
            <List
              sx={{ width: '100%' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <MenuItems
                menuItems={menuItems}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            </List>
          </aside>
        )}
        <div className={style.admin__content}>
          <DataGridForAdminPage gridType={selectedItem} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
