import { useContext, useEffect, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Services } from '../../../services/Services.js';
import { Context } from '../../../context/context';
import modalValidationSchema from '../../../helpers/modalValidationSchema';

const CreateSubcategoryModal = ({
  open,
  onClose,
  onLoading,
  gridType,
  setValidationErrors,
  setSuccessMessage,
}) => {
  const { rows, setRows } = useContext(Context);
  const { addSubCategory } = Services();

  const [data, setData] = useState({
    categoryName: '',
    varieties: '',
    parentCategory: gridType,
  });

  useEffect(() => {
    setData({
      categoryName: '',
      varieties: '',
      parentCategory: gridType,
    });
  }, [gridType]);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkExistence = () => {
    return rows.find(
      (item) =>
        item.categoryName.toLowerCase().trim() ===
        data.categoryName.toLowerCase().trim(),
    );
  };

  const createNewSubcategory = () => {
    onLoading(true);
    if (checkExistence()) {
      setValidationErrors(['Subcategory already exists']);
      onLoading(false);

      return;
    }

    modalValidationSchema(gridType)
      .validate(data, { abortEarly: false })
      .then(() => {
        addSubCategory({
          categoryName: data.categoryName,
          parentCategory: data.parentCategory,
          varieties: data.varieties
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        }).then((res) => {
          setRows([...rows, res]);
          setSuccessMessage(['Subcategory successfully added']);
        });
        onClose();
      })
      .catch((validationErrors) => {
        console.log(validationErrors);
        const newErrors = {};
        validationErrors.inner.forEach((error) => {
          if (!newErrors[error.path]) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      })
      .finally(() => {
        onLoading(false);
        setData({
          categoryName: '',
          varieties: '',
          parentCategory: gridType,
        });
      });
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
    setData({
      categoryName: '',
      varieties: '',
      parentCategory: gridType,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setData({
          categoryName: '',
          varieties: '',
          parentCategory: gridType,
        });
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{ textAlign: 'center', padding: '0', marginTop: '20px' }}
      >
        Add subcategory
      </DialogTitle>
      <DialogContent>
        <TextField
          size="small"
          sx={{ marginTop: '24px' }}
          name="categoryName"
          label="Subcategory"
          value={data.categoryName}
          onChange={handleInputChange}
          fullWidth
          error={!!errors.categoryName}
          helperText={errors.categoryName ? errors.categoryName : null}
        />
        <TextField
          size="small"
          sx={{ marginTop: '24px' }}
          name="varieties"
          label="Add available varieties separated by commas"
          value={data.varieties}
          onChange={handleInputChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ margin: '0 auto' }}>
        <Button variant="text" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          sx={{
            color: '#51ACAE',
          }}
          variant="text"
          onClick={createNewSubcategory}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSubcategoryModal;
