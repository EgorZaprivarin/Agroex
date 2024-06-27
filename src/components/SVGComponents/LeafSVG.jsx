import './iconSvg.scss';

const Leaf = ({ active }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
      >
        <path
          className="leaf"
          d="M6.5 3C9.99 3 12.883 5.554 13.413 8.895C14.588 7.724 16.21 7 18 7H22.5V9.5C22.5 13.09 19.59 16 16 16H13.5V21H11.5V13H9.5C5.634 13 2.5 9.866 2.5 6V3H6.5ZM20.5 9H18C15.515 9 13.5 11.015 13.5 13.5V14H16C18.485 14 20.5 11.985 20.5 9.5V9ZM6.5 5H4.5V6C4.5 8.761 6.739 11 9.5 11H11.5V10C11.5 7.239 9.261 5 6.5 5Z"
          fill={active ? '#51ACAE' : '#798787'}
        />
      </svg>
    </>
  );
};

export default Leaf;
