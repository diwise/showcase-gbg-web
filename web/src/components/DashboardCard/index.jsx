import deviceIcon from './rfid-signal-64.png';
import watermeterIcon from './water-meter-64.png';
import temperatureInside from './temperature-inside-64.png';
import temperatureOutside from './temperature-outside-64.png';
import unknownIcon from './unknown-64.png';
import "./dashboardcard.css"

export const DashboardCard = ({ id, type }) => {
    return (
        <div class="card item">
            <img src={unknownIcon} alt="Unknown" />
            <div class="card-container">
                <h4><b>{type}</b></h4>
                <h5>{id}</h5>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </div>
        </div>
    )
}

export const DeviceCard = ({ id, entity }) => {
    return (
        <div class="card item">
            <img src={deviceIcon} alt={id} />
            <div class="card-container">
                <h4><b>{entity.type}</b></h4>
                <h5>{id}</h5>
                <p>{entity.status.value}<br />&nbsp;</p>
                <p>&nbsp;</p>
            </div>
        </div>
    )
};

export const WaterConsumptionObservedCard = ({ id, entity }) => {
    return (
        <div class="card item">
            <img src={watermeterIcon} alt={id} />
            <div class="card-container">
                <h4><b>{entity.type}</b></h4>
                <h5>{id}</h5>
                <p>{entity.waterConsumption.value}<br />&nbsp;</p>
                <p className="observedAt">{entity.waterConsumption.observedAt}<br />&nbsp;</p>
            </div>
        </div>
    )
};

export const IndoorEnvironmentObservedCard = ({ id, entity }) => {
    let observedAt = ""

    if (entity.temperature !== undefined) {
        observedAt = entity.temperature.observedAt;
    } else if (entity.humidity !== undefined) {
        observedAt = entity.humidity.observedAt;
    }

    return (
        <div class="card item">
            <img src={temperatureInside} alt={id} />
            <div class="card-container">
                <h4><b>{entity.type}</b></h4>
                <h5>{id}</h5>
                <p>T: {entity.temperature !== undefined ? entity.temperature.value : "-"}<br />H: {entity.humidity !== undefined ? entity.humidity.value : "-"}</p>
                <p className="observedAt">{observedAt}</p>
            </div>
        </div>
    )
};

export const WeatherObservedCard = ({ id, entity }) => {
    return (
        <div class="card item">
            <img src={temperatureOutside} alt={id} />
            <div class="card-container">
                <h4><b>{entity.type}</b></h4>
                <h5>{id}</h5>
                <p>{entity.temperature !== undefined ? entity.temperature.value : "-"}<br />&nbsp;</p>
                <p className="observedAt">{entity.temperature !== undefined ? entity.temperature.observedAt : ""}</p>
            </div>
        </div>
    )
};
