import logo from '../../assets/icons/footer/Logo.svg';
import message from '../../assets/icons/footer/Message.svg';
import tg from '../../assets/icons/footer/Telegram.svg';
import inst from '../../assets/icons/footer/Inst.svg';
import facebook from '../../assets/icons/footer/Facebook.svg';

import styles from './Footer.module.scss';

export const Footer = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.footer}>
                <div className={styles.column}>
                    <div className={styles.rights}>
                        <div className={styles.logo}>
                            <img src={logo} alt="logo" />
                            AGROEX
                        </div>
                        <span className={styles.lightGreyColor}>2024 AGROEX. All rights received.</span>
                    </div>
                    <div className={styles.resources}>
                        <div className={styles.alignCenter}>
                            <ul>
                                <li><a href=""><span className={styles.lightGreyColor}>PORTAL</span></a></li>
                                <li><a href="">About Agroex</a></li>
                                <li><a href="">Category map</a></li>
                                <li><a href="">Cookie files</a></li>
                            </ul>
                        </div>
                        <div className={styles.alignCenter}>
                            <ul>
                                <li><a href=""><span className={styles.lightGreyColor}>RESOURCES</span></a></li>
                                <li><a href="">Terms of Use</a></li>
                                <li><a href="">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className={styles.alignCenter}>
                            <ul>
                                <li><a href=""><span className={styles.lightGreyColor}>RESOURCES</span></a></li>
                                <li><a href="">Support</a></li>
                                <li><a href="">Help</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.contacts}>
                    <ul className={`${styles.column} ${styles.icons_gap} `}>
                        <li>
                            <a href="">
                                <img src={message} alt="message" />
                                Contact us
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <img src={tg} alt="telegram" />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <img src={inst} alt="instagram" />
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <img src={facebook} alt="facebook" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};