/**
 * names[]
 * metadata{id==names,ethnicity,gender,age,location,bbtye,wfreq}
 * samples{id==names,otu_ids,sample_values,otu_labels
 */

// Get the JSON data

//const url = "http://localhost:8000/plotly-challenge/data/samples.json";
const url = "https://plowden.github.io/plotly-challenge/data/samples.json";


function printMetadata(meta) {
  console.log("meta.age: ", meta.age);
  console.log("meta.bbtype: ", meta.bbtype);
  console.log("meta.ethnicity: ", meta.ethnicity);
  console.log("meta.gender: ", meta.gender);
  console.log("meta.location: ", meta.location);
  console.log("meta.wfreq: ", meta.wfreq);
  console.log("meta.id: ", meta.id);
  //var metadata = d3.select("#metadata-age").append("p");
  //metadata.text(metadata.age);
  //var metadata = d3.select("#metadata-age").append("p").text(meta.age);
  var metadata = d3.select("#metadata-age");
  metadata.selectAll('p').remove()
  metadata.append("p").text("AGE: " + meta.age);
  metadata = d3.select("#metadata-bbtype")
  metadata.selectAll('p').remove()
  metadata.append("p").text(meta.bbtype);
  metadata = d3.select("#metadata-ethnicity")
  metadata.selectAll('p').remove()
  metadata.append("p").text(meta.ethnicity);
  metadata = d3.select("#metadata-gender")
  metadata.selectAll('p').remove()
  metadata.append("p").text(meta.gender);
  metadata = d3.select("#metadata-location")
  metadata.selectAll('p').remove()
  metadata.append("p").text(meta.location);
  metadata = d3.select("#metadata-wfreq")
  metadata.selectAll('p').remove()
  metadata.append("p").text(meta.wfreq);
  metadata = d3.select("#metadata-id")
  metadata.selectAll('p').remove()
  metadata.append("p").text(meta.id);
}

function pie(meta) {
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
    console.log("id: ", id);
    data.metadata.forEach(function (entry) {
      //console.log(entry.id);
      if (entry.id == id) {
        console.log("Found it! ", id);
        printMetadata(entry);
      }
    });
    //pie(id);
  });
});
