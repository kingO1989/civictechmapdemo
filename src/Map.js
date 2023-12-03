import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map'
import Legend from '@arcgis/core/widgets/Legend';
import { TorontyCityWards } from './utilities/FeatureLayers';
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import React, { lazy, useEffect, useState, useRef } from 'react'
import esriConfig from '@arcgis/core/config';
//import 'dotenv/config'
//esriConfig.assetsPath = "./assets";
esriConfig.apiKey = process.env.REACT_APP_ESR_APIKEY;

export default function NoiseMap() {

    const mapRef = useRef();
    //const legendRef = useRef();
    const mapBaseLayer = new VectorTileLayer({
        url: " https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/dark-gray",

    });


    const map = new Map(
        {
            basemap: {
                baseLayers: [mapBaseLayer],
            }

        })

    map.add(TorontyCityWards)


    useEffect(() => {


        const view = new MapView({
            container: mapRef.current,
            map: map,
            center: [-79.347015, 43.651070],
            zoom: 9
        })
        const legend = new Legend({

            view: view,
            layerInfos: [
                {
                    title: "Noise by Ward",
                    layer: TorontyCityWards
                }
            ]
        });
        view.ui.add(legend, "bottom-left");



        view.when(() => {
            reactiveUtils.on(
                () => view.popup,
                "trigger-action",
                (event) => {
                    if (event.action.id === "Noise-per-ward") {


                        const web = "https://noise-dashboard-651f4e432386.herokuapp.com/"



                        window.open(web.trim());

                    }
                }
            );
        });



        return () => {
            if (view) {
                // destroy the map view
                //view.destroy()
            }
        };
    }, [])
    const mapStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        right: 0,
    };
    return (
        <div>
            <div className="map-container" ref={mapRef} style={mapStyle} />

        </div>
    );
}