import { Link } from 'react-router-dom';

import styles from './GoodsWithImage.module.scss';

export const GoodsWithImage = ({ categories }) => {
  const content =
    categories.length > 0 &&
    categories.map(({ id, categoryName, imageUrl }) => {
      return (
        <div key={id} className={styles.imgContainer}>
          <Link to={`/categories/${categoryName.toLowerCase()}&id=${id}`}>
            <img
              src={imageUrl || '/images/noImageAvailable.jpg'}
              alt="Sub category"
            />
            <div className={styles.title}>{categoryName}</div>
          </Link>
        </div>
      );
    });

  return <div className={styles.container}>{content}</div>;
};
