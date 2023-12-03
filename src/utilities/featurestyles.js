import Color from "@arcgis/core/Color.js";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";

//implementing uniquevalues  renderer
export const Uniquerenderer = {
    type: "unique-value",
    field: "AREA_NAME",
    defaultSymbol: { type: "none" },
    uniqueValueInfos: [{

        value: "Scarborough Southwest",
        symbol: {

            type: "simple-fill",
            outline: {
                width: 2,
                color: new Color("rgb(0, 255, 0)")
            },
            color: new Color("rgba(0, 255, 0, 0.5)")
        }
    }, {

        value: "University-Rosedale",
        symbol: {
            type: "simple-fill",
            outline: {
                width: 2,
                color: new Color("rgb(255, 255, 0)")
            },
            color: new Color("rgba(255, 255, 0,0.5)")
        }
    }, {

        value: "Willowdale",
        symbol: {
            type: "simple-fill",
            outline: {
                width: 2,
                color: new Color("rgb(0, 0, 255)")
            },
            color: new Color("rgba(0, 0, 255,0.5)")
        }
    }, {

        value: "York Centre",
        symbol: {
            type: "simple-fill",
            outline: {
                width: 2,
                color: new Color("rgb(255, 0, 0)")
            },
            color: new Color("rgba(255, 0, 0,0.5)")
        }
    }],

};


////
export const CitywardsLabelClass = new LabelClass({
    labelExpressionInfo: { expression: "$feature.AREA_NAME" },
    symbol: {
        type: "text",
        color: "black",
        haloSize: 1,
        haloColor: "white"
    }
});

