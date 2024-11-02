
const Header: React.FC = () => {
  return (
    <header>
        <nav>
            <h1>BookMarkt</h1>
            <ul>
                <li><a href="/library">Library</a></li>
                <li><a href="/cart">Cart</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    </header>
  );
};

export default Header;
