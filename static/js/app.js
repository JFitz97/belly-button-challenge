const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Data promise
const dataP = d3.json(url);
console.log("Data Promise:", dataP);

// Fetching JSON data and console logging
d3.json(url).then(function(data) {
    console.log(data);
});

// Setup dropdown menu for ID selection
function init() {
    var dropdown = d3.select("#selDataset");
    d3.json(url).then((data) => {
        console.log(data);
        var sampleIDs = data.names;
        sampleIDs.forEach((sample) => {
            dropdown.append("option").text(sample).property("value", sample);
        });
    });
};

// Update visualizations when dropwdown ID is changed
function optionChanged(newID) {
    metaData(newID);
    barChart(newID);
    bubbleChart(newID);
};

// Build demographic table
function metaData(ID) {
    d3.json(url).then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleID => sampleID.id == ID);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        // Use html panel to display demographic data
        PANEL.html("")
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h5").text(key.toUpperCase() + ': ' + value);
        });
    });
};

// Build bar chart
function barChart(ID) {
    d3.json(url).then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleID => sampleID.id == ID);
        var result = resultArray[0];

        var barChartData = [];
        // Loop through dataset to make dictionary with desired bar chart information
        for (i = 0; i < result.otu_ids.length; i++) {
            barChartData.push({
                otu_ids: result.otu_ids[i],
                sample_values: result.sample_values[i],
                otu_labels: result.otu_labels[i]
            });
        };

        // sort sample values descending order and slice top 10
        var topTen = barChartData.sort((a,b) => a.sample_values-b.sample_values).reverse().slice(0,10);

        var sampleValues = topTen.map(val=>val.sample_values);
        var otuID = topTen.map(id=>"OTU "+id.otu_ids);
        var otuLabel = topTen.map(label=>label.otu_labels);

        // Use html panel to setup bar chart
        var PANEL = d3.select("#bar");

        PANEL.html("");
        var barData = [{
            x: sampleValues,
            y: otuID,
            text: otuLabel,
            type: "bar",
            orientation: "h"
        }];

        // Format bar chart with labels/titles
        var layout = {
            title: "Most Prevalent Bacteria",
            xaxis: {title: "OTU Values"},
            yaxis:{
                title:"OTU IDs",
                autorange:'reversed'
            }
        };

        // Use Plotly to generate bar chart
        Plotly.newPlot("BarChart", barData, layout);
    });
};

// Build bubble chart
function bubbleChart(ID) {
    d3.json(url).then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleID => sampleID.id == ID);
        var result = resultArray[0];
        var y = result.sample_values;
        var x = result.otu_ids;
        var text = result.otu_labels;

        // Use html panel to setup bubble chart
        var PANEL = d3.select("#bubble");

        PANEL.html("");
        var bubble = [{
            x: x,
            y: y,
            text: text,
            mode: 'markers',
            marker: {
                color: x,
                size: y
            }
        }];

        // Format bubble chart
        var bubbleLayout = {
            title: "Biodiversity Visualization",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "OTU Values"}
        };

        // Use Plotly to generate bubble chart
        Plotly.newPlot("BubbleChart", bubble, bubbleLayout);
    });
};

init();

// Use first ID to initialize page and populate charts
optionChanged(940)
