import { NavLink } from 'react-router-dom';
import { APP_TITLE, APP_SUBTITLE } from '../constants';

const Home = () => {
  return (
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>{APP_TITLE}</h2>
      <p>{APP_SUBTITLE}</p>
      <p>
        DesiMug Social Kart is a marketplace for Indian artisan goods, paired
        with a social feed where sellers and buyers post updates.
      </p>
      <ul>
        <li>
          <NavLink to="/market">Market Place</NavLink> — browse, add, edit and
          delete products.
        </li>
        <li>
          <NavLink to="/users">Users</NavLink> — see everyone registered on
          the platform.
        </li>
      </ul>
    </div>
  );
};

export default Home;
