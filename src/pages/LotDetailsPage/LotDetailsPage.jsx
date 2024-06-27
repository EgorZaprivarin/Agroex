import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import LotCarousel from '../../components/LotCarousel/LotCarousel';
import GeneralButton from '../../partials/GeneralButton/GeneralButton';
import { ConfirmDeleteModal, RejectLotModal } from '../../components/Modals';
import { ArrowBack } from '@mui/icons-material';
import { Services } from '../../services/Services';
import { Context } from '../../context/context';

import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';

import styles from './LotDetailsPage.module.scss';

const LotDetailsPage = () => {
  const { setSuccessMessage } = useContext(Context);
  const { editLot, getUserById } = Services();
  const navigate = useNavigate();
  const { state: currentLot } = useLocation();

  const {
    category: { categoryName, parentCategory },
    creationDate,
    title,
    variety,
    country,
    region,
    status,
    description,
    currency,
    quantity,
    quantityUnits,
    price,
    sizeLower,
    sizeUpper,
    sizeUnits,
    packaging,
    rejectionReason,
    author: authorId,
    lotType,
  } = currentLot;

  const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);
  const [isOpenActivateModal, setIsOpenActivateModal] = useState(false);
  const [userName, currentUserName] = useState('');

  useEffect(() => {
    getUserById(authorId).then((res) => {
      currentUserName(`${res.firstName} ${res.lastName}`);
    });
  }, []);

  const openRejectModal = () => {
    setIsOpenRejectModal(true);
  };

  const openActivateModal = () => {
    setIsOpenActivateModal(true);
  };

  const activateLot = () => {
    editLot({ ...currentLot, status: 'ACTIVE' }).then(() => {
      navigate(-1);
      setIsOpenActivateModal(false);
      setSuccessMessage('Lot has been successfully activated');
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.sectionHeader}>
          <div className={styles.leftSide}>
            <button onClick={goBack}>
              <ArrowBack />
            </button>
            <h1 className={styles.title}>Lot details</h1>
          </div>
          {status === 'ON_MODERATION' && (
            <div className={styles.rightSide}>
              <GeneralButton
                text="Active"
                svg={<TaskAltIcon />}
                action={openActivateModal}
              />
              <GeneralButton
                text="Reject"
                svg={<BlockIcon />}
                color="red"
                action={openRejectModal}
              />
            </div>
          )}
        </div>
        <div className={styles.container}>
          <LotCarousel lotInfo={currentLot} />
          <div className={styles.info}>
            {status === 'REJECTED' && (
              <div className={`${styles.infoRow} ${styles.rejectReason}`}>
                <h6 className={styles.property}>Problem Description</h6>
                <span className={styles.value}>{rejectionReason}</span>
              </div>
            )}
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Lot&apos;s type</h6>
              <span className={styles.value}>{lotType}</span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Lot&apos;s title</h6>
              <span className={styles.value}>{title}</span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Status</h6>
              <span className={styles.value}>{status.replace('_', ' ')}</span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Category</h6>
              <span className={styles.value}>{parentCategory}</span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Subcategory</h6>
              <span className={styles.value}>{categoryName}</span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Variety</h6>
              <span className={styles.value}>{variety}</span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Quantity</h6>
              <span className={styles.value}>
                {quantity} {quantityUnits}
              </span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Price</h6>
              <span className={styles.value}>
                {price} {currency}
              </span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Packaging</h6>
              <span className={styles.value}>{packaging}</span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Size</h6>
              <span className={styles.value}>
                {sizeLower}-{sizeUpper} {sizeUnits}
              </span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Location</h6>
              <span className={styles.value}>
                {country}, {region}
              </span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Created</h6>
              <span className={styles.value}>{creationDate}</span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Author</h6>
              <span className={styles.value}>{userName}</span>
            </div>
            <div className={styles.infoRow}>
              <h6 className={styles.property}>Description</h6>
              <span className={styles.value}>
                {description.length > 0 ? description : 'No description'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        open={isOpenActivateModal}
        onClose={() => setIsOpenActivateModal(false)}
        action={activateLot}
        message="Are you sure you wanna activate this lot?"
      />
      <RejectLotModal
        open={isOpenRejectModal}
        onClose={() => setIsOpenRejectModal(false)}
        currentLot={currentLot}
      />
    </div>
  );
};

export default LotDetailsPage;
