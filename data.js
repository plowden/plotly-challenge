// Get the JSON data

/**
 * names[]
 * metadata{id==names,ethnicity,gender,age,location,bbtye,wfreq}
 * samples{id==names,otu_ids,sample_values,otu_labels
 */

//const url = "http://localhost:8000/data/samples.json";
const url = "http://localhost:8000/plotly-challenge/data/samples.json";

var data = [];
var names = [];
var metadata = [];
var samples = [];

function saveData() {
  names = data.names;
  metadata = data.metadata;
  samples = data.samples;
  //console.log("data: ", data);
  console.log("names: ", names);
  console.log("metadata: ", data.metadata);
  console.log("metadata[0]: ", metadata[0]);
  console.log("samples: ", samples);
}

// Fetch the JSON data and console log it
d3.json(url).then(function(json) {
  data = json;
  saveData();
});

//console.log("names: ", names);
//console.log("metadata.id: ", metadata.id);
//console.log("samples: ", samples);

