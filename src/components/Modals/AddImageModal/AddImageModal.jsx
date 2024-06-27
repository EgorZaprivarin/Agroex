import { useState, useEffect } from 'react';

import { Services } from '../../../services/Services.js';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Input,
  Card,
  CardMedia,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledDialogContent = styled(DialogContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
});

const AddImageModal = ({
  open,
  onClose,
  subCategory,
  setSubcategoryToAddImage,
  setSuccessMessage,
  setOpenSuccessAlert,
}) => {
  const { addSubCategoryImage } = Services();

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImg, setCurrentImg] = useState(null);

  useEffect(() => {
    if (subCategory.imageUrl !== null) {
      setCurrentImg(subCategory.imageUrl);
    }
  }, [subCategory.imageUrl]);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target.result;
      setPreviewImage(dataURL);
    };
    reader.readAsDataURL(imageFile);
  };

  const handleAddImage = () => {
    const formData = new FormData();
    formData.append('file', selectedImage);
    addSubCategoryImage(formData, subCategory.id);
    onClose();
    resetState();
    setSuccessMessage('Subcategory image has been successfully added');
    setOpenSuccessAlert(true);
  };

  const handleCancel = () => {
    onClose();
    resetState();
  };

  const resetState = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setSubcategoryToAddImage({});
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {currentImg ? 'Change' : 'Set'} image
      </DialogTitle>
      <StyledDialogContent>
        {(previewImage || currentImg) && (
          <Card>
            <CardMedia
              component="img"
              src={previewImage || currentImg}
              alt="Preview Image"
              style={{ objectFit: 'cover', width: '500px', height: '200px' }}
            />
          </Card>
        )}
        <Input type="file" onChange={handleImageChange} accept="image/*" />
      </StyledDialogContent>
      <DialogActions sx={{ margin: '0 auto' }}>
        <Button onClick={handleCancel} variant="text">
          Cancel
        </Button>
        <Button
          sx={{
            color: '#51ACAE',
          }}
          variant="text"
          onClick={handleAddImage}
        >
          Add Image
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddImageModal;
