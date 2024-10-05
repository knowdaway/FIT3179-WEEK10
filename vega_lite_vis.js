function createBarChart(){
    let selectedRegions = ["New South Wales"];
    var barSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        width: 600,
        height: 400,
        data: { url: "./waterusage.json" },
        transform:[
            {
                fold: ["domestic", "industrial", "irrigation"],
                as:["WaterType", "Amount"],
        },
        {
            filter:{field:"region", oneOf:selectedRegions},
        }
      ],
      mark:"bar",
      encoding:{
        x:{
            field:"region",
            type: "nominal",
            title: "Region"
        },
        y:{
            field:"Amount",
            type: "quantitative",
            title: "Water Usage(megaliter)"
        },
        color:{
            field:"WaterType",
            type: "nominal",
            title: "Water Type"
        },
        tooltip:[
            {
                field:"region",
                type: "nominal",
                title: "Region"
            },
            {
                field:"Amount",
                type: "quantitative",
                title: "Water Usage(megaliter)"
            },
            {
                field:"WaterType",
                type: "nominal",
                title: "Water Type"
            },
    ]
      }
    };
    function updateBarChart() {
        let selectedOptions = Array.from(
          document.getElementById("regionSelect").selectedOptions
        ).map((option) => option.value);
    
        selectedRegions = selectedOptions.length
          ? selectedOptions
          : ["New South Wales"];
    
        barSpec.transform[1].filter = { field: "region", oneOf: selectedRegions };
        vegaEmbed("#bar-chart", barSpec).catch(console.error);
      }
    
      document
        .getElementById("regionSelect")
        .addEventListener("change", updateBarChart);
    
      vegaEmbed("#bar-chart", barSpec).catch(console.error);
    }

    function createMap() {
        let selectedRegions = ["New South Wales"];
        var mapSpec = {
          $schema: "https://vega.github.io/schema/vega-lite/v5.json",
          width: 600,
          height: 400,
          data: {
            url: "./map.json",
            format: {
              type: "topojson",
              feature: "collection",
            },
          },
          transform: [
            {
              lookup: "properties.STATE_NAME",
              from: {
                data: {
                  url: "./waterresources.json",
                },
                key: "state",
                fields: ["rainfall_mm"],
              },
            },
            {
                filter:{field:"properties.STATE_NAME", oneOf:selectedRegions},
            }
    
          ],
          projection: {
            type: "mercator",
            scale: 700,
            center: [133, -27],
            fit: true,
          },
          layer: [
            {
              mark: {
                type: "geoshape",
                stroke: "black",
                strokeWidth: 0.5,
              },
              encoding: {
                color: {
                  field: "rainfall_mm",
                  type: "quantitative",
                  scale: {
                    scheme: "blues",
                    domain: [200, 1200],
                  },
                  title: "Rainfall (mm)",
                },
                tooltip: [
                  { field: "properties.STATE_NAME", type: "nominal", title: "Region" },
                  {
                    field: "rainfall_mm",
                    type: "quantitative",
                    title: "Rainfall (mm)",
                  },
                ],
              },
            },
            {
              data: { graticule: true },
              mark: {
                type: "geoshape",
                stroke: "lightgray",
                strokeWidth: 0.5,
              },
            },
          ],
          config: {
            background: "#f0f0f0",
          },
        };
        function updatemap() {
            let selectedOptions = Array.from(
              document.getElementById("regionSelect").selectedOptions
            ).map((option) => option.value);
        
            selectedRegions = selectedOptions.length
              ? selectedOptions
              : ["New South Wales"];
        
            mapSpec.transform[1].filter = { field: "properties.STATE_NAME", oneOf: selectedRegions };
            vegaEmbed("#map", mapSpec).catch(console.error);
          }
        
          document
            .getElementById("regionSelect")
            .addEventListener("change", updatemap);
           vegaEmbed("#map", mapSpec).catch(console.error);
      }