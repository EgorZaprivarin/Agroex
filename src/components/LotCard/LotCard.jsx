import { useContext, useState } from 'react';

import { NavLink, useNavigate, useLocation } from 'react-router-dom';

import { Context } from '../../context/context.js';

import classNames from 'classnames';

import currencyLabels from '../../helpers/currencyLabels.js';
import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter.js';

import star from '../../assets/icons/lotsPage/star_fill.png';
import manage from '../../assets/icons/lotsPage/manage.svg';
import edit from '../../assets/icons/lotsPage/edit.svg';
import deactivate from '../../assets/icons/lotsPage/deactivate.svg';
import trash from '../../assets/icons/lotsPage/trash.svg';
import activate from '../../assets/icons/lotsPage/activate.svg';
import rejected from '../../assets/icons/lotsPage/rejected.svg'

import styles from './LotCard.module.scss';

const LotCard = ({
  item,
  setSelectedLot,
  setIsOpenDeleteModal,
  setConfirmMessage,
  setActionType,
}) => {
  const {
    userData,
    setFiles,
    setUpdatedLot,
    setEditMode
  } = useContext(Context);

  const [btnId, setBtnId] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const titleImageIndex = item.images.findIndex((file) => file.title);
  const activeImage = titleImageIndex < 0 ? 0 : titleImageIndex;

  const isItemInactive = item.status === 'INACTIVE';

  const titleClass = classNames(styles.title, {
    [styles.inactiveTitle]: isItemInactive,
  });

  const lotTypeClass = classNames(styles.lotType, {
    [styles.inactiveLotType]: isItemInactive,
  });

  const lotPriceClass = classNames(styles.price, {
    [styles.inactivePrice]: isItemInactive,
  });

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
    // setOldLotImages(item.images);
    setEditMode(true);
    navigate('/update_lot');
  };

  const handleLot = (actionTypeMessage) => {
    setSelectedLot(item);
    setActionType(actionTypeMessage);
    setConfirmMessage(`Are you sure you want to ${actionTypeMessage} your lot?`);
    setIsOpenDeleteModal(true);
  }

  const ModifiedTitle = ({ title, maxLength }) => {
    if (title.length <= maxLength) {
      return <h3 className={titleClass}>
              {title}
             </h3>;
    } else {
      return (
        <>
          <h3 className={titleClass}>
            {title.slice(0, maxLength) + '...'}
          </h3>
          <div className={styles.titlePopup}>{title}</div>
        </>
      );
    }
  }

  const renderTag = (status) => {
    if (location.pathname.includes('Pending')) {
      const style = status === 'ON_MODERATION' ? styles.moderation : styles.rejected;

      return (
        <div className={style}>
          {capitalizeFirstLetter(status.replace('_', ' '))}
        </div>
      );
    }

    return null;
  };

  const manageBtn = userData.sub === item.author && (
    <>
      <img className={styles.star} src={star} alt="star" />
      {renderTag(item.status)}
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
          {item.status === 'INACTIVE'
            ? (
              <>
                <p
                  onClick={() => handleLot('activate')}
                  className={styles.menuRow}
                >
                  <img src={activate} alt="activate" />
                  Activate
                </p>
                <p
                  onClick={() => handleLot('delete')}
                  className={styles.menuRow}
                >
                  <img src={trash} alt="delete" />
                  Delete
                </p>
              </>
            ) : (
              <>
                <p
                  onClick={handleEditClick}
                  className={styles.menuRow}
                >
                  <img src={edit} alt="edit" />
                  Edit
                </p>
                <p
                  onClick={() => handleLot('deactivate')}
                  className={styles.menuRow}
                >
                  <img src={deactivate} alt="deactivate" />
                  Deactivate
                </p>
              </>
            )}
        </div>
      </button>
    </>
  );

  const rejectedMessage = (message, status) => {
    if (location.pathname.includes('Pending') && status === 'REJECTED') {
      return (
        <div className={styles.rejectedMessage}>
          <img src={rejected} alt="rejected" />
          {message}
        </div>
      );
    }

    return null;
  };

  return (
    <NavLink className={styles.lotWrapper} key={item.id} end to={`${item.title.replace(' ', '_')}&id=${item.id}`}>
      <div className={styles.lot}>
        <div className={styles.imgWrapper}>
          <img
            className={styles.lotImg}
            src={item.images.length ? item.images[activeImage].imageUrl : '/images/noImageAvailable.jpg'}
            alt="lotImage"
          />
          {item.status === 'INACTIVE' && <span className={styles.blur}></span>}
        </div>
        <div className={styles.lotInfoWrapper}>
          <div className={styles.lotInfo}>
            <div className={styles.titleAndManageBtn}>
              <ModifiedTitle title={item.title} maxLength={20} />
              {manageBtn}
            </div>
            <div className={styles.timeAndLotType}>
              {/*<div className={styles.time}>*/}
              {/*  <img src={lotTime} alt="lotTime" />*/}
              {/*  <p>{item.lotTime}</p>*/}
              {/*</div>*/}
              <p className={lotTypeClass}>{item.lotType}</p>
            </div>
            <ul className={styles.about}>
              <li>{`${item.category.categoryName},`}</li>
              <li>{`${item.variety},`}</li>
              <li>{`${item.quantity} ${item.quantityUnits},`}</li>
              <li>{`${item.sizeLower}-${item.sizeUpper} ${item.sizeUnits},`}</li>
              <li>{`${item.packaging},`}</li>
              <li>{`${item.country},`}</li>
              <li>{item.region}</li>
            </ul>
            <div className={styles.date}>{item.creationDate}</div>
          </div>
          <div className={styles.rightPart}>
            <div className={styles.lotPrice}>
              <div className={styles.bet}>
                <p className={styles.noBets}>No bets</p>
                {/*<p className={styles.price}>{item.bestBet}</p>*/}
                {/*<p className={styles.perKilo}>$1.1/kg</p>*/}
              </div>
              <div className={styles.buyNow}>
                <p className={lotPriceClass}>{`${currencyLabels[item.currency]}${item.price}`}</p>
                <p
                  className={styles.perKilo}
                >{`${currencyLabels[item.currency]}${(item.price / item.quantity).toFixed(2)}/${item.quantityUnits}`}</p>
              </div>
            </div>
            {rejectedMessage(item.rejectionReason, item.status)}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default LotCard;
