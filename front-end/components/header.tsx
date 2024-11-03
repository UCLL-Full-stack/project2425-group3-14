
const Header: React.FC = () => {
  return (
    <header>
        <nav>
            <h1>Book<span className="blue-text">Markt</span></h1>
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
