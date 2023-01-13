import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { DashboardCard, DeviceCard, WaterConsumptionObservedCard, IndoorEnvironmentObservedCard, WeatherObservedCard } from "../components/DashboardCard";
import "./dashboard.css"

const Dashboard = () => {
    const [state, setState] = useState({ timestamp: 0, entities: [] });

    const updateState = (s, obj) => {
        var newState = {
            timestamp: Date.now(),
            entities: []
        }

        const i = s.entities.findIndex(x => x.id === obj.id);

        if (i > -1) {
            s.entities[i] = obj;
            newState.entities = [...s.entities]
        } else {
            newState.entities = [...s.entities, obj]
        }

        console.log(newState)

        return newState;
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchEventSource(`/events/channel-1`, {
                onopen(res) {
                    if (res.ok && res.status === 200) {
                        console.log("Connection made ", res);
                    } else if (
                        res.status >= 400 &&
                        res.status < 500 &&
                        res.status !== 429
                    ) {
                        console.log("Client side error ", res);
                    }
                },
                onmessage(event) {
                    const obj = JSON.parse(event.data);
                    console.log(obj)
                    setState((s) => updateState(s, obj))
                },
                onclose() {
                    console.log("Connection closed by the server");
                },
                onerror(err) {
                    console.log("There was an error from server", err);
                },
            });
        };

        fetchData();
    }, []);

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

