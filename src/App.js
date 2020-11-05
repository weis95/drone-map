import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    Polyline
} from "@react-google-maps/api";

import styles from "./styles";

const container = {
    height: "50vh",
    width: "70vw",
};

const options = {
    styles: styles,
    disableDefaultUI: true,
    zoomControl: true,
};

const center = {
    lat: 46.5197,
    lng: 6.6323,
};

export default function App() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: APIKEY,
    });

    const [markers, setMarkers] = React.useState([]);

    const handleClick = React.useCallback((e) => {
        setMarkers((current) => [
            ...current,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            },
        ]);
    }, []);

    const handleRemove = (index) => {
        const temp = markers;
        temp.splice(index, 1);
        setMarkers((temp) => [
            ...temp
        ]);
    }

    const handleSave = () => {
        localStorage.setItem("markers", JSON.stringify(markers));
    }

    const handleLoad = (storedMarkers) => {
        const savedMarkers = storedMarkers;
        setMarkers(savedMarkers);
   } 

    React.useEffect(() => {
        if(localStorage.getItem("markers")){
            const storedMarkers = JSON.parse(localStorage.getItem("markers"));
            handleLoad(storedMarkers);
        } else {
            const storedMarkers = [];
            handleLoad(storedMarkers);
        }
    }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    return (
        <React.Fragment>
            <div className="header">

                <h1>
                    Drone Flight Planner
                </h1>

                <button 
                    className="save"
                    onClick={handleSave}
                >
                    Save Route
                </button>
                
            </div>
            
            <div className="container">

                <GoogleMap
                    mapContainerStyle={container}
                    zoom={16}
                    center={center}
                    options={options}
                    onClick={handleClick}
                >
                    {markers.map((marker) => (
                        <Marker
                            key={`${marker.lat}-${marker.lng}`}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            icon={{
                            url: `/drone.svg`,
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                            scaledSize: new window.google.maps.Size(30, 30),
                            }}
                        />
                    ))}

                    <Polyline
                        path={markers}
                        geodesic={true}
                        options={{
                            strokeColor: "#99999",
                            strokeOpacity: 1,
                            strokeWeight: 2,
                        }}
                    />

                </GoogleMap>

                <div>
                    {markers.map((marker, index) => (
                        <div className="cords" key={index}> 
                            <p>Lat:{ marker.lat }</p>
                            <p>Lng: { marker.lng }</p>
                            <button onClick={() => handleRemove(index)}>Remove</button>
                        </div>
                    ))}
                </div>
            </div>
            
        </React.Fragment>
    );
}


