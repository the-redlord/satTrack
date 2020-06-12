import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Line,
  Sphere,
  Marker
} from "react-simple-maps";
import { PatternLines } from "@vx/pattern";
import data from './world-110m.json';
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';

const geoUrl = data;

function generateCircle(deg) {
  if (!deg) return [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]];
  return new Array(361).fill(1).map((d, i) => {
    return [-180 + i, deg];
  });
}

function MapChart() {
    const [markers,setMarkers] = useState([
        {
          markerOffset: -15,
          name: "ISS",
          coordinates: [-30.3816, -34.6037]
        }
      ]);
/*
      const [issData,setIssData] = useState([
          {
              speed: 0,
              altitude: 0,
              lat: 0,
              long: 0
          }
      ]);
*/
      async function apiCall(){
        const response = await axios.get(`https://sat-track.azurewebsites.net/api/iss`);
        console.log(response.data.data)
        //console.log(`Latitude -> ${response.data.data.Latitude} , Longitude -> ${response.data.data.Longitude}`)
        setMarkers([{
            markerOffset: -15,
            name: "ISS",
            coordinates: [response.data.data.Latitude, response.data.data.Longitude]
          }]);
/*
          setIssData([
              {
                speed: 0,
                altitude: response.data.data["Elevation-m"],
                lat: 0,
                long: 0
              }
          ]);
*/
      }

      useEffect(()=>{
        apiCall();
      },[]);

      useEffect(()=>{  
        const timer = setInterval(()=>{
            apiCall();
        },6000);
        return () => clearInterval(timer);
      },[markers]);


  return (
    <ComposableMap projection="geoEqualEarth" width={980} height={480}>
      <PatternLines
        id="lines"
        height={6}
        width={6}
        stroke="#776865"
        strokeWidth={1}
        background="#F6F0E9"
        orientation={["diagonal"]}
      />
      <Sphere stroke="#DDD" />
      <Graticule stroke="#DDD" />
      <Geographies geography={geoUrl} stroke="#FFF" strokeWidth={0.5}>
        {({ geographies }) =>
          geographies.map(geo => {
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={"#000"}
                onClick={() => console.log(geo.properties.ISO_A3)}
              />
            );
          })
        }
      </Geographies>
      {markers.map(({ name, coordinates, markerOffset }) => (
        <Marker key={name} coordinates={coordinates}>
            <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
          <text
            textAnchor="middle"
            y={markerOffset}
            style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
          >
            {name}
          </text>
        </Marker>
      ))}
      <Line coordinates={generateCircle(0)} stroke="#F53" strokeWidth={2} />
      <Line
        coordinates={generateCircle(23)}
        stroke="#776865"
        strokeWidth={1}
        strokeDasharray={[5, 5]}
      />
      <Line
        coordinates={generateCircle(-24)}
        stroke="#776865"
        strokeWidth={1}
        strokeDasharray={[5, 5]}
      />
    </ComposableMap>
  );
}

export default MapChart;
