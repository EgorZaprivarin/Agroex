import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Context } from '../../context/context.js';
import { Services } from '../../services/Services.js';
import { ConfirmDeleteModal, SuccessSnackBar } from '../Modals/index.jsx';

import LotCard from '../NewLotCard/LotCard.jsx';
import FilterTags from '../FilterTags/FilterTags.jsx';
import Pagination from '../Pagination/Pagination.jsx';
import Sorting from '../Sorting/Sorting.jsx';
import SwitcherNumberOfLotsPerPage from '../SwitcherNumberOfLotsPerPage/SwitcherNumberOfLotsPerPage.jsx';

import { CircularProgress } from '@mui/material';

import styles from './LotsList.module.scss';

export const LotsList = ({
  lotsPerPage,
  setLotsPerPage,
  currentPage,
  setCurrentPage,
  checkedObj,
  setCheckedObj,
  filterState,
  setFilterState,
  lotList,
  setLotList,
  encodedFilters,
  currentSorting,
  setCurrentSorting,
  currentUnits,
}) => {
  const { setCurrentVarieties, currentCurrency } = useContext(Context);

  const { getLotsBySubcategory, deactivateLot, getSubcategoryById } =
    Services();

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [deactivateLotId, setDeactivateLotId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numberOfPages, setNumberOfPages] = useState(0);

  const { product } = useParams();

  useEffect(() => {
    fetchLotsList();

    return () => {
      setCurrentVarieties([]);
    };
  }, [product]);

  useEffect(() => {
    fetchLotsList();
  }, [currentCurrency.name]);

  useEffect(() => {
    if (Object.keys(lotList).length) {
      setNumberOfPages(lotList.page.totalPages);
    }
  }, [lotList]);

  const fetchLotsList = async () => {
    const indexOF = product.indexOf('=');
    const id = product.substring(indexOF + 1);

    try {
      const res = await getLotsBySubcategory(
        id,
        encodedFilters,
        currentPage,
        lotsPerPage,
        'creationDate,desc',
        currentCurrency.name,
      );

      setLotList(res);
      const sub = await getSubcategoryById(id);
      setCurrentVarieties(sub.varieties);
      setNumberOfPages(res.page.totalPages);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeConfirmationModal = () => {
    setIsOpenDeleteModal(false);
  };
  const handleDeactivateLot = (id) => {
    deactivateLot(id)
      .then(() => fetchLotsList())
      .then(() => {
        setOpenSuccessAlert(true);
      })
      .catch((e) => console.log(e))
      .finally(() => closeConfirmationModal());
  };

  const lotsFromDB =
    lotList.contentList &&
    lotList.contentList.map((item) => {
      return (
        <LotCard
          key={item.id}
          item={item}
          setDeactivateLotId={setDeactivateLotId}
          setIsOpenDeleteModal={setIsOpenDeleteModal}
          currentUnits={currentUnits}
        />
      );
    });

  const lots = !lotsFromDB?.length ? (
    <div className={styles.notFoundBlock}>
      {filterState.length ? (
        <p>Lots has not been found :(</p>
      ) : (
        <p>There are no available lots in this category</p>
      )}

      <img src="/images/search.svg" alt="search" />
    </div>
  ) : (
    lotsFromDB
  );

  return loading ? (
    <CircularProgress sx={{ margin: '40vh auto' }} />
  ) : (
    <>
      <div className={styles.wrapper}>
        <div className={styles.selectedFiltersAndSorting}>
          <FilterTags
            checkedObj={checkedObj}
            setCheckedObj={setCheckedObj}
            filterState={filterState}
            setFilterState={setFilterState}
          />
          <div className={styles.sorting}>
            <SwitcherNumberOfLotsPerPage
              lotsPerPage={lotsPerPage}
              setLotsPerPage={setLotsPerPage}
              setCurrentPage={setCurrentPage}
              currentSorting={currentSorting}
              setLotList={setLotList}
              encodedFilters={encodedFilters}
            />
            <Sorting
              currentSorting={currentSorting}
              setCurrentSorting={setCurrentSorting}
              setCurrentPage={setCurrentPage}
              lotsPerPage={lotsPerPage}
              setLotList={setLotList}
              encodedFilters={encodedFilters}
            />
          </div>
        </div>
        <div className={styles.container}>{lots}</div>
        <Pagination
          setLotList={setLotList}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          currentSorting={currentSorting}
          lotsPerPage={lotsPerPage}
          numberOfPages={numberOfPages}
          encodedFilters={encodedFilters}
        />
        <SuccessSnackBar
          open={openSuccessAlert}
          setOpen={setOpenSuccessAlert}
          message="Lot has been successfully deactivated"
        />
        <ConfirmDeleteModal
          open={isOpenDeleteModal}
          onClose={closeConfirmationModal}
          action={() => handleDeactivateLot(deactivateLotId)}
          message={'Are you sure you want to deactivate your lot?'}
        />
      </div>
    </>
  );
};
