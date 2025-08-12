
import Ethereum from '../icons/ethereum';
import Hedera from '../icons/hedera';
import Fet from '../icons/fet';
import Polygon from '../icons/polygon';
import Link from '../icons/link';
import Pepe from '../icons/pepe';
import Uniswap from '../icons/uniswap';
import Render from '../icons/render.png';
import Bera from '../icons/bera.png';

const cryptoIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  ETHUSDT: Ethereum,
  HBARUSDT: Hedera,
  FETUSDT: Fet,
  POLUSDT: Polygon,
  LINKUSDT: Link,
  PEPEUSDT: Pepe,
  UNIUSDT: Uniswap,
  RNDRUSDT: Render,
  BERAUSDT: Bera
};

export default cryptoIcons;
