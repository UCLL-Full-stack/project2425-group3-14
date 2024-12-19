import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CartService from '@/services/CartService';
import { CartItem } from '@/types';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [cartAmount, setCartAmount] = useState(0);
  const router = useRouter();

  const fetchCartAmount = async () => {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      const cartId = parsedUser.cartId;

      if (cartId) {
        try {
          const response = await CartService.allBooksInCart(cartId);

          if (response.ok) {
            const data = await response.json();
            const totalQuantity = data.items?.reduce(
              (total: number, item: CartItem) => total + item.quantityInCart,
              0
            );
            setCartAmount(totalQuantity || 0);
          } else {
            console.error("Failed to fetch cart data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    }
  };
  useEffect(() => {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setIsAdmin(parsedUser.role === 'admin' || parsedUser.role === 'ADMIN');
      setIsGuest(parsedUser.role === 'guest');
      fetchCartAmount();
      console.log('test '+ parsedUser);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCartAmount(0);
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
