import { useState, useContext, useEffect } from 'react';
import { Context } from '../../context/context.js';
import { Link } from 'react-router-dom';

import { Services } from '../../services/Services.js';

import capitalizeFirstLetter from '../../helpers/capitalizeFirstLetter.js';
import validationSchemaForLot from '../../helpers/validationSchemaForLot.js';

import { Field, Form, Formik, useFormikContext } from 'formik';
import * as yup from 'yup';

import { CustomTextField } from '../CustomTextField/CustomTextField.jsx';
import { CustomSelect } from '../CustomSelect/CustomSelect.jsx';
import Dropzone from '../DragNDrop/DragNDrop.jsx';
import { CustomWhiteButton } from '../CustomButtons/CustomWhiteButton.jsx';
import { CustomGreenButton } from '../CustomButtons/CustomGreenButton.jsx';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import styles from './CreateLotForm.module.scss';

export const CreateLotForm = ({
  showNotification,
  setShowNotification,
  files,
  setFiles,
  editMode,
  setEditMode,
  setLot,
  userData,
}) => {
  const {
    getMainCategories,
    getSubCategories,
    addLot,
    editLot,
    addLotImages,
    getLotsRegions,
  } = Services();

  const { setPreviewLotInfo, oldLotImages, updatedLot } = useContext(Context);

  const [mainCategories, setMainCategories] = useState([]);
  const [reg, setReg] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [maxImagesPerDrop, setMaxImagesPerDrop] = useState(5);
  const [auctionedBtnIsPressed, setAuctionedBtnIsPressed] = useState(true);
  const [nonAuctionedBtnIsPressed, setNonAuctionedBtnIsPressed] =
    useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [lifetimePeriod, setLifetimePeriod] = useState(0);
  const [lifetimeTooLong, setLifetimeTooLong] = useState(false);
  const [lifetimeTooShort, setLifetimeTooShort] = useState(false);

  useEffect(() => {
    fetchMainCategories();
    fetchRegions();
  }, []);

  useEffect(() => {
    if (editMode && Object.keys(updatedLot).length) {
      fetchSubCategoriesAndVarieties(updatedLot);
      if (updatedLot.lotType === 'NOT_AUCTIONED') {
        setAuctionedBtnIsPressed(true);
        setNonAuctionedBtnIsPressed(false);
      } else {
        setNonAuctionedBtnIsPressed(true);
        setAuctionedBtnIsPressed(false);
      }
    }
  }, []);

  const fetchSubCategoriesAndVarieties = async (updatedLot) => {
    const subCategories = await getSubCategories(
      updatedLot.category.parentCategory.replace(' ', '_'),
    );
    const currentSubcategory = subCategories.find(
      (item) => item.categoryName === updatedLot.category.categoryName,
    );
    const varietiesArr = formatVarietiesArr(currentSubcategory.varieties);

    setSubCategories(subCategories);
    setVarieties(varietiesArr);
    setSelectedSubCategory(currentSubcategory);
  };

  const calculateLifetimePeriod = (totalMinutes, type) => {
    if (!editMode) return 0;

    switch (type) {
      case 'days':
        return Math.floor(totalMinutes / (60 * 24));
      case 'hours':
        return Math.floor((totalMinutes % (60 * 24)) / 60);
      case 'minutes':
        return totalMinutes % 60;
    }
  };

  const fetchMainCategories = async () => {
    const resMainCategories = await getMainCategories();

    setMainCategories(resMainCategories);
  };

  const fetchRegions = async () => {
    const resRegions = await getLotsRegions();
    setReg(resRegions[0]);
  };

  const fetchSubCategories = async (mainCategory) => {
    const res = await getSubCategories(mainCategory);

    setSubCategories(res);
  };

  const getCurrentVarieties = (selectedSubcategory) => {
    const currentSubcategory = subCategories.find(
      (item) => item.categoryName === selectedSubcategory,
    );

    const varietiesArr = formatVarietiesArr(currentSubcategory.varieties);
    setVarieties(varietiesArr);
    setSelectedSubCategory(currentSubcategory);
  };

  const formatVarietiesArr = (arr) => {
    return arr.map((item, index) => {
      return { id: index + 1, name: item };
    });
  };

  const transformImagesToFormData = (images, titleImage) => {
    const formData = new FormData();

    images.forEach((file) => {
      formData.append(`files`, file);
    });

    typeof titleImage === 'string' && formData.append('titleId', titleImage);
    typeof titleImage === 'number' && formData.append('titleIndex', titleImage);

    return formData;
  };

  const checkForNewImages = (oldImages, newImages) => {
    return newImages.some(
      (newImage) => !oldImages.some((oldImage) => newImage.id === oldImage.id),
    );
  };

  const checkForTitleImageHasChanged = () => {
    const oldTitleImage = oldLotImages.find((image) => image.title);
    const newTitleImage = files.find((image) => image.title);

    return oldTitleImage.id !== newTitleImage.id;
  };

  const showNotificationOfAddedLot = () => {
    window.scrollTo(0, 0);
    setShowNotification(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const pressedBtn = (e) => {
    e.preventDefault();

    if (e.target.value === 'NOT_AUCTIONED') {
      setAuctionedBtnIsPressed(true);
      setNonAuctionedBtnIsPressed(false);
      setLifetimeTooShort(false);
      setLifetimeTooLong(false);
      validationSchemaForLot.fields.minPrice = yup.number();
    } else {
      setAuctionedBtnIsPressed(false);
      setNonAuctionedBtnIsPressed(true);
      validationSchemaForLot.fields.minPrice = yup
        .number()
        .typeError('must be a number')
        .moreThan(0, 'must be more than 0')
        .lessThan(yup.ref('price'), 'must be less than price')
        .required('required');
    }
  };

  const initialValues = {
    title: updatedLot?.title || '',
    description: updatedLot.description || '',
    country: updatedLot?.country || 'Belarus',
    region: updatedLot?.region || '',
    category: Object.keys(updatedLot).length
      ? capitalizeFirstLetter(updatedLot.category.parentCategory)
      : '',
    product: updatedLot?.category?.categoryName || '',
    variety: updatedLot?.variety || '',
    sizeFrom: updatedLot?.sizeLower || '',
    sizeTo: updatedLot?.sizeUpper || '',
    sizeUnit: updatedLot?.sizeUnits || 'mm',
    packaging: updatedLot?.packaging || '',
    quantity: updatedLot?.quantity || '',
    quantityUnit: updatedLot?.quantityUnits || 'ton',
    minPrice: updatedLot?.minimalPrice || '',
    price: updatedLot?.price || '',
    currency: updatedLot.currency || 'USD',
    lotType: updatedLot?.lotType || 'NOT_AUCTIONED',
    days: calculateLifetimePeriod(updatedLot?.lifetimePeriod, 'days'),
    hours: calculateLifetimePeriod(updatedLot?.lifetimePeriod, 'hours'),
    minutes: calculateLifetimePeriod(updatedLot?.lifetimePeriod, 'minutes'),
  };

  const onSubmit = (values) => {
    const titleImageIndex = files.findIndex((file) => file.title);
    const titleImage = titleImageIndex < 0 ? 0 : titleImageIndex;

    const newLot = {
      id: updatedLot.id || null,
      title: values.title.replace('#', '№'),
      description: values.description,
      creationDate: updatedLot.creationDate || null,
      status: 'ON_MODERATION',
      category: {
        id: selectedSubCategory.id,
        categoryName: values.product,
      },
      variety: values.variety,
      country: values.country,
      region: values.region,
      lotType: values.lotType.replace('-', '_').toUpperCase(),
      lifetimePeriod: values.lotType === 'AUCTIONED' ? lifetimePeriod : null,
      quantity: +values.quantity,
      quantityUnits: values.quantityUnit,
      minimalPrice: values.lotType === 'AUCTIONED' ? values.minPrice : null,
      price: +values.price,
      currency: values.currency,
      sizeLower: +values.sizeFrom,
      sizeUpper: +values.sizeTo,
      sizeUnits: values.sizeUnit,
      packaging: values.packaging,
      author: userData.sub,
    };

    if (!editMode) {
      addLot(newLot)
        .then((lot) => {
          setLot(lot);
          addLotImages(transformImagesToFormData(files, titleImage), lot.id);
        })
        .catch((e) => console.log(e));
    } else {
      editLot(newLot.id, newLot)
        .then((lot) => {
          setLot(lot);

          if (
            checkForNewImages(oldLotImages, files) ||
            files.length < oldLotImages.length
          ) {
            addLotImages(transformImagesToFormData(files, titleImage), lot.id);
          } else if (checkForTitleImageHasChanged()) {
            const newTitleImage = files.find((image) => image.title);
            addLotImages(
              transformImagesToFormData([], newTitleImage.id),
              lot.id,
            );
          }
        })
        .catch((e) => console.log(e));
    }

    setFiles([]);
    setEditMode(false);
    showNotificationOfAddedLot();
  };

  const sizeUnit = [
    { id: 1, name: 'mm' },
    { id: 2, name: 'cm' },
  ];

  const quantityUnit = [
    { id: 1, name: 'ton' },
    { id: 2, name: 'kg' },
  ];

  const packaging = [
    { id: 1, name: 'bins' },
    { id: 2, name: 'plastic bag' },
    { id: 3, name: 'plastic box' },
    { id: 4, name: 'wooden box' },
  ];

  const currency = [
    { id: 1, name: 'BYN' },
    { id: 2, name: 'USD' },
    { id: 3, name: 'RUB' },
    { id: 4, name: 'EUR' },
  ];

  const AutoCheckOfFieldsForCompleteness = () => {
    const { values } = useFormikContext();
    const valuesCopy = Object.assign({}, values);
    let lifeTimeInMinutes;

    delete valuesCopy['description'];
    delete valuesCopy['days'];
    delete valuesCopy['hours'];
    delete valuesCopy['minutes'];

    if (values.lotType === 'NOT_AUCTIONED') {
      delete valuesCopy['minPrice'];
    } else {
      lifeTimeInMinutes =
        +values.days * 1440 + +values.hours * 60 + +values.minutes;
    }

    const verification = Object.values(valuesCopy).every((item) => item !== '');

    useEffect(() => {
      setLifetimeTooLong(false);
      setLifetimeTooShort(false);

      if (lifeTimeInMinutes > 10080) {
        setLifetimeTooLong(true);
      } else if (lifeTimeInMinutes < 5) {
        setLifetimeTooShort(true);
      }

      setLifetimePeriod(lifeTimeInMinutes);
    }, [lifeTimeInMinutes]);

    useEffect(() => {
      setIsDisabled(verification);
    }, [verification]);
  };

  return (
    <Formik
      className={showNotification && styles.displayNone}
      initialValues={initialValues}
      validationSchema={validationSchemaForLot}
      onSubmit={onSubmit}
      key={editMode}
    >
      {({ values, handleChange, setFieldValue, isValid }) => {
        return (
          <Form
            className={
              showNotification
                ? `${styles.form} ${styles.displayNone}`
                : styles.form
            }
          >
            <div className={styles.fullWidth}>
              <CustomTextField
                handleKeyPress={handleKeyPress}
                label="Title"
                helperText="No more 40 characters"
                placeholder="For example: My apples"
                id="title"
                name="title"
              />
            </div>
            <div className={styles.fullWidth}>
              <CustomTextField
                handleKeyPress={handleKeyPress}
                label="Description"
                placeholder="Write your description"
                multiline
                rows={2}
                id="description"
                name="description"
                type="description"
              />
            </div>
            <label>Type</label>
            <div className={styles.radioBtnWrapper}>
              <label
                className={
                  auctionedBtnIsPressed
                    ? `${styles.radioLabel} ${styles.active}`
                    : styles.radioLabel
                }
              >
                <Field
                  onClick={pressedBtn}
                  className={styles.radioBtn}
                  type="radio"
                  id="lotType"
                  name="lotType"
                  value="NOT_AUCTIONED"
                />
                Non-auctioned
              </label>
              <label
                className={
                  nonAuctionedBtnIsPressed
                    ? `${styles.radioLabel} ${styles.active}`
                    : styles.radioLabel
                }
              >
                <Field
                  onClick={pressedBtn}
                  className={styles.radioBtn}
                  type="radio"
                  id="lotType"
                  name="lotType"
                  value="AUCTIONED"
                />
                Auctioned
              </label>
            </div>
            <label htmlFor="country">Location</label>
            <div className={styles.block}>
              {Object.keys(reg).length && (
                <div className={styles.select}>
                  <CustomSelect
                    id="country"
                    name="country"
                    list={[{ id: 1, name: reg.name }]}
                  />
                </div>
              )}
              <div className={styles.select}>
                {reg.regions && (
                  <CustomSelect
                    placeholder="Select a region"
                    id="region"
                    name="region"
                    list={reg.regions}
                  />
                )}
              </div>
            </div>
            <label htmlFor="category">Category</label>
            <div className={styles.block}>
              {mainCategories.length && (
                <Field
                  as={Select}
                  displayEmpty
                  id="category"
                  name="category"
                  onChange={(e) => {
                    handleChange(e);
                    fetchSubCategories(e.target.value.replace(' ', '_'));
                    setFieldValue('product', '');
                    setFieldValue('variety', '');
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select a category</em>
                  </MenuItem>
                  {mainCategories.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Field>
              )}

              {((subCategories.length && editMode) || !editMode) && (
                <Field
                  as={Select}
                  displayEmpty
                  id="product"
                  name="product"
                  onChange={(e) => {
                    handleChange(e);
                    getCurrentVarieties(e.target.value);
                  }}
                  disabled={!values.category}
                >
                  <MenuItem disabled value="">
                    <em>Select a product</em>
                  </MenuItem>
                  {subCategories.map((item) => (
                    <MenuItem key={item.id} value={item.categoryName}>
                      {item.categoryName}
                    </MenuItem>
                  ))}
                </Field>
              )}
            </div>
            <div
              className={
                values.product || (editMode && values.product)
                  ? `${styles.hiddenInputsWraper}`
                  : `${styles.hiddenInputsWraper} ${styles.hidden}`
              }
            >
              <label htmlFor="variety">Variety</label>
              {varieties.length && (
                <div className={styles.variety}>
                  <CustomSelect
                    placeholder="Select a variety"
                    id="variety"
                    name="variety"
                    list={varieties}
                  />
                </div>
              )}

              <label>Size</label>
              <div className={styles.block}>
                <div>
                  <div>
                    <CustomTextField
                      handleKeyPress={handleKeyPress}
                      placeholder="0"
                      id="sizeFrom"
                      name="sizeFrom"
                    />
                  </div>
                  <div>
                    <CustomTextField
                      handleKeyPress={handleKeyPress}
                      placeholder="1000"
                      id="sizeTo"
                      name="sizeTo"
                    />
                  </div>
                </div>
                <div className={styles.notFullWidth}>
                  <CustomSelect id="sizeUnit" name="sizeUnit" list={sizeUnit} />
                </div>
              </div>
              <label htmlFor="packaging">Packaging</label>
              <div className={styles.variety}>
                <CustomSelect
                  placeholder="Select a packaging"
                  id="packaging"
                  name="packaging"
                  list={packaging}
                />
              </div>
              <label htmlFor="quantity">Quantity</label>
              <div className={styles.block}>
                <div className={styles.quantityAndPrice}>
                  <CustomTextField
                    handleKeyPress={handleKeyPress}
                    placeholder="Enter the quantity"
                    id="quantity"
                    name="quantity"
                  />
                </div>
                <div className={styles.notFullWidth}>
                  <CustomSelect
                    id="quantityUnit"
                    name="quantityUnit"
                    list={quantityUnit}
                  />
                </div>
              </div>
              <div className={styles.rowWrapper}>
                <div className={styles.minBetAndPriceWrapper}>
                  {values.lotType === 'AUCTIONED' && (
                    <div className={styles.betAndPrice}>
                      <label htmlFor="minPrice">Starting lot price</label>
                      <CustomTextField
                        handleKeyPress={handleKeyPress}
                        placeholder="Enter the min price"
                        id="minPrice"
                        name="minPrice"
                      />
                    </div>
                  )}
                  <div
                    className={
                      values.lotType === 'NOT_AUCTIONED'
                        ? `${styles.betAndPrice} ${styles.fullWidthPrice}`
                        : styles.betAndPrice
                    }
                  >
                    <label htmlFor="price">Price</label>
                    <CustomTextField
                      handleKeyPress={handleKeyPress}
                      placeholder="Enter the price"
                      id="price"
                      name="price"
                    />
                  </div>
                </div>
                <div className={styles.notFullWidth}>
                  <CustomSelect id="currency" name="currency" list={currency} />
                </div>
              </div>
              {values.lotType === 'AUCTIONED' && (
                <div className={styles.expirationDateWrapper}>
                  <label>Lot Lifetime Period</label>
                  <div className={styles.expirationDate}>
                    <label className={styles.expirationDateOption}>
                      days
                      <CustomTextField
                        handleKeyPress={handleKeyPress}
                        placeholder="days"
                        id="days"
                        name="days"
                      />
                    </label>
                    <label className={styles.expirationDateOption}>
                      hours
                      <CustomTextField
                        handleKeyPress={handleKeyPress}
                        placeholder="hours"
                        id="hours"
                        name="hours"
                      />
                    </label>
                    <label className={styles.expirationDateOption}>
                      minutes
                      <CustomTextField
                        handleKeyPress={handleKeyPress}
                        placeholder="minutes"
                        id="minutes"
                        name="minutes"
                      />
                    </label>
                  </div>
                  <p
                    className={
                      lifetimeTooShort
                        ? `${styles.hint} ${styles.lifetimeError}`
                        : styles.hint
                    }
                  >
                    * minimum expiration date of 5 minutes
                  </p>
                  <p
                    className={
                      lifetimeTooLong
                        ? `${styles.hint} ${styles.lifetimeError}`
                        : styles.hint
                    }
                  >
                    * maximum expiration date of 7 days
                  </p>
                </div>
              )}
            </div>
            <label>Product images</label>
            <Dropzone
              maxImagesPerDrop={maxImagesPerDrop}
              setMaxImagesPerDrop={setMaxImagesPerDrop}
            />
            <div className={styles.btnContainer}>
              <Link
                to="/new_lot_preview"
                onClick={() => {
                  setPreviewLotInfo(values);
                  window.scrollTo(0, 0);
                }}
              >
                <CustomWhiteButton
                  content="Preview"
                  disabled={
                    !isValid ||
                    !isDisabled ||
                    !files.length ||
                    lifetimeTooShort ||
                    lifetimeTooLong
                  }
                  hint="Fill out the form completely for a preview"
                />
              </Link>
              <CustomGreenButton
                type="submit"
                content={`${editMode ? 'Update' : 'Place'} an advertisement`}
                disabled={
                  !isValid ||
                  !isDisabled ||
                  !files.length ||
                  lifetimeTooShort ||
                  lifetimeTooLong
                }
                hint={`Fill out the form completely to ${editMode ? 'update' : 'place'} an advert`}
              />
            </div>
            <p className={styles.infoAfterSubmiting}>
              This ad will be placed on the site after review by a moderator and
              will be valid for the next 30 days.
            </p>
            <AutoCheckOfFieldsForCompleteness />
          </Form>
        );
      }}
    </Formik>
  );
};
