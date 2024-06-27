import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Services } from '../../../services/Services';

import { Context } from '../../../context/context';

import { CircularProgress } from '@mui/material';

import {
  ConfirmDeleteModal,
  SuccessSnackBar,
} from '../../../components/Modals/index.jsx';
import LotCard from '../../../components/LotCard/LotCard';

import styles from './MyAdsPage.module.scss';

const MyAdsPage = ({ activeTab }) => {
  const { getUserLots, editLot, deleteLot } = Services();

  const { userData, currentCurrency } = useContext(Context);

  const [userLots, setUserLots] = useState([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const tabsArray = ['Active', 'Pending', 'Inactive'];

  let action;

  switch (actionType) {
    case 'activate':
      action = () => handleLot(selectedLot.id, 'Pending', 'activated');
      break;
    case 'deactivate':
      action = () => handleLot(selectedLot.id, activeTab, 'deactivated');
      break;
    case 'delete':
      action = () => handleDeleteLot(selectedLot.id);
      break;
    default:
      action = null;
  }

  useEffect(() => {
    fetchUserLots(activeTab);
  }, []);

  const fetchUserLots = async (activeTab) => {
    setLoading(true);

    try {
      const userLots = await getUserLots(userData.sub, currentCurrency.name);
      const onlyCurrentTabLots = userLots.filter((lot) => {
        if (activeTab === 'Pending') {
          return lot.status === 'ON_MODERATION' || lot.status === 'REJECTED';
        }

        return lot.status === activeTab.toUpperCase();
      });
      setUserLots(onlyCurrentTabLots);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTab = (filter) => {
    const nextPage = location.pathname.replace(/\/([^/]+)$/, '') + `/${filter}`;
    navigate(nextPage);
    fetchUserLots(filter);
  };

  const handleDeleteLot = (id) => {
    deleteLot(id)
      .then(() => fetchUserLots(activeTab))
      .then(() => {
        setSuccessMessage('Lot has been successfully deleted');
        setOpenSuccessAlert(true);
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setIsOpenDeleteModal(false);
        setSelectedLot(null);
      });
  };

  const handleLot = (id, activeTab, actionMessage) => {
    const status = actionMessage === 'activated' ? 'ON_MODERATION' : 'INACTIVE';

    editLot(id, createEditedLot(status))
      .then(() => fetchUserLots(activeTab))
      .then(() => {
        setSuccessMessage(`Lot has been successfully ${actionMessage}`);
        setOpenSuccessAlert(true);

        if (activeTab === 'Pending') {
          navigate(`/account/my_advertisement/${userData.sub}/Pending`);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setIsOpenDeleteModal(false);
        setSelectedLot(null);
      });
  };

  const createEditedLot = (status) => {
    return {
      id: selectedLot.id,
      creationDate: selectedLot.creationDate,
      title: selectedLot.title,
      category: {
        id: selectedLot.category.id,
        categoryName: selectedLot.category.categoryName,
      },
      variety: selectedLot.variety,
      country: selectedLot.country,
      region: selectedLot.region,
      lotType: selectedLot.lotType,
      status: status,
      description: selectedLot.description,
      currency: selectedLot.currency,
      quantity: selectedLot.quantity,
      quantityUnits: selectedLot.quantityUnits,
      price: selectedLot.price,
      sizeLower: selectedLot.sizeLower,
      sizeUpper: selectedLot.sizeUpper,
      sizeUnits: selectedLot.sizeUnits,
      packaging: selectedLot.packaging,
      rejectionReason: selectedLot.rejectionReason,
      author: selectedLot.author,
      images: selectedLot.images,
    };
  };

  const tabs = tabsArray.map((item, index) => (
    <div
      key={index}
      onClick={() => {
        handleTab(item);
      }}
      className={`${styles.contentTab} ${activeTab === item ? styles.activeContentTab : ''}`}
    >
      {item}
    </div>
  ));

  const lotsFromDB =
    userLots.length > 0 ? (
      userLots.map((item) => {
        return (
          <LotCard
            key={item.id}
            item={item}
            setSelectedLot={setSelectedLot}
            setIsOpenDeleteModal={setIsOpenDeleteModal}
            setConfirmMessage={setConfirmMessage}
            setActionType={setActionType}
          />
        );
      })
    ) : (
      <p style={{ fontSize: '1.2rem' }}>
        {`There are currently no lots ${activeTab.toLowerCase()}`}
      </p>
    );

  const lots = loading ? (
    <CircularProgress className={styles.loading} />
  ) : (
    lotsFromDB
  );

  return (
    <div className={styles.content}>
      <div className={styles.contentTabs}>{tabs}</div>
      <div className={styles.contentContainer}>{lots}</div>
      <SuccessSnackBar
        open={openSuccessAlert}
        setOpen={setOpenSuccessAlert}
        message={successMessage}
      />
      <ConfirmDeleteModal
        open={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        action={action}
        message={confirmMessage}
      />
    </div>
  );
};

export default MyAdsPage;
