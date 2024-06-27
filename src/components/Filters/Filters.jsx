import { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation } from 'react-router';
import debounce from 'lodash.debounce';

import { Services } from '../../services/Services';
import { Context } from '../../context/context';
import getSorting from '../../helpers/sortList';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import styles from './Filters.module.scss';

const StyledTypography = styled(Typography)({
  color: '#BCC3C3',
  transition: 'transform 0.2s;',
});

const activeClass = {
  color: '#38999B',
  transform: 'scale(1.2)',
};

const theme = createTheme({
  typography: {
    color: '#38999B',
    fontFamily: 'IBMPlexSans, sans-serif',
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#798787',
          '&.Mui-checked': {
            color: '#38999B',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#798787',
          '&.Mui-checked': {
            color: '#38999B',
          },
        },
      },
    },
  },
});

export const Filters = ({
  setLotsPerPage,
  setCurrentPage,
  checkedObj,
  setCheckedObj,
  filterState,
  setFilterState,
  lotList,
  setLotList,
  currentSorting,
  setEncodedFilters,
  currentUnits,
  setCurrentUnits,
}) => {
  const { getLotsBySubcategory, getLotsRegions } = Services();

  const location = useLocation();

  const searchState = location.state;

  const { userData, currentVarieties } = useContext(Context);

  const initialCheckedObj = {
    minSize: '',
    maxSize: '',
    minWheight: '',
    maxWheight: '',
    minPrice: '',
    maxPrice: '',
    author: 'All lots',
    lotType: 'All types',
    quantityUnits: 'ton',
    currency: 'USD',
    sizeUnits: 'cm',
  };

  const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);
  const [regions, setRegions] = useState([]);
  const packagingArr = ['bins', 'plastic bag', 'plastic box', 'wooden box'];

  const getAllRegions = async () => {
    const country = await getLotsRegions();
    const regionNames = country[0].regions.map((region) => region.name);
    setRegions(regionNames);
  };

  const updateFilterStateWithDebounce = useCallback(
    debounce((updatedfilterState) => {
      setFilterState(updatedfilterState);
    }, 350),
    [],
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    let updatedfilterState = [...filterState];
    const numericValue = value.replace(/\D/g, '');

    switch (type) {
      case 'checkbox':
        if (checked) {
          updatedfilterState.push({ name, operator: 'eq', value });
        } else {
          updatedfilterState = updatedfilterState.filter(
            (item) => item.value !== value,
          );
        }
        setCheckedObj({
          ...checkedObj,
          [value]: checked,
        });
        break;
      case 'text':
        if (numericValue.trim() !== '') {
          const existingItemIndex = updatedfilterState.findIndex(
            (item) => item.name === name,
          );
          if (existingItemIndex !== -1) {
            updatedfilterState[existingItemIndex] = {
              name,
              value: numericValue,
            };
          } else {
            updatedfilterState.push({ name, value: numericValue });
          }
        } else {
          updatedfilterState = updatedfilterState.filter(
            (item) => item.name !== name,
          );
        }
        setCheckedObj({
          ...checkedObj,
          [name]: numericValue,
        });
        break;
      case 'radio':
        if (value === 'All lots') {
          updatedfilterState = updatedfilterState.filter(
            (item) => item.name !== 'author',
          );
        } else if (value === 'All types') {
          updatedfilterState = updatedfilterState.filter(
            (item) => item.name !== 'lotType',
          );
        } else {
          updatedfilterState = [
            ...updatedfilterState.filter((item) => item.name !== name),
            { name, operator: 'eq', value },
          ];
        }
        setCheckedObj({
          ...checkedObj,
          [name]: value,
        });
        break;
      default:
    }
    updateFilterStateWithDebounce(updatedfilterState);
  };

  const formatFiltersArr = (arr) => {
    const fieldMapping = {
      minWheight: { fieldName: 'quantity', operator: 'gte' },
      maxWheight: { fieldName: 'quantity', operator: 'lte' },
      minSize: { fieldName: 'sizeLower', operator: 'gte' },
      maxSize: { fieldName: 'sizeUpper', operator: 'lte' },
      minPrice: { fieldName: 'price', operator: 'gte' },
      maxPrice: { fieldName: 'price', operator: 'lte' },
    };

    return arr.map((item) => {
      const { name, value } = item;

      return fieldMapping[name]
        ? { ...fieldMapping[name], value }
        : { fieldName: name, operator: item.operator, value };
    });
  };

  const applyFilters = async () => {
    if (currentSubCategoryId === null) {
      return;
    }

    const qweryFiltersArr = formatFiltersArr(filterState);
    const filtersString = JSON.stringify(qweryFiltersArr);
    const encodedFilters = encodeURIComponent(filtersString);
    setEncodedFilters(encodedFilters);
    const filteredItems = await getLotsBySubcategory(
      currentSubCategoryId,
      encodedFilters,
      0,
      10,
      getSorting(currentSorting),
    );
    setLotsPerPage(10);
    setCurrentPage(0);
    setLotList(filteredItems);
  };

  const handleResetFilters = async () => {
    const allLots = await getLotsBySubcategory(currentSubCategoryId);
    setLotList(allLots);
    setFilterState([]);
    setCheckedObj(initialCheckedObj);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setCheckedObj(initialCheckedObj);
    setFilterState([]);
    const subCategoryId = location.pathname.split('=')[1];
    setCurrentSubCategoryId(subCategoryId);
    getAllRegions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterState]);

  useEffect(() => {
    if (searchState !== null) {
      setCheckedObj(initialCheckedObj);
      const subCategoryId = location.pathname.split('=')[1];
      setCurrentSubCategoryId(subCategoryId);
      getAllRegions();
      setFilterState([searchState]);
    }
  }, [searchState]);

  const createCheckboxes = (data, name) =>
    data.map((item, index) => (
      <li key={index}>
        <FormControlLabel
          label={item}
          control={
            <Checkbox
              checked={checkedObj[item] || false}
              name={name}
              value={item}
              onChange={handleChange}
            />
          }
        />
      </li>
    ));

  const varietiesCheckboxes = createCheckboxes(currentVarieties, 'variety');
  const regionsCheckboxes = regions.length
    ? createCheckboxes(regions, 'region')
    : [];
  const packagingCheckboxes = createCheckboxes(packagingArr, 'packaging');

  const [anchorEl, setAnchorEl] = useState(null);
  const openAllOptions = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleUnits = (event) => {
    const { name, value } = event.target;
    setCurrentUnits((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <FormGroup sx={{ width: '100%' }}>
          <div className={styles.title}>
            <p>Variety</p>
            <Tooltip
              title="Available varieties of this product"
              placement="top"
              arrow
            >
              <HelpOutlineIcon sx={{ fill: '#bcc3c3' }} />
            </Tooltip>
          </div>
          <ul className={`${styles.checkboxList}`}>
            {varietiesCheckboxes.slice(0, 5)}
          </ul>
          {varietiesCheckboxes.length > 5 && (
            <TextField
              size="small"
              id="varietyDropDown"
              name="varietyDropDown"
              placeholder={`All ${varietiesCheckboxes.length} options`}
              variant="outlined"
              onClick={openAllOptions}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="dropdown"
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={openAllOptions}
                    color="inherit"
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                ),
                readOnly: true,
              }}
            />
          )}
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            placement="auto-end"
            transition
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <Paper
                  sx={{
                    marginLeft: '20px',
                    padding: '10px',
                    maxHeight: '280px',
                    overflow: 'auto',
                  }}
                >
                  <ul className={`${styles.checkboxList}`}>
                    {varietiesCheckboxes}
                  </ul>
                </Paper>
              </Grow>
            )}
          </Popper>
        </FormGroup>

        <div className={`${styles.sliderSection}`}>
          <div className={styles.title}>
            <p>Size, {currentUnits.sizeUnits}</p>
            <RadioGroup
              sx={{ display: 'flex', flexDirection: 'row' }}
              value={currentUnits.sizeUnits}
              name="sizeUnits"
              onChange={handleUnits}
            >
              <FormControlLabel
                value="cm"
                control={<Radio sx={{ display: 'none' }} />}
                label={
                  <StyledTypography
                    sx={currentUnits.sizeUnits === 'cm' && activeClass}
                    variant="body1"
                  >
                    cm
                  </StyledTypography>
                }
              />
              <FormControlLabel
                value="mm"
                control={<Radio sx={{ display: 'none' }} />}
                label={
                  <StyledTypography
                    sx={currentUnits.sizeUnits === 'mm' && activeClass}
                    variant="body1"
                  >
                    mm
                  </StyledTypography>
                }
              />
            </RadioGroup>
          </div>
          <div className={styles.sliderField}>
            <TextField
              size="small"
              label="min"
              name="minSize"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              value={checkedObj.minSize}
            />
            <TextField
              size="small"
              label="max"
              name="maxSize"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              value={checkedObj.maxSize}
            />
          </div>
        </div>
        <FormGroup sx={{ width: '100%' }}>
          <div className={styles.title}>
            <p>Packaging</p>
            <Tooltip title="Preferred packaging options" placement="top" arrow>
              <HelpOutlineIcon sx={{ fill: '#bcc3c3' }} />
            </Tooltip>
          </div>
          <ul className={`${styles.checkboxList}`}>{packagingCheckboxes}</ul>
        </FormGroup>
        <FormGroup sx={{ width: '100%' }}>
          <div className={styles.title}>
            <p>Location</p>
            <Tooltip title="Available locations" placement="top" arrow>
              <HelpOutlineIcon sx={{ fill: '#bcc3c3' }} />
            </Tooltip>
          </div>
          <ul className={`${styles.checkboxList}`}>{regionsCheckboxes}</ul>
        </FormGroup>
        <div className={`${styles.sliderSection}`}>
          <div className={styles.title}>
            <p>Quantity, {currentUnits.quantityUnits}</p>
            <RadioGroup
              sx={{ display: 'flex', flexDirection: 'row' }}
              value={currentUnits.quantityUnits}
              name="quantityUnits"
              onChange={handleUnits}
            >
              <FormControlLabel
                value="ton"
                control={<Radio sx={{ display: 'none' }} />}
                label={
                  <StyledTypography
                    sx={currentUnits.quantityUnits === 'ton' && activeClass}
                    variant="body1"
                  >
                    ton
                  </StyledTypography>
                }
              />
              <FormControlLabel
                value="kg"
                control={<Radio sx={{ display: 'none' }} />}
                label={
                  <StyledTypography
                    sx={currentUnits.quantityUnits === 'kg' && activeClass}
                    variant="body1"
                  >
                    kg
                  </StyledTypography>
                }
              />
            </RadioGroup>
          </div>
          <div className={styles.sliderField}>
            <TextField
              name="minWheight"
              size="small"
              label="min"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              value={checkedObj.minWheight}
            />
            <TextField
              name="maxWheight"
              size="small"
              label="max"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              value={checkedObj.maxWheight}
            />
          </div>
        </div>
        <div className={`${styles.sliderSection}`}>
          <div className={styles.title}>
            <p>Price, {checkedObj.currency}</p>
          </div>
          <div className={styles.sliderField}>
            <TextField
              name="minPrice"
              size="small"
              label="min"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              value={checkedObj.minPrice}
            />
            <TextField
              name="maxPrice"
              size="small"
              label="max"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              value={checkedObj.maxPrice}
            />
          </div>
        </div>
        <div className={styles.radioBtnsContainer}>
          <div className={styles.title}>
            <p>Filter by owner</p>
          </div>
          <RadioGroup
            sx={{ marginBottom: '40px' }}
            value={checkedObj.author}
            name="author"
            onChange={handleChange}
          >
            <FormControlLabel
              value="All lots"
              control={<Radio />}
              label="Lots of all users"
            />
            <FormControlLabel
              value={userData.sub}
              control={<Radio />}
              label="Only my lots"
            />
          </RadioGroup>
          <div className={styles.title}>
            <p>Filter by lot type</p>
          </div>
          <RadioGroup
            value={checkedObj.lotType}
            name="lotType"
            onChange={handleChange}
          >
            <FormControlLabel
              value="All types"
              control={<Radio />}
              label="All types"
            />
            <FormControlLabel
              value="AUCTIONED"
              control={<Radio />}
              label='Only "auctioned"'
            />
            <FormControlLabel
              value="NOT_AUCTIONED"
              control={<Radio />}
              label='Only "not auctioned"'
            />
          </RadioGroup>
        </div>
        <div className={styles.counterAndClear}>
          <p className={styles.counter}>
            {`Number of lots found:  ${lotList?.contentList?.length}`}
          </p>
          {filterState.length ? (
            <button className={styles.clearBtn} onClick={handleResetFilters}>
              <DeleteOutlineIcon />
            </button>
          ) : (
            ''
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};
