/**
 * names[]
 * metadata{id==names,ethnicity,gender,age,location,bbtye,wfreq}
 * samples{id==names,otu_ids,sample_values,otu_labels
 */

// Get the JSON data

//const url = "http://localhost:8000/plotly-challenge/data/samples.json";
const url = "https://plowden.github.io/plotly-challenge/data/samples.json";


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

function gauge(meta) {
  var data = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: meta.wfreq,
    title: { text: "Scrubs Per Week" },
    type: "indicator",
    mode: "gauge+number",
    delta: { reference: 0 },
    gauge: { axis: { range: [null, 10] } }
  }];
  var layout = { width: 400, height: 400, margin: { t: 0, b: 80 } };
  Plotly.newPlot("gauge", data, layout);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function bubble(sample) {
  otu_ids = sample.otu_ids.slice(0, 10);
  sample_values = sample.sample_values.slice(0, 10);
  otu_labels = sample.otu_labels.slice(0, 10);

  colors = [];

  for (var i = 0; i < sample.otu_ids.length; i++) {
    colors.push(getRandomColor());
  }
 console.log("colors: ", colors);

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
    width: 1200
  };

  Plotly.newPlot("bubble", data, layout);
}

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
 
  //console.log("metadata.id: ", data.metadata[0].id);
  //console.log("metadata.ethnicity: ", data.metadata[0].ethnicity);

  // Get ID selection.
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
      //console.log(entry.id);
      if (entry.id == id) {
        printMetadata(entry);
        gauge(entry);
      }
    });
    data.samples.forEach(function (entry) {
      //console.log(entry.id);
      if (entry.id == id) {
        barChart(entry);
        bubble(entry);
      }
    });
  });
});
