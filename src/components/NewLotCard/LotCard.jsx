import { useContext, useEffect, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import { Context } from '../../context/context.js';

import currencyLabels from '../../helpers/currencyLabels.js';
import calculateTimeLeft from '../../helpers/calculateTimeLeft.js';

import star from '../../assets/icons/lotsPage/star_fill.png';
import manage from '../../assets/icons/lotsPage/manage.svg';
import edit from '../../assets/icons/lotsPage/edit.svg';
import deactivate from '../../assets/icons/lotsPage/deactivate.svg';
import lotTime from '../../assets/icons/lotsPage/lotTime.svg';

import styles from './LotCard.module.scss';

const LotCard = ({
  item,
  setDeactivateLotId,
  setIsOpenDeleteModal,
  currentUnits,
}) => {
  const {
    userData,
    setFiles,
    setOldLotImages,
    setUpdatedLot,
    setEditMode,
    currentCurrency,
  } = useContext(Context);

  const [btnId, setBtnId] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const navigate = useNavigate();

  const titleImageIndex = item.images.findIndex((file) => file.title);
  const activeImage = titleImageIndex < 0 ? 0 : titleImageIndex;

  useEffect(() => {
    if (item.lotType === 'AUCTIONED') {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft(item.expiresAt));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [item]);

  const showMenu = (e) => {
    e.preventDefault();

    if (e.target.id !== btnId) {
      setMenuIsOpen(true);
      setBtnId(e.target.id);
    } else if (e.target.id === btnId) {
      setMenuIsOpen(false);
      setBtnId(null);
    }
  };

  const handleEditClick = () => {
    setUpdatedLot(item);
    setFiles([]);
    setOldLotImages(item.images);
    setEditMode(true);
    navigate('/update_lot');
  };

  const handleDeactivateClick = () => {
    setDeactivateLotId(item.id);
    setIsOpenDeleteModal(true);
  };

  const ModifiedTitle = ({ title, maxLength }) => {
    if (title.length <= maxLength) {
      return <h3 className={styles.title}>{title}</h3>;
    } else {
      return (
        <>
          <h3 className={styles.title}>{title.slice(0, maxLength) + '...'}</h3>
          <div className={styles.titlePopup}>{title}</div>
        </>
      );
    }
  };

  const transformSizeUnits = (size) => {
    if (item.sizeUnits === currentUnits.sizeUnits) {
      return size;
    } else if (currentUnits.sizeUnits === 'cm' && item.sizeUnits === 'mm') {
      return size / 10;
    } else if (currentUnits.sizeUnits === 'mm' && item.sizeUnits === 'cm') {
      return size * 10;
    }
  };

  const transformQuantityUnits = (quantity) => {
    if (item.quantityUnits === currentUnits.quantityUnits) {
      return quantity;
    } else if (
      currentUnits.quantityUnits === 'kg' &&
      item.quantityUnits === 'ton'
    ) {
      return quantity * 1000;
    } else if (
      currentUnits.quantityUnits === 'ton' &&
      item.quantityUnits === 'kg'
    ) {
      return quantity / 1000;
    }
  };

  return (
    <NavLink
      className={styles.lotWrapper}
      key={item.id}
      end
      to={`${item.title.replace(' ', '_')}&id=${item.id}`}
    >
      <div className={styles.lot}>
        <div className={styles.imgWrapper}>
          <img
            className={styles.lotImg}
            src={
              item.images.length
                ? item.images[activeImage].imageUrl
                : '/images/noImageAvailable.jpg'
            }
            alt="lotImage"
          />
        </div>
        <div className={styles.lotInfoWrapper}>
          <div className={styles.lotInfo}>
            <div className={styles.titleAndManageBtn}>
              <ModifiedTitle title={item.title} maxLength={20} />
              {userData.sub === item.author && (
                <>
                  <img className={styles.star} src={star} alt="star" />
                  <button
                    id={item.id}
                    className={
                      menuIsOpen && btnId === item.id
                        ? `${styles.manageBtn} ${styles.activeManageBtn}`
                        : styles.manageBtn
                    }
                    onClick={showMenu}
                  >
                    <img src={manage} alt="manage" />
                    Manage
                    <div
                      className={
                        menuIsOpen && btnId === item.id
                          ? `${styles.controlMenu} ${styles.activeMenu}`
                          : styles.controlMenu
                      }
                    >
                      <p onClick={handleEditClick} className={styles.menuRow}>
                        <img src={edit} alt="edit" />
                        Edit
                      </p>
                      <p
                        onClick={handleDeactivateClick}
                        className={styles.menuRow}
                      >
                        <img src={deactivate} alt="deactivate" />
                        Deactivate
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>
            <div className={styles.timeAndLotType}>
              {item.lotType === 'AUCTIONED' && (
                <div className={styles.time}>
                  <img src={lotTime} alt="lotTime" />
                  {timeLeft
                    ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
                    : '0d 0h 0m'}
                </div>
              )}
              <p className={styles.lotType}>{item.lotType}</p>
            </div>
            <ul className={styles.about}>
              <li>{`${item.category.categoryName},`}</li>
              <li>{`${item.variety},`}</li>
              <li>{`${transformQuantityUnits(item.quantity)} ${currentUnits.quantityUnits},`}</li>
              <li>{`${transformSizeUnits(item.sizeLower)}-${transformSizeUnits(item.sizeUpper)} ${currentUnits.sizeUnits},`}</li>
              <li>{`${item.packaging},`}</li>
              <li>{`${item.country},`}</li>
              <li>{item.region}</li>
            </ul>
            <div className={styles.date}>{item.creationDate}</div>
          </div>
          <div className={styles.lotPrice}>
            <div className={styles.bet}>
              <p className={styles.noBets}>No bets</p>
              {/*<p className={styles.price}>{item.bestBet}</p>*/}
              {/*<p className={styles.perKilo}>$1.1/kg</p>*/}
            </div>
            <div className={styles.buyNow}>
              <p
                className={styles.price}
              >{`${currencyLabels[currentCurrency.name]}${item.calculatedPrice.toFixed(2)}`}</p>
              <p
                className={styles.perKilo}
              >{`${currencyLabels[currentCurrency.name]}${(item.calculatedPrice / item.quantity).toFixed(2)}/${item.quantityUnits}`}</p>
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default LotCard;
