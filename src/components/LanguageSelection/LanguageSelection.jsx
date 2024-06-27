import { useContext, useState } from 'react';

import { Context } from '../../context/context.js';

import styles from './LanguageSelection.module.scss';

import USD from '../../assets/icons/header/flag.svg';
import EURO from '../../assets/icons/header/EURO.png';
import RU from '../../assets/icons/header/RU.svg';
import BY from '../../assets/icons/header/BY.png';

const LanguageSelection = () => {
  const { currentCurrency, setCurrentCurrency } = useContext(Context);

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const currencyList = [
    { name: 'USD', img: USD, hintText: 'U.S. Dollar' },
    { name: 'EUR', img: EURO, hintText: 'Euro' },
    { name: 'BYN', img: BY, hintText: 'Belarusian ruble' },
    { name: 'RUB', img: RU, hintText: 'Russian ruble' },
  ];

  const handleShowOptions = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const handleChangeCurrency = (option) => {
    setCurrentCurrency({
      name: option.name,
      img: option.img,
    })
  };

  const renderCurrencyList = currencyList.map((option, id) => {
    return (
      <li
        key={id}
        className={currentCurrency.name === option.name
          ? `${styles.option} ${styles.selectedCurrency}`
          : styles.option}
        onClick={() => handleChangeCurrency(option)}
      >
        <div className={styles.optionValue}>
          {option.name}
          <img src={option.img} alt="flag" />
        </div>
        <p className={styles.hintText}>{option.hintText}</p>
      </li>
    );
  })

  return (
    <div
      className={styles.item}
      onClick={handleShowOptions}
    >
      {currentCurrency.name}
      <img src={currentCurrency.img} alt="flag" />
      <ul className={isOpenMenu ? `${styles.currencyOptions} ${styles.visibleOptions}` : styles.currencyOptions}>
        {renderCurrencyList}
      </ul>
    </div>
  );
};

export default LanguageSelection;