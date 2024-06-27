import { useState } from 'react';

import { Filters } from '../../components/Filters/Filters.jsx';
import { LotsList } from '../../components/LotsList/LotsList.jsx';

import styles from './LotsPage.module.scss';
const LotsPage = () => {
  const [filterState, setFilterState] = useState([]);
  const [checkedObj, setCheckedObj] = useState({
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
  });

  const [currentUnits, setCurrentUnits] = useState({
    quantityUnits: 'ton',
    sizeUnits: 'cm',
  });

  const [encodedFilters, setEncodedFilters] = useState('%5B%5D');
  const [currentSorting, setCurrentSorting] = useState('New ones first');
  const [lotList, setLotList] = useState({});
  const [lotsPerPage, setLotsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className={styles.wrapper}>
      <Filters
        setLotsPerPage={setLotsPerPage}
        setCurrentPage={setCurrentPage}
        setCheckedObj={setCheckedObj}
        checkedObj={checkedObj}
        filterState={filterState}
        setFilterState={setFilterState}
        lotList={lotList}
        setLotList={setLotList}
        setEncodedFilters={setEncodedFilters}
        currentSorting={currentSorting}
        setCurrentUnits={setCurrentUnits}
        currentUnits={currentUnits}
      />
      <LotsList
        lotsPerPage={lotsPerPage}
        setLotsPerPage={setLotsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setCheckedObj={setCheckedObj}
        checkedObj={checkedObj}
        filterState={filterState}
        setFilterState={setFilterState}
        lotList={lotList}
        setLotList={setLotList}
        encodedFilters={encodedFilters}
        currentSorting={currentSorting}
        setCurrentSorting={setCurrentSorting}
        currentUnits={currentUnits}
      />
    </div>
  );
};

export default LotsPage;
