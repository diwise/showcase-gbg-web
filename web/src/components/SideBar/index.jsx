import './sidebar.css';

const SideBar = () => {
    return (
        <div id="sideBar">
            <div>Länkar till mer sensordata</div>
            <ul>
                <li><a href="#">Sensordata på karta</a></li>
                <li><a href="#">Historisk sensordata</a></li>
            </ul>
        </div>
    )
};

export default SideBar;