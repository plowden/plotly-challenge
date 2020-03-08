// Define the URL for the page.
const url = "https://plowden.github.io/plotly-challenge/data/samples.json";

// This function clears then prints the metadata.
function printMetadata(meta) {
  var metadata = d3.select("#metadata-age");
  metadata.selectAll('span').remove()
  metadata.append("span").text("AGE: " + meta.age);
  metadata = d3.select("#metadata-bbtype")
  metadata.selectAll('span').remove()
  metadata.append("span").text("BBTYPE: " + meta.bbtype);
  metadata = d3.select("#metadata-ethnicity")
  metadata.selectAll('span').remove()
  metadata.append("span").text("ETHNICITY: " + meta.ethnicity);
  metadata = d3.select("#metadata-gender")
  metadata.selectAll('span').remove()
  metadata.append("span").text("GENDER: " + meta.gender);
  metadata = d3.select("#metadata-location")
  metadata.selectAll('span').remove()
  metadata.append("span").text("LOCATION: " + meta.location);
  metadata = d3.select("#metadata-wfreq")
  metadata.selectAll('span').remove()
  metadata.append("span").text("WFREQ: " + meta.wfreq);
  metadata = d3.select("#metadata-id")
  metadata.selectAll('span').remove()
  metadata.append("span").text("SAMPLE: " + meta.id);
}

// This function creates the horizontal bar chart showing
// the top 10 OTU IDs.
function barChart(sample) {
  otu_ids = sample.otu_ids.slice(0, 10);
  sample_values = sample.sample_values.slice(0, 10);
  otu_labels = sample.otu_labels.slice(0, 10);
  var trace1 = {
    x: sample_values.reverse(),
    text: otu_labels,
    type: "bar",
    orientation: "h"
  };
  var data = [trace1];
  var layout = {
    autosize: false,
    width: 300,
    height: 300,
    yaxis: {
      tickmode: "array",
      tickvals: [0,1,2,3,4,5,6,7,8,9],
      ticktext: otu_ids,
      showticklabels: true
    },
    margin: {
      l: 80,
      r: 20,
      t: 10,
      b: 20
    }
  };
  Plotly.newPlot("bar_chart", data, layout);
}

// This function creates the gauge. It's actually a
// pie chart with the bottom half colored white to match
// the background.
function gauge(meta) {

  var level = meta.wfreq;

  // Trig to calc meter point
  var degrees = 180 - level * 20, radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path
  var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ 
    type: 'category',
    x: [0],
    y: [0],
    marker: {
      size: 28,
      color:'850000'
    },
    showlegend: false,
    name: 'gauge',
    text: level,
    hoverinfo: 'text+name'
  },
  { 
    // Here's the magic: have a dummy last value that is the sum of the other values.
    values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    rotation: 90,
    // More magic: note the last value is a blank string.
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',	  
    // Still more magic: note the last value is white.
    marker: {
      colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
        'rgba(170, 202, 72, .5)', 'rgba(202, 209, 95, .5)',
        'rgba(210, 216, 145, .5)', 'rgba(232, 226, 202, .5)',
        'rgba(242, 236, 212, .5)', 'rgba(244, 246, 222, .5)',
        'rgba(248, 248, 232, .5)', 'rgba(255, 255, 255, .5)']},
    // Tired of magic? Last value is blank.
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
    margin: { t: 25, b: 25, l: 25, r: 25 },
    title: 'Scrubs Per Week',
    height: 500,
    width: 500,
    xaxis: {type:'category',zeroline:false, showticklabels:false,
    showgrid: false, range: [-1, 1]},
    yaxis: {type:'category',zeroline:false, showticklabels:false,
    showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot("gauge", data, layout);
}

// This function gets a random color for the bubble graph.
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// This function creates the bubble graph.
function bubble(sample) {
  otu_ids = sample.otu_ids.slice(0, 10);
  sample_values = sample.sample_values.slice(0, 10);
  otu_labels = sample.otu_labels.slice(0, 10);

  colors = [];

  for (var i = 0; i < sample.otu_ids.length; i++) {
    colors.push(getRandomColor());
  }

  var trace1 = {
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels,
    mode: 'markers',
    xaxis: (
      title='OTU ID'
    ),
    marker: {
      color: colors,
      size: sample.sample_values
    }
  };

  var data = [trace1];

  var layout = {
    showlegend: false,
    height: 600,
    width: 1200,
    margin: { t: 0, b: 25, l: 25, r: 25 }
  };

  Plotly.newPlot("bubble", data, layout);
}

// Fetch the JSON data 
d3.json(url).then(function(data) {
  // Get the default ID selection.
  var defaultID = data.names[0];
  // Run the chart functions with the default value.
  data.metadata.forEach(function (entry) {
    if (entry.id == defaultID) {
      printMetadata(entry);
      gauge(entry);
    }
  });
  data.samples.forEach(function (entry) {
    defaultID = data.names[0];
    if (entry.id == defaultID) {
      barChart(entry);
      bubble(entry);
    }
  });

  // Prime option list with blank entry.
  options = [""];
  // Set option list to json names array.
  options = options.concat(data.names);
  // Create option tags.
  var selectID = d3.select("#select-id");
  selectID.selectAll("option").data(options).enter().append("option").text(function(d) {return d});
  // Set up the listener.
  selectID.on("change", function() {
    id = d3.event.target.value;
    data.metadata.forEach(function (entry) {
      if (entry.id == id) {
        printMetadata(entry);
        gauge(entry);
      }
    });
    data.samples.forEach(function (entry) {
      if (entry.id == id) {
        barChart(entry);
        bubble(entry);
      }
    });
  });
});
