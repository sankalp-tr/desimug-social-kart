import { NavLink } from "react-router-dom";
import UserProfile from "./user/UserProfile";
import './Header.scss';

const DesiHeader = () => {
    return (
        <header>
            <div className="header-container">
                <div className="header-nav-content">
                    <nav>
                        <NavLink to='/'>Home</NavLink>&nbsp;|&nbsp;
                        <NavLink to='/my-feed'>My Feed</NavLink>&nbsp;|&nbsp;
                        <NavLink to='/market'>Market Place</NavLink>&nbsp;|&nbsp;
                        <NavLink to='/users'>Users</NavLink>&nbsp;|&nbsp;
                        <NavLink to='/tutorials'>Tutorials</NavLink>
                    </nav>
                </div>
                <div className="header-user-profile-content">
                    <UserProfile />
                </div>
            </div>
        </header>
    )
};

export default DesiHeader;