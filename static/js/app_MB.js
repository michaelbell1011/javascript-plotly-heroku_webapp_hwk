// ## Step 0 - create virtual environment and import libraries from requirements.txt

// * conda create -n myenv python=3.6
// * conda install -n myenv pip (pip is installed by default above)
// * source activate myenv
// * pip install -r requirements.txt

// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  // url will match the route setup via Flask and what's in index.html: /metadata/<sample>
  var url = "/metadata/" + sample
  console.log(url);

  // Setup success handler and error handler when fetching data
  d3.json(url).then(handleSuccess).catch(handleError)

  // error handler function
  function handleError(error){
  console.log('An error occurred. Here is the error: ', error)
  }
  
  // success handler function
  function handleSuccess(response){
  console.log('Able to successfully retrieve metadata. Here it is: ', response)
  
  // Use d3 to select the panel with id of `#sample-metadata`
  var panel_body = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  panel_body.html("");

  // take object called response and make into array of objects
  var response_arr = [response];
  console.log("response_arr is: ", response_arr);

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  response_arr.forEach(function(report){
    console.log(report);
    Object.entries(report).forEach(function([key, value]){
      console.log(key, value);
      // Append a cell to the row for each value
      // first output key as text along with a colon
      var cell_key = panel_body.append("td");
      cell_key.text(key + ": ");
      // next output value as text
      var cell_val = panel_body.append("td");
      cell_val.text(value);
      // insert a single line break
      panel_body.append("br");
    });
  });

  }
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json()


  
    // @TODO: Build a Bubble Chart using the sample data to display each sample.
    // * Use `otu_ids` for the x values
    // * Use `sample_values` for the y values
    // * Use `sample_values` for the marker size
    // * Use `otu_ids` for the marker colors
    // * Use `otu_labels` for the text values

    // 2 trace scatter with hover data labels example from plotly.js docs
    var trace1 = {
      x: [1, 2, 3, 4, 5],
      y: [1, 6, 3, 6, 1],
      mode: 'markers',
      type: 'scatter',
      name: 'Team A',
      text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
      marker: { size: 12 }
    };
    
    var trace2 = {
      x: [1.5, 2.5, 3.5, 4.5, 5.5],
      y: [4, 1, 7, 1, 4],
      mode: 'markers',
      type: 'scatter',
      name: 'Team B',
      text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
      marker: { size: 12 }
    };
    
    var data = [ trace1, trace2 ];
    
    var layout = {
      xaxis: {
        range: [ 0.75, 5.25 ]
      },
      yaxis: {
        range: [0, 8]
      },
      title:'Data Labels Hover'
    };
    
    Plotly.newPlot('bubble', data, layout);



    // @TODO: Build a Pie Chart that uses data from your samples route to display the top 10 samples.
    // * Use `sample_values` as the values for the PIE chart
    // * Use `otu_ids` as the labels for the pie chart
    // * Use `otu_labels` as the hovertext for the chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    // // Part 5 - Working Pie Chart example
    var trace1 = {
      labels: ["beer", "wine", "martini", "margarita",
          "ice tea", "rum & coke", "mai tai", "gin & tonic"],
      values: [22.7, 17.1, 9.9, 8.7, 7.2, 6.1, 6.0, 4.6],
      type: 'pie'
    };

    var data = [trace1];
    var layout = {
      title: "Top 10 Samples Pie Chart",
    };

    Plotly.newPlot("pie", data, layout);
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
