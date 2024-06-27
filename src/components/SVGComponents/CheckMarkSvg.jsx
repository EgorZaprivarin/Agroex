const CheckMarkSvg = ({ disabled }) => {

  return (
    <svg
      width="20.000000"
      height="20.000000"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <clipPath id="clip64_72731">
          <rect
            id="icon / checkmark"
            width="20.000000"
            height="20.000000"
            fill="white"
            fillOpacity="0"
          />
        </clipPath>
      </defs>
      <rect
        id="icon / checkmark"
        width="20.000000"
        height="20.000000"
        fillOpacity="0"
      />
      <g clipPath="url(#clip64_72731)">
        <path
          id="Vector"
          d="M8.33398 12.6431L15.9932 4.98242L17.1729 6.16064L8.33398 15L3.03027 9.69678L4.20898 8.51807L8.33398 12.6431Z"
          fill={disabled ? '#BCC3C3' : '#fff'}
          fillOpacity="1.000000"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};

export default CheckMarkSvg;
