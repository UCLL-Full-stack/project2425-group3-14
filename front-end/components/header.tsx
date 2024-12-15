import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setIsAdmin(parsedUser.role === 'admin' || parsedUser.role === 'ADMIN');
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push('/login');
  };

  return (
    <header>
      <nav>
        <a href="/" className="header1"><h1>Book<span className="blue-text">Markt</span></h1></a>
        <ul>
          {isAdmin && <li><a href="/users">Users</a></li>}
          <li><a href="/library">Library</a></li>
          <li><a href="/cart">Cart</a></li>
          {!isLoggedIn && <li><a href="/login">Login</a></li>}
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
