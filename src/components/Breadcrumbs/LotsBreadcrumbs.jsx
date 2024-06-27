import { useParams, useLocation, Link } from 'react-router-dom';

import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter.js';

import Breadcrumbs from '@mui/material/Breadcrumbs';

import styles from './LotsBreadcrumbs.module.scss';
export const LotsBreadcrumbs = () => {
  const location = useLocation();
  const { tab, title, status } = useParams();

  let crumbs, subCategory;

  if (location.pathname.includes('account')) {
    const partsOfUrl = [];

    partsOfUrl.push(capitalizeFirstLetter(tab.replace('_', ' ')));
    partsOfUrl.push(capitalizeFirstLetter(title.split('&')[0].replace('_', ' ')));

    crumbs = partsOfUrl.map((title, id, arr) => {
      const url = location.pathname.substring(0, location.pathname.indexOf(status) + status.length);

      if (arr[arr.length - 1] !== title) {
        return (
          <Link className={styles.previousCrumb} key={id} to={url}>
            {partsOfUrl[id]}
          </Link>
        );
      } else {
        return <p key={id}>{partsOfUrl[id]}</p>;
      }

    });
  } else {
    const partsOfUrl = decodeURI(location.pathname).split('/');
    const filterUrl = partsOfUrl.filter((item) => {
      return item;
    });
    let url = '';

    crumbs = filterUrl.map((title, id, arr) => {
      const firstCapitalLetter = capitalizeFirstLetter(title);
      const indexOF = firstCapitalLetter.indexOf('&');
      const correctTitle =
        indexOF >= 0
          ? firstCapitalLetter.substring(0, indexOF)
          : firstCapitalLetter;

      if (id === 0) {
        url += `/`;
      } else if (id === 1) {
        url += `categories/${title}`;
        subCategory = correctTitle;
      } else {
        url += `/${title}`;
      }

      if (arr[arr.length - 1] !== title) {
        return (
          <Link className={styles.previousCrumb} key={id} to={url}>
            {correctTitle.replace('_', ' ')}
          </Link>
        );
      } else {
        return <p key={id}>{correctTitle.replace('_', ' ')}</p>;
      }
    });
  }

  return (
    <div className={styles.breadcrumbs}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {crumbs}
      </Breadcrumbs>
      {!location.pathname.includes('account') && <h1>{subCategory}</h1>}
    </div>
  );
};
