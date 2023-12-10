// frontend/src/components/Navigation/index.js
// import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

export default function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      {/* <li>
        <NavLink exact to="/">Home</NavLink>
      </li> */}
        <li>
          <ProfileButton user={sessionUser} />
        </li>
    </ul>
  );
}
