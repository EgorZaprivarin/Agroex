/* eslint-disable react/jsx-key */
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import {
  ConfirmDeleteModal,
  CreateSubcategoryModal,
  AddImageModal,
  ValidationSnackbar,
  SuccessSnackBar,
} from '../Modals/index';

import { Context } from '../../context/context';
import { Services } from '../../services/Services';
import modalValidationSchema from '../../helpers/modalValidationSchema';
import './DataGridForAdminPage.module.scss';

const DataGridForAdminPage = ({ gridType }) => {
  const { rows, setRows, successMessage, setSuccessMessage } =
    useContext(Context);

  const navigate = useNavigate();
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenAddImageModal, setIsOpenAddImageModal] = useState(false);
  const [openValidateAlert, setOpenValidateAlert] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [subcategoryToAddImage, setSubcategoryToAddImage] = useState({});
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);

  const {
    getUsers,
    deleteUser,
    deleteSubCategory,
    editUser,
    getSubCategories,
    editSubCategory,
    getLots,
  } = Services();

  const userColumns = [
    {
      field: 'firstName',
      headerName: 'First Name',
      editable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      editable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'role',
      headerName: 'Role',
      editable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'email',
      headerName: 'Email',
      editable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'actions',
      flex: 0.5,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<ZoomInIcon />}
            label="User Details"
            className="textPrimary"
            onClick={() => navigate(`users/${id}`)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const categoryColumns = [
    {
      field: 'categoryName',
      headerName: 'Subcategory',
      editable: true,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'varieties',
      headerName: 'Varieties',
      editable: true,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      sortable: false,
      valueFormatter: (params) => {
        if (!params?.value?.length) {
          return '---';
        }

        return params.value;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'actions',
      flex: 1,
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<AddPhotoAlternateIcon />}
            label="Add photo"
            onClick={() => openAddImageModal(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => openDeleteModal(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const lotsColumns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1.1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params?.row?.category?.parentCategory,
    },
    {
      field: 'subcategory',
      headerName: 'Subcategory',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params?.row?.category?.categoryName,
    },

    {
      field: 'variety',
      headerName: 'Variety',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'region',
      headerName: 'Region',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params?.row?.region?.replace('region', 'reg.'),
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'currency',
      headerName: 'Currency',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: 'actions',
      flex: 1,
      getActions: (params) => {
        return [
          <GridActionsCellItem
            onClick={() =>
              navigate(`lot_details/${params.id}`, { state: params.row })
            }
            icon={<ZoomInIcon />}
            label="Lot Details"
            className="textPrimary"
            color="inherit"
          />,
        ];
      },
    },
  ];

  const gridColumnsConfig = {
    Users: userColumns,
    Vegetables: categoryColumns,
    Fruits: categoryColumns,
    Crops: categoryColumns,
    'Dry fruits': categoryColumns,
    Moderation: lotsColumns,
    Active: lotsColumns,
    Rejected: lotsColumns,
    Inactive: lotsColumns,
    Completed: lotsColumns,
  };

  const columns = gridColumnsConfig[gridType];

  useEffect(() => {
    switch (gridType) {
      case 'Users': {
        const adminUsers = getUsers('ADMIN');
        const regularUsers = getUsers('USER');
        Promise.all([regularUsers, adminUsers]).then((data) => {
          const allUsers = data.flat();

          const formatUsersArray = (users) => {
            let idSet = new Set();
            let result = [];

            for (let user of users) {
              if (idSet.has(user.id)) {
                // Найден дубль, меняем поле role на 'ADMIN/USER'
                let existingUser = result.find((u) => u.id === user.id);
                existingUser.role = 'ADMIN/USER';
              } else {
                // Добавляем ID в Set и объект в результат, если такого ID ещё нет
                idSet.add(user.id);
                result.push(user);
              }
            }

            return result;
          };
          const arrWithoutDoubles = formatUsersArray(allUsers);
          setRows(arrWithoutDoubles);
          setLoading(false);
        });
        break;
      }
      case 'Vegetables':
      case 'Fruits':
      case 'Crops':
      case 'Dry fruits':
        getSubCategories(gridType).then((data) => {
          setRows(data);
          setLoading(false);
        });
        break;
      case 'Active':
        getLots().then((data) => {
          setRows(data.filter((item) => item.status === 'ACTIVE'));
          setLoading(false);
        });
        break;

      case 'Moderation':
        getLots().then((data) => {
          setRows(data.filter((item) => item.status === 'ON_MODERATION'));
          setLoading(false);
        });
        break;
      case 'Rejected':
        getLots().then((data) => {
          setRows(data.filter((item) => item.status === 'REJECTED'));
          setLoading(false);
        });
        break;
      case 'Inactive':
        getLots().then((data) => {
          setRows(data.filter((item) => item.status === 'INACTIVE'));
          setLoading(false);
        });
        break;
      case 'Completed':
        getLots().then((data) => {
          setRows(data.filter((item) => item.status === 'COMPLETED'));
          setLoading(false);
        });
        break;
    }
  }, [gridType]);

  useEffect(() => {
    if (validationErrors.length) {
      setOpenValidateAlert(true);
    }
  }, [validationErrors]);

  useEffect(() => {
    if (successMessage.length) {
      setOpenSuccessAlert(true);
    }
  }, [successMessage]);

  const openCreateModal = () => {
    setIsOpenCreateModal(true);
  };

  const closeModals = () => {
    setIsOpenCreateModal(false);
    setIsOpenDeleteModal(false);
    setIsOpenAddImageModal(false);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsOpenDeleteModal(true);
  };

  const openAddImageModal = (subcategory) => {
    setSubcategoryToAddImage(subcategory);
    setIsOpenAddImageModal(true);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const filterItemsById = (arr, id) => {
    return arr.filter((item) => item.id !== id);
  };

  const handleDeleteClick = (id) => () => {
    if (gridType === 'Users') {
      deleteUser(id).then(() => {
        setRows(filterItemsById(rows, id));
        setSuccessMessage('User has been successfully deleted');
      });
    } else {
      deleteSubCategory(id).then(() => {
        setRows(filterItemsById(rows, id));
        setSuccessMessage('Subcategory has been successfully deleted');
      });
    }
    closeModals();
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    setValidationErrors([]);
  };

  const updateItems = (items, updatedItem) => {
    return items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
  };

  const processRowUpdate = (newRow) => {
    try {
      modalValidationSchema(gridType).validateSync(newRow, {
        abortEarly: false,
      });
      setLoading(true);
      if (gridType === 'Users') {
        editUser(newRow).then(() => {
          setRows(updateItems(rows, newRow));
          setLoading(false);
          setSuccessMessage(['User has been successfully changed']);
        });
      } else {
        const arrOfVarieties = Array.isArray(newRow.varieties)
          ? newRow.varieties
          : newRow.varieties
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean);

        editSubCategory({
          ...newRow,
          varieties: arrOfVarieties,
        }).then((res) => {
          setRows(updateItems(rows, res));
          setLoading(false);
          setSuccessMessage(['Subcategory successfully changed']);
        });
      }
      setSuccessMessage([]);
      setValidationErrors([]);

      return newRow;
    } catch (validationError) {
      setValidationErrors(validationError.errors);
      throw new Error(validationError.errors);
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const renderAddSubcategoryBtn = [
    'Fruits',
    'Vegetables',
    'Dry fruits',
    'Crops',
  ].includes(gridType);

  const dynamicTableWidth = columns === lotsColumns ? '950px' : '670px';

  return (
    <Box
      sx={{
        height: '100%',
        maxWidth: dynamicTableWidth,
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      {renderAddSubcategoryBtn && (
        <Button
          sx={{ color: '#51ACAE', borderColor: '#51ACAE' }}
          startIcon={<AddIcon />}
          onClick={openCreateModal}
          size="medium"
          variant="outlined"
        >
          Add subcategory
        </Button>
      )}
      <DataGrid
        sx={{
          marginTop: '10px',
          height: '90%',
        }}
        rows={rows}
        columns={columns}
        showCellVerticalBorders
        pagination
        pageSize={10}
        pageSizeOptions={[5, 10, 25, 100]}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        onProcessRowUpdateError={(error) => console.log(error)}
        processRowUpdate={processRowUpdate}
        rowHeight={50}
        loading={loading}
      />
      <CreateSubcategoryModal
        setValidationErrors={setValidationErrors}
        setSuccessMessage={setSuccessMessage}
        open={isOpenCreateModal}
        onClose={closeModals}
        onLoading={setLoading}
        gridType={gridType}
      />
      <ConfirmDeleteModal
        message={`Are you sure you want to delete the ${gridType === 'Users' ? 'user' : 'subcategory'}?`}
        open={isOpenDeleteModal}
        onClose={closeModals}
        action={handleDeleteClick(deleteId)}
      />
      <AddImageModal
        open={isOpenAddImageModal}
        onClose={closeModals}
        subCategory={subcategoryToAddImage}
        setSubcategoryToAddImage={setSubcategoryToAddImage}
        setSuccessMessage={setSuccessMessage}
        setOpenSuccessAlert={setOpenSuccessAlert}
      />
      <ValidationSnackbar
        open={openValidateAlert}
        setOpenValidateAlert={setOpenValidateAlert}
        message={validationErrors}
      />
      <SuccessSnackBar
        open={openSuccessAlert}
        setOpen={setOpenSuccessAlert}
        message={successMessage}
      />
    </Box>
  );
};

export default DataGridForAdminPage;
