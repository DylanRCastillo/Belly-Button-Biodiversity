
function buildPlots(sample) {

    // Step 1: using d3 to grab the samples data for the plots that returns...//
    d3.json("samples.json").then((data) => {

        // a variable that holds the 'samples'...
      var samples = data.samples;

       // create a new variable that holds a filtered array where the 'sample'...
       // passed to the function is '==' to the 'id' of the sampleobject...
      var samplesArray = samples.filter(sampleobject => sampleobject.id == sample);

      // save the first item from new samplesArray to a new variable...
      var result = samplesArray[0]

      // lastly, save each filtered arrays to its respective variable
      var ids = result.otu_ids;
      var values = result.sample_values;
      var labels = result.otu_labels;
      
    // Step 2: Using the newly filtered data (i.e. ids, values, labels) build a bar chart //
      // to do so you first need to create a layout object... //
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 120 }
        };

        // then create a data object that slices the top 10 cultures found... //
        // my favorite is Japan they make amazing animations //
        var barData =[
        {
          y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
          x:values.slice(0,10).reverse(),
          text:labels.slice(0,10).reverse(),
          type:"bar",
          orientation:"h"
  
        }
      ];
      
      // Pass data and layout variables into plotly.newPlot function //
      Plotly.newPlot("bar", barData, barLayout);
    
    // Step 3: Using the same data as the previous step build a bubble chart... //
      // to do so you first need to create a layout object... //
       var layoutBubble = {
         xaxis: { title: "OTU ID" },
         yaxis: { title: "Frequency" },
         margin: { t: 0 },
         hovermode: "closest"
        };

        // then create a data object... //
        var bubbleData = [
        {
          x: ids,
          y: values,
          text: labels,
          mode: "markers",
          marker: {
            color: ids,
            size: values,
            }
        }
      ];

      // pass layout & data into the Plotly.plot function then boom bubble bath of data //
      Plotly.plot("bubble", bubbleData, layoutBubble);

    });
    
}


function buildDatagraphic(sample) {

// Step 1: grab metadata for demographic info chart...//
    d3.json("samples.json").then((data) => {

        // a variable that holds the 'metadata'...
      var metadata = data.metadata;

      // create a new variable that holds a filtered array where the 'sample'...
      // passed to the function is '==' to the 'id' of the sampleobject...
      var sampleArray = metadata.filter(sampleobject => sampleobject.id == sample);

      var result = sampleArray[0]

      // create a tinder profile... I mean a panel to hold personal info //
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");

      // for each entry (ie: key, value) found append to the panel display
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });
    
    });
}

function optionChanged(newSample) {

    // Grab new data for new sample (id) selected //
    buildPlots(newSample);
    buildDatagraphic(newSample);
}

function Dashboard() {

// Grab a reference to the dropdown select element //
    var selector = d3.select("#selDataset");
  
// Step 1:  Use the array of sample names to populate the select options... //
    d3.json("samples.json").then((data) => {
    // save names into new variable... //
      var sampleNames = data.names;
    
    // create an option for each new sample //
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
// Use the first sample from the array to build the first plots //
      const firstSample = sampleNames[0];
      buildPlots(firstSample);
      buildDatagraphic(firstSample);
    });
}


// Call the dashboard //
Dashboard();