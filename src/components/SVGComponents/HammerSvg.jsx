const HammerSvg = ({ active }) => {
  return (
    <>
      <svg
        width="24.000000"
        height="24.000000"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <clipPath id="clip42_76998">
            <rect
              id="icon / auction"
              width="24.000000"
              height="24.000000"
              fill="white"
              fillOpacity="0"
            />
          </clipPath>
        </defs>
        <rect
          id="icon / auction"
          width="24.000000"
          height="24.000000"
          fill="#FFFFFF"
          fillOpacity="0"
        />
        <g clipPath="url(#clip42_76998)">
          <path
            id="Vector"
            d="M14 20L14 22L2 22L2 20L14 20ZM14.5859 0.686005L22.3643 8.464L20.9502 9.88L19.8896 9.526L17.4131 12L23.0703 17.657L21.6562 19.071L16 13.414L13.5957 15.818L13.8789 16.95L12.4639 18.364L4.68604 10.586L6.10107 9.172L7.23096 9.45401L13.5254 3.16101L13.1719 2.101L14.5859 0.686005ZM15.293 4.222L8.22217 11.292L11.7568 14.828L18.8281 7.75801L15.293 4.222Z"
            fill={active ? '#51ACAE' : '#798787'}
            fillOpacity="1.000000"
            fillRule="nonzero"
          />
        </g>
      </svg>
    </>
  );
};

export default HammerSvg;
