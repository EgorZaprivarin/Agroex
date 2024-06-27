import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Context } from '../../context/context.js';

import currencyLabels from '../../helpers/currencyLabels.js';
import calculateTimeLeft from '../../helpers/calculateTimeLeft.js';

import lotTime from '../../assets/icons/lotsPage/lotTime.svg';
import desc from '../../assets/icons/lotsPage/warning.svg';
import map from '../../assets/icons/lotsPage/map.svg';

import styles from './LotInfo.module.scss';

export const LotInfo = ({ setLocation, lotInfo }) => {
  const { previewLotInfo, currentCurrency } = useContext(Context);

  const [bet, setBet] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const currentUrl = useLocation().pathname;

  useEffect(() => {
    locationMapping();
  }, [lotInfo.region, previewLotInfo.region]);

  useEffect(() => {
    if (lotInfo.lotType === 'AUCTIONED') {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft(lotInfo.expiresAt));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lotInfo]);

  const locationMapping = () => {
    currentUrl === '/new_lot_preview'
      ? setLocation(previewLotInfo.region || 'Minsk')
      : setLocation(lotInfo.region);
  };

  const activeBtn = isDisabled
    ? styles.betBtn
    : `${styles.betBtn} ${styles.betBtnActive}`;

  const onUpdateBet = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');

    setBet(value);
    onDisabled(value);
  };

  const onDisabled = (value) => {
    setIsDisabled(!value);
  };

  const content =
    currentUrl === '/new_lot_preview' ? (
      <div className={styles.lotInfo}>
        <h4 className={styles.title}>
          {previewLotInfo.title || 'There is no title'}
        </h4>
        <div className={styles.timeAndId}>
          {/*<div className={styles.time}>*/}
          {/*  <img src={lotTime} alt="lotTime" />*/}
          {/*  2d 23h*/}
          {/*</div>*/}
          <div className={styles.lotType}>{previewLotInfo.lotType}</div>
        </div>
        <div className={styles.note}>
          <img src={desc} alt="description" />
          {previewLotInfo.description || 'There is not description.'}
        </div>
        <div className={styles.prices}>
          <div className={styles.bet}>
            <p className={styles.subTitle}>Bet</p>
            <h4 className={styles.noBets}>No bets</h4>
            <p className={styles.dynamicPricePerKilo}>
              {previewLotInfo.quantityUnit
                ? `${currencyLabels[currentCurrency.name]}-/${previewLotInfo.quantityUnit}`
                : null}
            </p>
          </div>
          <div className={styles.totalPrice}>
            <p className={styles.subTitle}>Total price</p>
            <p className={styles.buyNowPrice}>
              {previewLotInfo.price ? `${currencyLabels[currentCurrency.name]}${previewLotInfo.price}` : `${currencyLabels[currentCurrency.name]}-`}
            </p>
            <p className={styles.pricePerKilo}>
              {`${currencyLabels[currentCurrency.name]}${
                previewLotInfo.price && previewLotInfo.quantity
                  ? (previewLotInfo.price / previewLotInfo.quantity).toFixed(2)
                  : '-'
              }/${previewLotInfo.quantityUnit || 'ton'}`}
            </p>
          </div>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Variety</h6>
          <h6 className={styles.value}>{previewLotInfo.variety || 'none'}</h6>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Quantity</h6>
          <h6 className={styles.value}>
            {previewLotInfo.quantity && previewLotInfo.quantityUnit
              ? `${previewLotInfo.quantity} ${previewLotInfo.quantityUnit}`
              : 'none'}
          </h6>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Size</h6>
          <h6 className={styles.value}>
            {previewLotInfo.sizeFrom && previewLotInfo.sizeTo
              ? `${previewLotInfo.sizeFrom}-${previewLotInfo.sizeTo} ${previewLotInfo.sizeUnit}`
              : 'none'}
          </h6>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Packaging</h6>
          <h6 className={styles.value}>{previewLotInfo.packaging || 'none'}</h6>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Location</h6>
          <h6 className={`${styles.value} ${styles.map}`}>
            <img src={map} alt="map" />
            {`${previewLotInfo.country}${previewLotInfo.region && ','} ${previewLotInfo.region}`}
          </h6>
        </div>
      </div>
    ) : (
      <div className={styles.lotInfo}>
        <h4 className={styles.title}>{lotInfo.title || 'There is no title'}</h4>
        <div className={styles.timeAndId}>
          {lotInfo.lotType === 'AUCTIONED' && (
            <div className={styles.time}>
              <img src={lotTime} alt="lotTime" />
              {timeLeft ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s` : '0d 0h 0m'}
            </div>
          )}
          <div className={styles.lotType}>{lotInfo.lotType}</div>
        </div>
        <div className={styles.note}>
          <img src={desc} alt="description" />
          {lotInfo.description || 'There is no description for now ;('}
        </div>
        <div className={styles.prices}>
          <div className={styles.bet}>
            <p className={styles.subTitle}>Bet</p>
            <h4 className={styles.noBets}>No bets</h4>
            {/*<p className={styles.highestBet}>$11,000.00</p>*/}
            {/*<p className={styles.pricePerKilo}>$1.1/kg</p>*/}
            <div className={styles.betInput}>
              <input
                onChange={onUpdateBet}
                type="text"
                value={bet}
                placeholder="Enter your bet here"
              />
              <p className={styles.dollar}>
                {currencyLabels[currentCurrency.name]}
              </p>
            </div>
            {/*<p className={styles.betInfo}>Bet from $11,001 to $11,999</p>*/}
            <p className={styles.dynamicPricePerKilo}>
              {`${currencyLabels[currentCurrency.name]}-/${lotInfo.quantityUnits}`}
            </p>
            <button className={activeBtn} disabled={isDisabled}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 19.9995V21.9995H0.5V19.9995H12.5ZM13.086 0.685547L20.864 8.46355L19.45 9.87955L18.39 9.52555L15.913 11.9995L21.57 17.6565L20.156 19.0705L14.5 13.4135L12.096 15.8175L12.379 16.9495L10.964 18.3635L3.186 10.5855L4.601 9.17155L5.731 9.45355L12.025 3.16055L11.672 2.10055L13.086 0.685547ZM13.793 4.22155L6.722 11.2915L10.257 14.8275L17.328 7.75755L13.793 4.22155Z"
                  fill={isDisabled ? '#BCC3C3' : '#38999B'}
                />
              </svg>
              {isDisabled
                ? `Bet`
                : `Bet  ${currencyLabels[currentCurrency.name]}${bet}`}
            </button>
          </div>
          <div className={styles.totalPrice}>
            <p className={styles.subTitle}>Total price</p>
            <p
              className={styles.buyNowPrice}
            >{`${currencyLabels[currentCurrency.name]}${lotInfo.calculatedPrice ? lotInfo.calculatedPrice.toFixed(2) : '-'}`}</p>
            <p className={styles.pricePerKilo}>
              {`${currencyLabels[currentCurrency.name]}${
                lotInfo.calculatedPrice && lotInfo.quantity
                  ? (lotInfo.calculatedPrice / lotInfo.quantity).toFixed(2)
                  : '-'
              }/${lotInfo.quantityUnits}`}
            </p>
            <button className={styles.buyBtn}>
              <svg
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 14V2H0.5V0H3.5C3.76522 0 4.01957 0.105357 4.20711 0.292893C4.39464 0.48043 4.5 0.734784 4.5 1V13H16.938L18.938 5H6.5V3H20.22C20.372 3 20.522 3.03466 20.6586 3.10134C20.7952 3.16801 20.9148 3.26495 21.0083 3.38479C21.1019 3.50462 21.1668 3.6442 21.1983 3.79291C21.2298 3.94162 21.2269 4.09555 21.19 4.243L18.69 14.243C18.6358 14.4592 18.511 14.6512 18.3352 14.7883C18.1595 14.9255 17.9429 15 17.72 15H3.5C3.23478 15 2.98043 14.8946 2.79289 14.7071C2.60536 14.5196 2.5 14.2652 2.5 14ZM4.5 21C3.96957 21 3.46086 20.7893 3.08579 20.4142C2.71071 20.0391 2.5 19.5304 2.5 19C2.5 18.4696 2.71071 17.9609 3.08579 17.5858C3.46086 17.2107 3.96957 17 4.5 17C5.03043 17 5.53914 17.2107 5.91421 17.5858C6.28929 17.9609 6.5 18.4696 6.5 19C6.5 19.5304 6.28929 20.0391 5.91421 20.4142C5.53914 20.7893 5.03043 21 4.5 21ZM16.5 21C15.9696 21 15.4609 20.7893 15.0858 20.4142C14.7107 20.0391 14.5 19.5304 14.5 19C14.5 18.4696 14.7107 17.9609 15.0858 17.5858C15.4609 17.2107 15.9696 17 16.5 17C17.0304 17 17.5391 17.2107 17.9142 17.5858C18.2893 17.9609 18.5 18.4696 18.5 19C18.5 19.5304 18.2893 20.0391 17.9142 20.4142C17.5391 20.7893 17.0304 21 16.5 21Z"
                  fill="white"
                />
              </svg>
              Buy for {currencyLabels[currentCurrency.name]}
              {lotInfo.calculatedPrice ?
                lotInfo.calculatedPrice.toFixed(2) :
                '-'
              }
            </button>
          </div>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Variety</h6>
          <h6 className={styles.value}>{lotInfo.variety || 'none'}</h6>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Quantity</h6>
          <h6
            className={styles.value}
          >{`${lotInfo.quantity || 0} ${lotInfo.quantityUnits}`}</h6>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Size</h6>
          <h6 className={styles.value}>
            {lotInfo.sizeLower && lotInfo.sizeUpper
              ? `${lotInfo.sizeLower}-${lotInfo.sizeUpper} ${lotInfo.sizeUnits}`
              : 'none'}
          </h6>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Packaging</h6>
          <h6 className={styles.value}>{lotInfo.packaging || 'none'}</h6>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Location</h6>
          <h6 className={`${styles.value} ${styles.map}`}>
            <img src={map} alt="map" />
            {`${lotInfo.country}${lotInfo.region && ','} ${lotInfo.region}`}
          </h6>
        </div>
        <div className={styles.infoRow}>
          <h6 className={styles.property}>Created</h6>
          <h6 className={styles.value}>{lotInfo.creationDate}</h6>
        </div>
      </div>
    );

  return <>{content}</>;
};
