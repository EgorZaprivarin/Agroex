const FlowerSvg = ({ active }) => {
  return (
    <>
      <svg
        width="19.000000"
        height="20.000000"
        viewBox="0 0 19 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <path
          id="Vector"
          d="M4 0C6.68994 0 9.02393 1.517 10.1973 3.741C11.374 2.08301 13.3096 1 15.5 1L19 1L19 3.5C19 7.09 16.0898 10 12.5 10L11 10L11 11L16 11L16 18C16 19.105 15.1055 20 14 20L6 20C4.89502 20 4 19.105 4 18L4 11L9 11L9 9L7 9C3.13379 9 0 5.866 0 2L0 0L4 0ZM14 13L6 13L6 18L14 18L14 13ZM17 3L15.5 3C13.0146 3 11 5.015 11 7.5L11 8L12.5 8C14.9854 8 17 5.985 17 3.5L17 3ZM4 2L2 2C2 4.761 4.23877 7 7 7L9 7C9 4.239 6.76123 2 4 2Z"
          fill={active ? '#51ACAE' : '#798787'}
          fillOpacity="1.000000"
          fillRule="nonzero"
        />
      </svg>
    </>
  );
};

export default FlowerSvg;
