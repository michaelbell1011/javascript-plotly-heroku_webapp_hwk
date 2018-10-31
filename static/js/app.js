function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
  
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
    // url will match the route setup via Flask and what's in index.html: /samples/<sample>
    var url = "/samples/" + sample
    console.log(url);
    // Setup success handler and error handler when fetching data
    d3.json(url).then(handleSuccess).catch(handleError)
  
    // error handler function
    function handleError(error){
      console.log('An error occurred. Here is the error: ', error)
    }
  
    // success handler function
    function handleSuccess(result){
      console.log('Able to successfully retrieve sample data. Here it is: ', result)
      // ==================================================
      // @TODO: Build a Bubble Chart using the sample data
      // ==================================================
      // Setup trace for Bubble chart
        // Use otu_ids for x values
        // Use sample_values for y values
        // Use otu_labels for text values
        // Use otu_ids for marker colors
        // Use sample_values for marker size

      var trace1 = {
        type: 'scatter',
        x: result.otu_ids,
        y: result.sample_values,
        text: result.otu_labels,
        mode: 'markers',
        marker: {
          color: result.otu_ids,
          size: result.sample_values
        }
      };
      
      var data = [trace1];

      var layout = {
        title: 'Culture Prevalence by ID',
        height: 600,
        xaxis: {
          title: 'OTU ID'
        }
      };
      // Plot bubble chart using Plotly
      Plotly.newPlot('bubble', data, layout);

      // ==================================================
      // @TODO: Build a Pie Chart
      // ==================================================
      
      // retrieve data from json obejct
      console.log("result.sample_values is: ", result.sample_values)
      console.log("result.otu_ids is: ", result.otu_ids)
      console.log("result.otu_labels is: ", result.otu_labels)
      
      // slice() data to get top 10 results
      var top_ten_sample_values = result.sample_values.slice(0, 10);
      var top_ten_otu_ids = result.otu_ids.slice(0, 10);
      var top_ten_otu_labels = result.otu_labels.slice(0, 10);
      console.log("top_ten_sample_values is: ", top_ten_sample_values);
      console.log("top_ten_otu_ids is: ", top_ten_otu_ids);
      console.log("top_ten_otu_labels is: ", top_ten_otu_labels);


      // create Pie chart
      var pie_data = [{
        values: top_ten_sample_values,
        labels: top_ten_otu_ids,
        type: "pie",
        hovertext: top_ten_otu_labels,
        hoverinfo: "label+text+value+percent"
      }];
      
      var pie_layout = {
        title: 'Top Ten Cultures Present in Sample',
        height: 700,
        width: 700,
      };
      
      // Plot pie chart 
      Plotly.newPlot("pie", pie_data, pie_layout);
    }
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