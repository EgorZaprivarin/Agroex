import { useState, useEffect, useContext } from 'react';

import { Context } from '../../context/context.js';

import ImageGallery from 'react-image-gallery';

import 'react-image-gallery/styles/scss/image-gallery.scss';
import './LotCarousel.scss';

const LotCarousel = ({ target,  lotInfo }) => {
  const {
    files,
    setFiles,
  } = useContext(Context);
  const [renderPermission, setRenderPermission] = useState(false);

  const titleFileIndex = files.findIndex((file) => file.title);
  const titleImageIndex = Object.keys(lotInfo).length && lotInfo.images.findIndex((file) => file.title);

  useEffect(() => {
    // Создаем массив Blob объектов из URL изображений
    if (files?.length) {
      setFiles(() => [
        ...files.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      ]);

      setRenderPermission(true);
    }

    // Освобождаем Blob объекты при размонтировании компонента
    return () => {
      files.length && files.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const lotImages = Object.keys(lotInfo).length > 0 && lotInfo.images.length ? lotInfo.images.map(image => ({
    original: image.imageUrl,
    originalAlt: 'lot image',
    thumbnail: image.imageUrl,
    thumbnailAlt: 'lot image',
  })) : ([{
    original:  '/images/noImageAvailable.jpg',
    originalAlt: 'lot image'
  }]);

  const modifiedFiles = renderPermission ? files.map(file => ({
    original:  file.preview,
    originalAlt: 'lot image',
    thumbnail: file.preview,
    thumbnailAlt: 'lot image',
  })) : ([{
      original:  '/images/noImageAvailable.jpg',
      originalAlt: 'lot image'
  }]);

  const images = target === 'preview' ? modifiedFiles : lotImages;
  const titleImg = target === 'preview' ? titleFileIndex : titleImageIndex;

  return (
    <div className="carouselWrapper">
      <ImageGallery
        items={images}
        infinite={false}
        showFullscreenButton={false}
        showPlayButton={false}
        showThumbnails={images.length > 1}
        startIndex={titleImg < 0 ? 0 : titleImg}
      />
    </div>
  );
}

export default LotCarousel;
