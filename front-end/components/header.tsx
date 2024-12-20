import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CartService from '@/services/CartService';
import { CartItem } from '@/types';

interface HeaderProps {
  cartAmount?: number; 
}

const Header: React.FC<HeaderProps> = ({ cartAmount = 0 }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [cartCount, setCartAmount] = useState<number>(cartAmount);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setIsAdmin(parsedUser.role === 'admin' || parsedUser.role === 'ADMIN');
      setIsGuest(parsedUser.role === 'guest');
      console.log('test '+ parsedUser);
    }
    
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCartAmount(0);
    sessionStorage.removeItem('cartAmount');
    router.push('/login');
  };



  return (
    <header>
      <nav>
        <a href="/" className="header1"><h1>Book<span className="blue-text">Markt</span></h1></a>
        <ul>
          {isAdmin && <li><a href="/users">Users</a></li>}

          {isLoggedIn && ( <li><a href="/library">Library</a></li> )}
          {!isGuest && isLoggedIn && (
          <li><a href="/cart">Cart {cartAmount > 0 && <span>({cartAmount})</span>}</a></li>
          )}
          {!isGuest && isLoggedIn && (
            <li><a href="/orders">Orders</a></li>)
            }
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
