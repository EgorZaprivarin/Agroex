import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { List } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import styles from './GoodsList.module.scss';

export const GoodsList = ({ categories }) => {
  const theme = createTheme({
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: 'IBMPlexSans, sans-serif',
            fontSize: '1.1em',
          },
        },
      },

      MuiList: {
        styleOverrides: {
          root: {
            padding: '0',
          },
        },
      },
    },
  });

  const content = (
    <ThemeProvider theme={theme}>
      <List component="nav" aria-label="secondary mailbox folder">
        {categories.length
          ? categories.map(({ id, categoryName }) => (
              <Link
                key={id}
                to={`/categories/${categoryName.toLowerCase()}&id=${id}`}
              >
                <ListItemButton sx={{ padding: '6px 16px' }} key={id}>
                  <ListItemText primary={categoryName} />
                </ListItemButton>
              </Link>
            ))
          : null}
      </List>
    </ThemeProvider>
  );

  return <Box className={styles.goodsList}>{content}</Box>;
};
