import './header.css'
import Logo from "../Logo"

const Header = () => {
    return (
        <header class="main-header">
            <div class="container">
                <h1 class="mh-logo">
                    <Logo />
                </h1>
                <nav class="main-nav">
                    <ul class="main-nav-list">
                        <li>
                            <a href="#">Sensordata på karta</a>
                        </li>
                        <li>
                            <a href="#">Historisk sensordata</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
};

export default Header;