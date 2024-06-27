import { cloneElement, useContext, useEffect } from 'react';

import { Context } from '../../context/context';

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const MenuItems = ({ menuItems }) => {
  const theme = createTheme({
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: 'IBMPlexSans, sans-serif',
          },
        },
      },
    },
  });

  const { collapseStates, setCollapseStates, selectedItem, setSelectedItem } =
    useContext(Context);

  useEffect(() => {
    return () => setCollapseStates({ Categories: false, Lots: false });
  }, []);

  const changeColor = (item) => {
    return selectedItem === item ? '#51ACAE' : '#798787';
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleSubListCall = (item) => {
    // Если мы нажали на родительский элемент, и в данный момент он находится в закрытом состоянии, то сетим первый элемент из коллапса.
    if (!collapseStates[item.text]) {
      setSelectedItem(item.collapseItems[0].text);
      setCollapseStates({ Categories: false, Lots: false });
    }

    setCollapseStates((prevOpenStates) => ({
      ...prevOpenStates,
      [item.text]: !prevOpenStates[item.text],
    }));
  };

  //Компонент рендерящий выпадающие элементы списка
  const CollapsItems = ({ collapseItems, parentItem }) => {
    return (
      <Collapse in={collapseStates[parentItem]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {collapseItems.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{ pl: 6 }}
              selected={selectedItem === item.text}
              onClick={() => handleItemClick(item.text)}
            >
              <ListItemIcon>
                {cloneElement(item.icon, {
                  style: {
                    fill: changeColor(item.text), // Устанавливаем цвет иконки в зависимости от условия
                  },
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: changeColor(item.text),
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        {menuItems.map((item, index) => {
          // Проверяем, существует ли уже состояние для текущего пункта меню
          const isItemOpen = collapseStates[item.text] || false;

          return (
            <div key={index}>
              <ListItemButton
                selected={selectedItem === item.text}
                // Если пункт меню должен раскрываться, то вешаем обработчик тригерящий выпадающий список
                onClick={
                  item.hasCollapse
                    ? () => handleSubListCall(item)
                    : () => handleItemClick(item.text)
                }
              >
                <ListItemIcon>
                  {cloneElement(item.icon, {
                    style: {
                      fill: changeColor(item.text), // Устанавливаем цвет иконки в зависимости от условия
                    },
                  })}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: changeColor(item.text),
                  }}
                  primary={item.text}
                />
                {/* При вызове выпадающего списка меняется стрелочка */}
                {item.hasCollapse &&
                  (isItemOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              {/*Если пункт имеет выпадающий список, то вставляем компонент CollapseItems*/}
              {item.hasCollapse && (
                <CollapsItems
                  collapseItems={item.collapseItems}
                  parentItem={item.text}
                />
              )}
            </div>
          );
        })}
      </>
    </ThemeProvider>
  );
};

export default MenuItems;
