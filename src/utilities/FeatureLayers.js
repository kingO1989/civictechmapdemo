import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TextContent from "@arcgis/core/popup/content/TextContent.js";
import { Uniquerenderer, CitywardsLabelClass } from "./featurestyles";



let popupTemplate = {
    content: formatContent,
    outFields: ["*"],
    lastEditInfoEnabled: false,
    fieldInfos: [
        {
            fieldName: "name"
        }],
    actions: [
        {
            id: "Noise-per-ward",
            image: "https://noise-dashboard-651f4e432386.herokuapp.com/_favicon.ico?v=2.14.0",
            title: "Noise Info"
        }
    ],
}

async function formatContent(event) {

    const attributes = event.graphic.attributes;
    let deviceid = "";
    if (attributes.AREA_NAME === 'Scarborough Southwest') {
        deviceid = "0xe7db8994";
    }
    else if (attributes.AREA_NAME === 'Willowdale') {
        deviceid = "b88";
    }
    else if (attributes.AREA_NAME === 'York Centre') {
        deviceid = "a99";
    }
    else if (attributes.AREA_NAME === 'University-Rosedale') {
        deviceid = "gabe1";
    }
    let text = "";
    let tempurl = `https://noisemeter.webcomand.com/io_comand_webservice/get?token=UPooYuLm4Zwu859Ehidgl5Ta19iuKTUG&format=application/json&query=SELECT Timestamp,DeviceID,Min,Max FROM Noise WHERE DeviceID='${deviceid}' ORDER BY Timestamp DESC LIMIT 50`;
    var response = await fetch(tempurl, {
        method: 'GET',

    })
    let temp = await response.json()
    let values = await temp.contents[0];
    //console.log(event);
    text += attributes.AREA_NAME + "<br>";
    text += `Device ID: ${values.DeviceID} <br>`;
    text += `Max Decibel: ${values.Max} <br>`;
    text += `Min Decibel: ${values.Min} <br>`;
    text += `Timestamp: ${values.Timestamp} <br>`;
    console.log(attributes)
    let textElement = new TextContent({
        text: text
    });
    return [textElement];
}

export const TorontyCityWards = new FeatureLayer({
    url: "https://gis.toronto.ca/arcgis/rest/services/cot_geospatial11/MapServer/0",
    renderer: Uniquerenderer,//cityRenderer,
    labelingInfo: [CitywardsLabelClass],
    popupTemplate: popupTemplate,


})

