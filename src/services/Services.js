import useHttp from '../hooks/http.hook.js';

import { fetchAuthSession } from '@aws-amplify/auth';

import defineCategory from '../helpers/defineCategory.js';

export const Services = () => {
  const _apiBaseDocker = 'http://localhost:8080/api/v1/';
  const _apiBase =
    'http://test-alb-t2-1554909414.eu-central-1.elb.amazonaws.com/api/v1/';

  const request = useHttp();

  const getUsers = async (role) => {
    return await request({
      url: `${_apiBaseDocker}users?role=${role}`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getUserById = async (id) => {
    return await request({
      url: `${_apiBaseDocker}users/${id}`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const addUser = async (newUser) => {
    return await request({
      url: `${_apiBaseDocker}users`,
      data: {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const deleteUser = async (id) => {
    return await request({
      url: `${_apiBaseDocker}users/${id}`,
      data: {
        method: 'DELETE',
        body: null,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const editUser = async (modifiedUser) => {
    return await request({
      url: `${_apiBaseDocker}users/${modifiedUser.id}`,
      data: {
        method: 'PUT',
        body: JSON.stringify(modifiedUser),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getLotsRegions = async () => {
    return await request({
      url: `${_apiBaseDocker}lots/regions`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getLots = async (search = '%5B%5D', currency = 'USD') => {
    return await request({
      url: `${_apiBaseDocker}lots?filters=${search}&currency=${currency}`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getLotsBySubcategory = async (
    id,
    filters = '%5B%5D',
    page = 0,
    size = 10,
    sort = 'creationDate,desc',
    currency = 'USD',
  ) => {
    return await request({
      url: `${_apiBaseDocker}subcategories/${id}/lots?filters=${filters}&page=${page}&size=${size}&sort=${sort}&currency=${currency}`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getUserLots = async (userId, currency = 'USD') => {
    return await request({
      url: `${_apiBaseDocker}users/${userId}/lots?currency=${currency}`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getLotById = async (id, currency = 'USD') => {
    return await request({
      url: `${_apiBaseDocker}lots/${id}?currency=${currency}`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getLotsByUser = async (id) => {
    return await request({
      url: `${_apiBaseDocker}users/${id}/lots`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const addLot = async (newLot) => {
    return await request({
      url: `${_apiBaseDocker}lots`,
      data: {
        method: 'POST',
        body: JSON.stringify(newLot),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const editLot = async (modifiedLot) => {
    return await request({
      url: `${_apiBaseDocker}lots/${modifiedLot.id}`,
      data: {
        method: 'PUT',
        body: JSON.stringify(modifiedLot),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const deleteLot = async (id) => {
    return await request({
      url: `${_apiBaseDocker}lots/${id}`,
      data: {
        method: 'DELETE',
        body: null,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getMainCategories = async () => {
    return await request({
      url: `${_apiBaseDocker}categories`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getSubCategories = async (parent) => {
    return await request({
      url: `${_apiBaseDocker}subcategories?parent=${defineCategory(parent).toUpperCase().replace(/ /g, '_')}`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const getSubcategoryById = async (id) => {
    return await request({
      url: `${_apiBaseDocker}subcategories/${id}`,
      data: {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const addSubCategory = async (newSubCategory) => {
    return await request({
      url: `${_apiBaseDocker}subcategories`,
      data: {
        method: 'POST',
        body: JSON.stringify(newSubCategory),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const editSubCategory = async (modifiedSubCategory) => {
    return await request({
      url: `${_apiBaseDocker}subcategories/${modifiedSubCategory.id}`,
      data: {
        method: 'PUT',
        body: JSON.stringify(modifiedSubCategory),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const deleteSubCategory = async (id) => {
    return await request({
      url: `${_apiBaseDocker}subcategories/${id}`,
      data: {
        method: 'DELETE',
        body: null,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const addLotImages = async (formData, id) => {
    return await request({
      url: `${_apiBaseDocker}lots/${id}/images`,
      data: {
        method: 'POST',
        body: formData,
        headers: {
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const addSubCategoryImage = async (formData, id) => {
    return await request({
      url: `${_apiBaseDocker}subcategories/${id}/image`,
      data: {
        method: 'POST',
        body: formData,
        headers: {
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  const addUserImage = async (formData, id) => {
    return await request({
      url: `${_apiBaseDocker}users/${id}/image`,
      data: {
        method: 'POST',
        body: formData,
        headers: {
          authorization: `Bearer ${(await fetchAuthSession()).tokens.idToken}`,
        },
      },
    });
  };

  return {
    getUsers,
    getUserById,
    addUser,
    deleteUser,
    editUser,
    getLotsRegions,
    getLots,
    getLotsBySubcategory,
    getUserLots,
    getLotById,
    getLotsByUser,
    addLot,
    editLot,
    deleteLot,
    getMainCategories,
    getSubCategories,
    getSubcategoryById,
    addSubCategory,
    editSubCategory,
    deleteSubCategory,
    addLotImages,
    addSubCategoryImage,
    addUserImage,
  };
};
