import { useState } from 'react';

import styles from './PageNumberDropDown.module.scss';

const PageSelectorContainer = ({
  numberOfPages,
  currentPage,
  setCurrentPage,
  getLotsListForCurrentPage,
}) => {
  const [showPageSelector, setShowPageSelector] = useState(false);

  const handleChangePage = async (e, index) => {
    getLotsListForCurrentPage(index);

    setCurrentPage(index);
    setShowPageSelector(false);
    window.scrollTo(0, 0);
  };

  const pageList = Array.from({ length: numberOfPages }, (_, index) => {
    return (
      <li
        key={index}
        className={index === currentPage ? styles.activePage : null}
        onClick={() => handleChangePage(event, index)}
      >
        {index + 1}
      </li>
    );
  });

  return (
    <div className={styles.pageNubmerDropDown}>
      <p className={styles.number}>{currentPage + 1}</p>
      <div
        onClick={() => setShowPageSelector(!showPageSelector)}
        className={
          showPageSelector
            ? `${styles.arrowWrapper} ${styles.activeArrow}`
            : styles.arrowWrapper
        }
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 14L8 10H16L12 14Z" fill="#131314" />
        </svg>
      </div>
      <ul
        className={
          showPageSelector
            ? `${styles.pageNumbersDropDown} ${styles.visibleSelector}`
            : styles.pageNumbersDropDown
        }
      >
        {pageList}
      </ul>
    </div>
  );
};

export default PageSelectorContainer;
