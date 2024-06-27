import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { GoodsList } from '../../components/GoodsList/GoodsList.jsx';
import { GoodsWithImage } from '../../components/GoodsWithImage/GoodsWithImage.jsx';

import { Services } from '../../services/Services.js';

import styles from './CategoriesPage.module.scss';

const CategoriesPage = ({ categories, setCategories }) => {
  const [loading, setLoading] = useState(true);
  const { getSubCategories } = Services();

  const location = useLocation();
  const { category } = useParams();

  useEffect(() => {
    loadGoods(category);
  }, [location.pathname]);

  const loadGoods = (category) => {
    getSubCategories(category).then((data) => {
      setCategories(data);
      setLoading(false);
    });
  };

  return (
    <div className={styles.wrapper}>
      {!loading ? (
        categories.length > 0 ? (
          <>
            <GoodsList categories={categories} />
            <GoodsWithImage categories={categories} />
          </>
        ) : (
          <div className={styles.noProductsBlock}>
            <p>There are no available lots in this category</p>
            <img src="/images/search.svg" alt="search" />
          </div>
        )
      ) : null}
    </div>
  );
};

export default CategoriesPage;
