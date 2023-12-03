import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Legend from '@arcgis/core/widgets/Legend';
import Color from "@arcgis/core/Color.js";
import TextContent from "@arcgis/core/popup/content/TextContent.js";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
//import AppContext from './Components/Helpers/Context';
import React, { lazy, useEffect, useState, useRef } from 'react'
import esriConfig from '@arcgis/core/config'
//esriConfig.assetsPath = "./assets";
esriConfig.apiKey = "AAPK18e830016dbd40b0af6745daf1b6953exTFDCUwpr9qIlV-BFCsg103Ue7W02PrSQAiA5dpNy2siucAlXxqnjp0pCKggNQeZ";


function App() {
  const mapRef = useRef();
  const legendRef = useRef();

  //implementing simple renderer
  let cityRenderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    symbol: {
      type: "simple-line",  // autocasts as new SimpleMarkerSymbol()
      size: 6,
      color: "red",

    }
  };

  //implementing uniquevalues  renderer
  let uniqiuerenderer = {
    type: "unique-value",  // autocasts as new UniqueValueRenderer()
    field: "AREA_NAME",
    defaultSymbol: { type: "none" },  // autocasts as new SimpleFillSymbol()
    uniqueValueInfos: [{
      // All features with value of "North" will be blue
      value: "Scarborough Southwest",
      symbol: {
        //create an outline with fill effect
        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        outline: {  // autocasts as new SimpleLineSymbol()
          width: 2,
          color: new Color("rgb(0, 255, 0)")
        },
        color: new Color("rgba(0, 255, 0, 0.5)")//"blue"
      }
    }, {
      // All features with value of "East" will be green
      value: "University-Rosedale",
      symbol: {
        type: "simple-line",  // autocasts as new SimpleFillSymbol()
        color: "green"
      }
    }, {
      // All features with value of "South" will be red
      value: "Willowdale",
      symbol: {
        type: "simple-line",  // autocasts as new SimpleFillSymbol()
        color: "red"
      }
    }, {
      // All features with value of "West" will be yellow
      value: "York Centre",
      symbol: {
        type: "simple-line",  // autocasts as new SimpleFillSymbol()
        color: "yellow"
      }
    }],
    /*
        visualVariables: [{
          type: "opacity",
          field: "POPULATION",
          normalizationField: "SQ_KM",
          // features with 30 ppl/sq km or below are assigned the first opacity value
          stops: [{ value: 100, opacity: 0.15 },
                  { value: 1000, opacity: 0.90 }]
        }]
    */
  };


  ////
  const citywardsLabelClass = new LabelClass({
    labelExpressionInfo: { expression: "$feature.AREA_NAME" },
    symbol: {
      type: "text",  // autocasts as new TextSymbol()
      color: "black",
      haloSize: 1,
      haloColor: "white"
    }
  });


  const TorontyCityWards = new FeatureLayer({
    url: "https://gis.toronto.ca/arcgis/rest/services/cot_geospatial11/MapServer/0",
    renderer: uniqiuerenderer,//cityRenderer,
    labelingInfo: [citywardsLabelClass]


  })

  TorontyCityWards.popupTemplate = {
    content: formatContent,
    outFields: ["*"],
    lastEditInfoEnabled: false,
    fieldInfos: [
      {
        fieldName: "name"
      }],
    actions: [
      {
        id: "Nose-per-ward",
        image: "",
        title: "Noise Info"
      }
    ],
  }


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
  let v = { "output": "device-stats.data", "outputs": { "id": "device-stats", "property": "data" }, "inputs": [{ "id": "id-selection", "property": "value", "value": "b88" }], "changedPropIds": ["id-selection.value"] }
  v = JSON.stringify(v);
  //v = JSON.parse(v);
  function formatContent(event) {
    let tempurl = "https://noise-dashboard-651f4e432386.herokuapp.com/_dash-update-component";
    let testdata = { output: "device-stats.data", outputs: { id: "device-stats", property: "data" }, inputs: [{ id: "id-selection", property: "value", value: "b88" }], changedPropIds: ["id-selection.value"] }

    fetch(tempurl, {
      method: 'post',
      body: v,
      credentials: "include",
      mode: 'cors'



    }).then((res) => console.log(res));
    const attributes = event.graphic.attributes;
    let text = "";
    text += attributes.AREA_NAME;
    console.log(attributes)
    // text += attributes.name;
    // Only display the attributes if they exist
    /*     text += attributes.website
          ? `Brewery: <a href="${attributes.website}">${attributes.name}</a><br>`
          : `Brewery: ${attributes.name}<br>`;
        text += attributes.address1 ? `Address:<br>${attributes.address1}<br>` : `Located in: `;
        text += attributes.city && attributes.state ? `${attributes.city},${attributes.state}<br>` : ``;
        text += attributes.phone !== null ? `Phone:${attributes.phone}` : ``; */
    let textElement = new TextContent({
      text: text
    });
    return [textElement];
  }

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
          layer: TorontyCityWards
        }
      ]
    });
    view.ui.add(legend, "bottom-left");
    view.ui.add(legendRef.current, "top-right");
    //pop up

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
    <div className="App">
      <div className="map-container" ref={mapRef} style={mapStyle} />
      <div className="esri-widget" ref={legendRef} />
    </div>
  );
}

export default App;
