import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Services } from '../../services/Services.js';

import { Context } from '../../context/context.js';

import LotCarousel from '../../components/LotCarousel/LotCarousel.jsx';
import { LotInfo } from '../../components/LotInfo/LotInfo.jsx';
import Map from '../../components/Map/Map.jsx';

import Button from '@mui/material/Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import styles from './LotPage.module.scss';

const LotPage = ({ target }) => {
  const { getLotById } = Services();

  const { currentCurrency } = useContext(Context);

  const [lotInfo, setLotInfo] = useState({});
  const [mapVisible, setMapVisible] = useState(false);
  const [location, setLocation] = useState(null);

  const { title } = useParams();

  useEffect(() => {
    if (target !== 'preview') {
      fetchLotInfo();
    }
  }, [currentCurrency.name, title]);

  const fetchLotInfo = async () => {
    const indexOF = title.indexOf('=');
    const id = title.substring(indexOF + 1);

    const res = await getLotById(id, currentCurrency.name);

    setLotInfo(res);
  };

  const toggleMapVisibility = () => {
    setMapVisible(!mapVisible);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <LotCarousel target={target} lotInfo={lotInfo} />
        <LotInfo setLocation={setLocation} lotInfo={lotInfo} />
      </div>
      <div className={styles.map}>
        <Button
          className={styles.buttonMap}
          variant="text"
          startIcon={
            mapVisible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
          }
          onClick={toggleMapVisibility}
        >
          {mapVisible ? 'Hide map' : 'Show map'}
        </Button>
        {mapVisible && <Map location={location} />}
      </div>
    </>
  );
};

export default LotPage;
