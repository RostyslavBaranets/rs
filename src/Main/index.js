import Main from './index.html';
import Geme from './Game';
import './index.scss';
import htmlToElement from '../utils/htmlToElement';

const main = htmlToElement(Main);
main.append(Geme);

export default main;