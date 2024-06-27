import { Link } from 'react-router-dom';
import { useState, useCallback, useEffect, useContext, useRef } from 'react';
import debounce from 'lodash.debounce';

import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ClearIcon from '@mui/icons-material/Clear';
import Backdrop from '@mui/material/Backdrop';

import styles from './SearchBar.module.scss';

import { Services } from '../../services/Services';
import { Context } from '../../context/context';

const SearchBar = () => {
  const { getLots, getSubcategoryById } = Services();
  const { setCurrentVarieties } = useContext(Context);

  const [isExpanded, setIsExpanded] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [findedLots, setFindedLots] = useState([]);
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);

  const searchBarRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const queryObj = {
      fieldName: 'title',
      operator: 'eq',
      value: inputValue,
    };

    const queryString = JSON.stringify(queryObj);
    const encodedString = encodeURIComponent(queryString);
    getLots(encodedString).then((res) => {
      const result = formatSearchResultArr(res);
      setFindedLots(result);
    });
  }, [search]);

  const hideSection = (event, subcategory) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [subcategory]: !prevState[subcategory] || false,
    }));
    event.stopPropagation();
  };

  const formatSearchResultArr = (data) => {
    return data.reduce((result, item) => {
      // Извлекаем необходимую информацию из объекта `item`
      const { category } = item;
      const { categoryName, id } = category;

      // Проверяем, существует ли уже элемент с такой категорией в результирующем массиве
      const existingCategory = result.find(
        (category) => category.subcategory === categoryName,
      );

      // Если категория существует, добавляем текущий лот к уже существующим в этой категории
      if (existingCategory) {
        existingCategory.lots.push(item);
      } else {
        // Если категория не существует, создаем новую категорию в результирующем массиве
        result.push({ subcategory: categoryName, id, lots: [item] });
      }

      return result;
    }, []);
  };

  const debounceSetSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 350),
    [],
  );

  const handleFocus = () => {
    setIsExpanded(true);
    setIsBackdropOpen(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 0);
  };

  const onChangeInput = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debounceSetSearch(value);
  };

  const goToSubcategoryResults = async (id) => {
    const currentSub = await getSubcategoryById(id);
    setCurrentVarieties(currentSub.varieties);
  };

  const handleCollapseSearch = () => {
    setIsExpanded(false);
    setInputValue('');
    setSearch('');
    setFindedLots([]);
    setOpenSections({});
  };

  const handleBlur = (e) => {
    e.stopPropagation();
    handleCollapseSearch();
    setIsBackdropOpen(false);
  };

  const handleDocumentClick = (e) => {
    if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
      handleCollapseSearch();
    }
  };

  const handleDocumentKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCollapseSearch();
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, []);

  const findedLotsView = findedLots.map((section) => (
    <div key={section.id} className={styles.subcategorySection}>
      <div className={styles.subcategoryHeader}>
        <div className={styles.leftSide}>
          <Link
            onClick={(e) => {
              handleBlur(e);
              goToSubcategoryResults(section.id);
            }}
            to={`/categories/${section.subcategory.toLowerCase()}&id=${section.id}`}
            state={{
              name: 'title',
              operator: 'eq',
              value: inputValue,
            }}
          >
            <h2 className={styles.subcategoryTitle}>{section.subcategory}</h2>
          </Link>
          <span className={styles.counter}>
            ({section.lots.length} results)
          </span>
        </div>
        {!openSections[section.subcategory] ? (
          <ExpandLessIcon
            onClick={(e) => hideSection(e, section.subcategory)}
          />
        ) : (
          <ExpandMoreIcon
            onClick={(e) => hideSection(e, section.subcategory)}
          />
        )}
      </div>
      <div
        className={`${styles.lotsWrapper} ${openSections[section.subcategory] ? styles.hiddenSection : ''}`}
      >
        {section.lots.map((result) => {
          const titleImageIndex = result.images.findIndex((file) => file.title);
          const activeImage = titleImageIndex < 0 ? 0 : titleImageIndex;

          return (
            <Link
              onClick={(e) => handleBlur(e)}
              to={`/categories/${result.category.categoryName.toLowerCase()}&id=${result.category.id}/${result.title.replace(' ', '_')}&id=${result.id}`}
              key={result.id}
            >
              <div className={styles.lot}>
                <div className={styles.imgWrapper}>
                  <img
                    src={
                      result.images.length
                        ? result.images[activeImage].imageUrl
                        : '/images/noImageAvailable.jpg'
                    }
                    alt="lotImg"
                  />
                </div>
                <div className={styles.descrWrapper}>
                  <h3 className={styles.lotTitle}>{result.title}</h3>
                  <p className={styles.lotDescr}>
                    {result.variety}, {result.quantity} {result.quantityUnits},{' '}
                    {result.price} {result.currency}, {result.country},{' '}
                    {result.region}, {result.sizeLower}-{result.sizeUpper}{' '}
                    {result.sizeUnits}, {result.packaging},{' '}
                    {result.creationDate}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  ));

  const view = (
    <div
      ref={searchBarRef}
      className={`${styles.searchBar} ${isExpanded ? styles.expanded : ''}`}
    >
      <SearchIcon alt="search" />
      <input
        ref={inputRef}
        onFocus={handleFocus}
        onChange={onChangeInput}
        value={inputValue}
        type="text"
        placeholder="Search"
      />
      {isExpanded && (
        <ClearIcon
          alt="clear"
          className={styles.clearIcon}
          onClick={handleBlur}
        />
      )}
      {isExpanded && inputValue.length > 0 ? (
        <div className={styles.searchResults}>
          {!findedLots.length && search.length > 0 ? (
            <div className={styles.notFoundMessage}>
              No lots found for this request
            </div>
          ) : (
            findedLotsView
          )}
        </div>
      ) : null}
    </div>
  );

  return !isExpanded ? (
    view
  ) : (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={isBackdropOpen}
    >
      {view}
    </Backdrop>
  );
};

export default SearchBar;
