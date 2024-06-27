import { useCallback, useContext, useEffect, useState } from 'react';
import { Context } from '../../context/context.js';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import styles from './DragNDrop.module.scss';

const Dropzone = ({ maxImagesPerDrop, setMaxImagesPerDrop }) => {
  const { files, setFiles, oldLotImages, editMode } = useContext(Context);

  const maxImages = 5;
  const [isDisabled, setIsDisabled] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            id: uuidv4(),
            title: false,
          }),
        ),
      ]);
    }
  }, []);

  useEffect(() => {
    if (editMode && files.length === 0) {
      const updatedFiles = oldLotImages.map((file) => {
        return fetch(file.imageUrl)
          .then(res => res.blob())
          .then(blob => {
            const fileName = file.imageUrl.split('/').pop().split('?')[0];
            const newFile = new File([blob], fileName, { type: 'image/jpeg' });

            newFile.id = file.id;
            newFile.path = file.imageUrl;
            newFile.title = file.title;

            return Object.assign(newFile, { preview: URL.createObjectURL(newFile) });
          })
      });

      Promise.all(updatedFiles)
        .then(updatedFiles => {
          setFiles(updatedFiles);
        });
    }
  }, []);

  useEffect(() => {
    if (files.length < maxImages) {
      setMaxImagesPerDrop(maxImages - files.length);
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [files]);

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1000 * 1000,
    multiple: true,
    maxFiles: maxImagesPerDrop,
    noDrop: isDisabled,
    noClick: isDisabled,
    onDrop,
  });

  const text = isDisabled ? (
    <p className={styles.disabledText}>maximum number of images added.</p>
  ) : (
    <>
      <p className={styles.title}>
        <span>Choose a file</span> or drag and drop it here
      </p>
      <p className={styles.subTitle}>
        Acceptable formats: all. Maximum size: 10 MB.
      </p>
    </>
  );

  const removeFile = (id) => {
    setFiles((files) => files.filter((file) => file.id !== id));
  };

  const setTitleFile = (e, id) => {
    const target = e.target;

    if (target.tagName === 'DIV' || target.tagName === 'P') {
      setFiles(files.map(file => {
        if (file.id === id) {
          return changeTitle(file, !file.title);
        } else {
          return changeTitle(file, false);
        }
      }))
    }
  };

  const changeTitle = (file, title) => {
    const updatedFile = new File([file], file.name, { type: file.type });

    (updatedFile.preview = URL.createObjectURL(file)),
      (updatedFile.id = file.id);
    updatedFile.path = file.path;
    updatedFile.title = title;

    return updatedFile;
  };

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={styles.container}>
          <div>{text}</div>
        </div>
        <p
          className={styles.quantityImg}
        >{`${files.length} of ${maxImages} images`}</p>
      </div>
      <ul className={styles.imgWrapper}>
        {files.map((file) => (
          <li
            key={file.id}
            className={
              file.title ? `${styles.item} ${styles.titleImg}` : styles.item
            }
            onClick={(e) => setTitleFile(e, file.id)}
          >
            <img
              className={styles.img}
              src={file.preview}
              alt='lotImage'
              width={120}
              height={100}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            />
            <button
              className={styles.closeBtn}
              type="button"
              onClick={() => removeFile(file.id)}
            >
              <span></span>
            </button>
            <div className={styles.opacityText}>
              Make title image
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Dropzone;
