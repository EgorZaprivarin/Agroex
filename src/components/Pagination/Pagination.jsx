import { useParams } from 'react-router-dom';

import { Services } from '../../services/Services.js';

import getSorting from '../../helpers/sortList.js';

import PageSelectorContainer from '../PageNumberDropDown/PageNumberDropDown.jsx';

import styles from './Pagination.module.scss';

const Pagination = ({
  setLotList,
  currentPage,
  setCurrentPage,
  currentSorting,
  lotsPerPage,
  numberOfPages,
  encodedFilters,
}) => {
  const { getLotsBySubcategory } = Services();

  const { product } = useParams();

  const handleNextPage = () => {
    getLotsListForCurrentPage(currentPage + 1);

    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  const getLotsListForCurrentPage = async (page) => {
    const indexOF = product.indexOf('=');
    const id = product.substring(indexOF + 1);
    const lots = await getLotsBySubcategory(
      id,
      encodedFilters,
      page,
      lotsPerPage,
      getSorting(currentSorting),
    );

    setLotList(lots);
  };

  return (
    numberOfPages > 1 && (
      <div className={styles.pagination}>
        <p
          className={
            currentPage + 1 >= numberOfPages
              ? styles.hiddenLoadBtn
              : styles.infinityLoadBtn
          }
          onClick={handleNextPage}
        >
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5007 13.1717L17.4507 8.22168L18.8647 9.63568L12.5007 15.9997L6.13672 9.63568L7.55072 8.22168L12.5007 13.1717Z"
              fill="#51ACAE"
            />
          </svg>
          Load more variants
        </p>
        <PageSelectorContainer
          numberOfPages={numberOfPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          getLotsListForCurrentPage={getLotsListForCurrentPage}
        />
      </div>
    )
  );
};

export default Pagination;
