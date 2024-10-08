import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const GuestHeader = () => {
    const [version, setVersion] = useState('');

    useEffect(() => {
        fetchVersion();
    }, []);

    const fetchVersion = async () => {
        try {
            const response = await axios.get('version/get');
            const data = response.data;
            const versionString = data.toString();
            setVersion(versionString);
        } catch (error) {
            console.error('Error fetching version:', error);
        }
    };

    return (
        <Fragment>
            <nav className="navbar navbar-expand-lg bg-light pb-1 pt-0 mb-2">
                <div className="container-fluid">
                    <NavLink className="navbar-brand ms-2 app-primary-color" to="/home">
                    <img className="accel-logo pt-0" src="/images/logo.1.0.png" />
                        {/* <span className="version">V.{version}</span> */}
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {/* TODOS this is commented for the time-being */}
                    {/* <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <NavLink className="text-decoration-none mt-1 text-muted" to="/login">
                                Login
                            </NavLink>
                        </ul>
                    </div> */}
                </div>
            </nav>
        </Fragment>
    );
}

const NavItem = ({ text, href }: { text: string; href: string }) => {
    return (
        <li className="nav-item">
            <NavLink exact to={href} activeClassName="active" className="nav-link">
                {text}
            </NavLink>
        </li>
    );
}