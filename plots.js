/**
 * names[]
 * metadata{id==names,ethnicity,gender,age,location,bbtye,wfreq}
 * samples{id==names,otu_ids,sample_values,otu_labels
 */

// Get the JSON data

//const url = "http://localhost:8000/plotly-challenge/data/samples.json";
const url = "https://plowden.github.io/plotly-challenge/data/samples.json";


function printMetadata(meta) {
  //DEBUG console.log("meta.age: ", meta.age);
  //DEBUG console.log("meta.bbtype: ", meta.bbtype);
  //DEBUG console.log("meta.ethnicity: ", meta.ethnicity);
  //DEBUG console.log("meta.gender: ", meta.gender);
  //DEBUG console.log("meta.location: ", meta.location);
  //DEBUG console.log("meta.wfreq: ", meta.wfreq);
  //DEBUG console.log("meta.id: ", meta.id);
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
  //DEBUG console.log("sample.id: ", sample.id);
  otu_ids = sample.otu_ids.slice(0, 10);
  //DEBUG console.log("otu_ids: ", otu_ids);
  sample_values = sample.sample_values.slice(0, 10);
  //DEBUG console.log("sample_values: ", sample_values);
  otu_labels = sample.otu_labels.slice(0, 10);
  //DEBUG console.log("otu_labels: ", otu_labels);
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
  //DEBUG console.log("gauge meta.wfreq: ", meta.wfreq);
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

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
 
  //console.log("metadata.id: ", data.metadata[0].id);
  //console.log("metadata.ethnicity: ", data.metadata[0].ethnicity);

  // Get ID selection.
  // Prime option list with blank entry.
  options = [""];
  // Set option list to json names array.
  options = options.concat(data.names);
  //DEBUG console.log("names: ", data.names);
  //DEBUG console.log("options: ", options);
  // Create option tags.
  var selectID = d3.select("#select-id");
  selectID.selectAll("option").data(options).enter().append("option").text(function(d) {return d});
  // Set up the listener.
  selectID.on("change", function() {
    id = d3.event.target.value;
    //DEBUG console.log("id: ", id);
    data.metadata.forEach(function (entry) {
      //console.log(entry.id);
      if (entry.id == id) {
        //DEBUG console.log("Found it! ", id);
        printMetadata(entry);
        gauge(entry);
      }
    });
    data.samples.forEach(function (entry) {
      //console.log(entry.id);
      if (entry.id == id) {
        //DEBUG console.log("Found sample: ", id);
        barChart(entry);
      }
    });
  });
});
