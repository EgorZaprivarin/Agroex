import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/context.js';

import { CreateLotForm } from '../../components/CreateLotForm/CreateLotForm.jsx';
import { LotPage } from '../index.jsx';
import { CustomModal } from '../../components/CustomModal/CustomModal.jsx';
import { CustomGreenButton } from '../../components/CustomButtons/CustomGreenButton.jsx';

import styles from './CreateLotPage.module.scss';

const CreateLotPage = ({ content }) => {
  const {
    userData,
    files,
    setFiles,
    editMode,
    setEditMode,
    setUpdatedLot,
  } = useContext(Context);

  const [showNotification, setShowNotification] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [lot, setLot] = useState(null);

  const navigate = useNavigate();

  const showAndHideModal = (e) => {
    const currentTarget = e.currentTarget;

    switch (currentTarget.name) {
      case 'createPage':
      case 'updatePage':
        setIsOpenModal(true);
        break;
      case 'cancel':
        setIsOpenModal(false);
        break;
      case 'discard':
        setFiles([]);
        setEditMode(false);
        setUpdatedLot({});
        //Если предыдущей страницей была страница редактирования, то переходим на главную
        if (location.state === '/update_lot') {
          navigate('/');
        } else {
          ToPreviousPage();
        }
        setIsOpenModal(false);
        break;
      case 'previewPage':
        ToPreviousPage();
        break;
      default:
        return;
    }
  };

  const ToPreviousPage = () => {
    navigate(-1);
  };

  const view =
    content === 'Preview' ? (
      <LotPage target="preview" />
    ) : (
      <CreateLotForm
        showNotification={showNotification}
        setShowNotification={setShowNotification}
        files={files}
        setFiles={setFiles}
        setLot={setLot}
        editMode={editMode}
        setEditMode={setEditMode}
        userData={userData}
      />
    );

  const setNameOfButton = (content) => {
    if (content === 'New advertisement') {
      return 'createPage';
    } else if (content === 'Lot update') {
      return 'updatePage';
    } else if (content === 'Preview') {
      return 'previewPage';
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.topPanel}>
          <button
            name={setNameOfButton(content)}
            className={styles.backBtn}
            onClick={(e) => showAndHideModal(e)}
          >
            <span className={styles.lineBtn}></span>
          </button>
          <h3 className={styles.title}>{content}</h3>
        </div>
        {view}
        <CustomModal open={isOpenModal} close={showAndHideModal} />
        <div
          className={
            showNotification
              ? `${styles.notificationWrapper} ${styles.activeNotification}`
              : styles.notificationWrapper
          }
        >
          <div className={styles.notificationBody}>
            <img src="/images/succes.jpg" alt="succes" />
            <h6 className={styles.title}>Success!</h6>
            <p className={styles.text}>
              Your ad has been {editMode ? 'updated.' : 'published.'}
            </p>
            <div>
              <CustomGreenButton
                action={() => navigate(`/account/my_advertisement/${userData.sub}/Pending/${lot.title.replace(' ', '_')}&id=${lot.id}`)}
                content="Okay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLotPage;
