
import { DashboardCard, DeviceCard, WaterConsumptionObservedCard, IndoorEnvironmentObservedCard, WeatherObservedCard } from "../components/DashboardCard";
import "./dashboard.css"

const Dashboard = ({state}) => {
    return (
        <div className="dashboard">
            {
                state.entities.sort((a,b) => {
                    if (a.type < b.type) {
                        return -1
                    } else if (a.type > b.type) {
                        return 1
                    }
                    return 0
                }).map((entity) => {
                    switch (entity.type) {
                        case "WaterConsumptionObserved": return (<WaterConsumptionObservedCard id={entity.id} entity={entity} />)
                        case "Device": return (<DeviceCard id={entity.id} entity={entity} />)
                        case "IndoorEnvironmentObserved": return (<IndoorEnvironmentObservedCard id={entity.id} entity={entity} />)
                        case "WeatherObserved": return (<WeatherObservedCard id={entity.id} entity={entity} />)
                        default: return (<DashboardCard id={entity.id} type={entity.type} />)
                    }
                })
            }
        </div>
    )
}

export default Dashboard;

