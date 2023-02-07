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
                            <a href="https://hajk2-002t-it-auto-showcase.apps.ocptest.gbgpaas.se/" target="_blank" rel="noopener noreferrer">
                                Sensordata på karta
                            </a>
                        </li>
                        <li>
                            <a href="https://grafana-002t-it-auto-showcase.apps.ocptest.gbgpaas.se/d/iWl2q80Vz/showcase?orgId=1&refresh=1m" target="_blank" rel="noopener noreferrer">
                                Historisk sensordata
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
};

export default Header;