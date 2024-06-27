import { useState, useEffect } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { Services } from './services/Services.js';
import { getCookie } from './services/cookie.js';
import { currentSession } from './helpers/cognito/currentSession.js';

import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { CookieStorage } from 'aws-amplify/utils';
import awsConfig from './helpers/cognito/aws-exports.js';

import {
  AdminPage,
  CategoriesPage,
  LotsPage,
  LotPage,
  UserInfoPage,
  CreateLotPage,
  LoginPage,
  MyAdsPage,
  BettingPage,
  MyAccountPage,
  LotDetailsPage,
} from './pages/index.jsx';
import LayoutLotsPage from './components/LayoutLotsPage/LayoutLotsPage.jsx';
import LayoutMainPage from './components/LayoutMainPage/LayoutMainPage.jsx';
import LayoutAccountPage from './components/LayoutAccountPage/LayoutAccountPage.jsx';
import Layout from './components/Layout/Layout.jsx';
import AuthorizedAdminRoute from './components/AuthorizedAdminRoute/AuthorizedAdminRoute.jsx';
import AuthorizedUserRoute from './components/AuthorizedUserRoute/AuthorizedUserRoute.jsx';
import AccessDenial from './components/AccessDenial/AccessDenial.jsx';

import { Context } from './context/context.js';

import styles from './App.module.scss';

import USD from './assets/icons/header/flag.svg';

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: 'IBMPlexSans, sans-serif',
    },
  });

  cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());

  Amplify.configure(awsConfig);

  const { getUserById } = Services();

  const [auth, setAuth] = useState(getCookie());
  const [userData, setUserData] = useState({});
  const [userAvatar, setUserAvatar] = useState(null);
  const [rows, setRows] = useState([]);
  const [updatedLot, setUpdatedLot] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewLotInfo, setPreviewLotInfo] = useState({});
  const [files, setFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [collapseStates, setCollapseStates] = useState({});
  const [selectedItem, setSelectedItem] = useState('Users');
  const [oldLotImages, setOldLotImages] = useState([]);
  const [currentCurrency, setCurrentCurrency] = useState({
    name: 'USD',
    img: USD,
  });
  const [currentVarieties, setCurrentVarieties] = useState([]);

  useEffect(() => {
    if (auth) {
      getUserData();
    } else {
      setUserData({});
      setUserAvatar(null);
    }
  }, [auth]);

  const getUserData = async () => {
    const userDataFromCognito = await currentSession();
    const userDataFromDB = await getUserById(userDataFromCognito.sub);

    setUserAvatar(userDataFromDB.avatarUrl);
    setUserData(userDataFromCognito);
  };

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider
        value={{
          userData,
          setUserData,
          userAvatar,
          setUserAvatar,
          categories,
          setCategories,
          previewLotInfo,
          setPreviewLotInfo,
          rows,
          setRows,
          auth,
          setAuth,
          files,
          setFiles,
          updatedLot,
          setUpdatedLot,
          editMode,
          setEditMode,
          successMessage,
          setSuccessMessage,
          collapseStates,
          setCollapseStates,
          selectedItem,
          setSelectedItem,
          oldLotImages,
          setOldLotImages,
          currentCurrency,
          setCurrentCurrency,
          currentVarieties,
          setCurrentVarieties,
        }}
      >
        <Router>
          <div className={styles.app}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route
                  element={<AuthorizedUserRoute Component={LayoutMainPage} />}
                >
                  <Route path="/" element={<Navigate to="vegetables" />} />
                  <Route
                    path="/:category"
                    element={
                      <CategoriesPage
                        categories={categories}
                        setCategories={setCategories}
                      />
                    }
                  />
                </Route>
                <Route
                  element={
                    <AuthorizedUserRoute Component={LayoutAccountPage} />
                  }
                >
                  <Route
                    path="/account/my_advertisement/:id/Active"
                    element={<MyAdsPage activeTab="Active" />}
                  />
                  <Route
                    path="/account/my_advertisement/:id/Pending"
                    element={<MyAdsPage activeTab="Pending" />}
                  />
                  <Route
                    path="/account/my_advertisement/:id/Inactive"
                    element={<MyAdsPage activeTab="Inactive" />}
                  />
                  <Route
                    path="/account/betting/:id"
                    element={<BettingPage />}
                  />
                  <Route
                    path="/account/profile/:id"
                    element={<MyAccountPage />}
                  />
                </Route>
                <Route
                  path="/admin/lot_details/:id"
                  element={<AuthorizedAdminRoute Component={LotDetailsPage} />}
                />
                <Route
                  path="/admin"
                  element={<AuthorizedAdminRoute Component={AdminPage} />}
                />
                <Route
                  path="admin/users/:id"
                  element={<AuthorizedAdminRoute Component={UserInfoPage} />}
                />
                <Route
                  element={<AuthorizedUserRoute Component={LayoutLotsPage} />}
                >
                  <Route path="/categories/:product" element={<LotsPage />} />
                  <Route
                    path="/categories/:product/:title"
                    element={<LotPage />}
                  />
                  <Route
                    path="/account/:tab/:id/:status/:title"
                    element={<LotPage />}
                  />
                </Route>
                <Route
                  path="/new_lot"
                  element={
                    <AuthorizedUserRoute
                      Component={CreateLotPage}
                      content={'New advertisement'}
                    />
                  }
                />
                <Route
                  path="/new_lot_preview"
                  element={
                    <AuthorizedUserRoute
                      Component={CreateLotPage}
                      content={'Preview'}
                    />
                  }
                />
                <Route
                  path="/update_lot"
                  element={
                    <AuthorizedUserRoute
                      Component={CreateLotPage}
                      content={'Lot update'}
                    />
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/*"
                  element={
                    <AccessDenial
                      errorCode="404"
                      errorText="Not found"
                      title="We can not find this page"
                      text="We are sorry, but the page you were trying to access does not exist."
                    />
                  }
                />
              </Route>
            </Routes>
          </div>
        </Router>
      </Context.Provider>
    </ThemeProvider>
  );
}

export default App;
