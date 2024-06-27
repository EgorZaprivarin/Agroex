import Chip from '@mui/material/Chip';

import styles from './FilterTags.module.scss';

const FilterTags = ({
  checkedObj,
  setCheckedObj,
  filterState,
  setFilterState,
}) => {
  const deleteFilter = (filter) => {
    const defaultValues = {
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

    if (
      filter.name === 'variety' ||
      filter.name === 'region' ||
      filter.name === 'packaging'
    ) {
      setCheckedObj({
        ...checkedObj,
        [filter.value]: false,
      });
    } else {
      setCheckedObj({
        ...checkedObj,
        [filter.name]: defaultValues[filter.name],
      });
    }

    const updatedFiltersArr = filterState.filter((item) =>
      Object.keys(filter).some((key) => item[key] !== filter[key]),
    );
    setFilterState(updatedFiltersArr);
  };

  return (
    <div className={styles.filterTagsContainer}>
      {filterState.map((filter, index) => (
        <Chip
          sx={{ marginRight: '10px', marginBottom: '5px' }}
          key={index}
          label={
            filter.name === 'author'
              ? 'Only my lots'
              : `${filter.name}: ${filter.value}`
          }
          onDelete={() => deleteFilter(filter)}
        />
      ))}
    </div>
  );
};

export default FilterTags;
