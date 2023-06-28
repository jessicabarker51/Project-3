//2.Create a horizontal bar chart with a dropdown menu to display the players position in each
//d3.select("#selDataset").on("change", updatePlotly);
// Using the local api to call the dataset

const url = "http://127.0.0.1:5000";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
let dataFromApi = undefined;

// Fetch the JSON data and populate dropdown
d3.json(url).then(function (data) {
  populateDropdown(data);
  dataFromApi = data;
});

function populateDropdown(data) {
  const dropdown = d3.select("#selDataset");

  // Clear the dropdown menu
  dropdown.html("");

  // Extract unique state province names from the data and sort them alphabetically
  const stateProvinces = [
    ...new Set(data.map((item) => item.stateProvince)),
  ].sort();

  // Add an option for each state province
  stateProvinces.forEach(function (state) {
    dropdown.append("option").attr("value", state).text(state);
  });
}

function optionChanged(value) {
  const state = value;
  createGraph(state);
  createGraph2(state);
}

function createGraph(selectedState) {
  // Filter the data based on the selected state
  const filteredData = dataFromApi.filter(
    (item) => item.stateProvince === selectedState
  );

  // Extract position and state province labels for the graph
  const positions = filteredData.map((item) => item.position);
  const labels = filteredData.map((item) => item.position).count;

  let trace = {
    x: positions,
    y: labels,
    hoverinfo: 'none',
    marker: {
      color: "rgb(142,124,195)",
    },
    type: "bar",
    orientation: "v",
  };

  // Create data variable
  let data = [trace];

  // Create layout variable to set plot's layout
  let layout = {
    title: `Recruited Player's Position by State of ${selectedState} `,
    yaxis: {
      tickmode: labels,
    },
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 50,
    },
  };

  // Create the bar plot
  Plotly.newPlot("bar1", data, layout);
}

function createGraph2(selectedState2) {
  // Filter the data based on the selected state
  const filteredData = dataFromApi.filter(
    (item) => item.stateProvince === selectedState2
  );

  // Extract school and state province labels for the graph
  const schools = filteredData.map((item) => item.school);
  const labels = filteredData.map((item) => item.school.length);
  const labels2 = filteredData.map((item) => item.school).count;
  const ranks = filteredData.map((item) => item.ranking);
  const max_rank = Math.min(...ranks);
  const heights = filteredData.map((item) => item.height);
  const max_height = Math.max(...heights);
  const ratings = filteredData.map((item) => item.rating);
  const max_rating = Math.max(...ratings);

// use reduce() method to find the sum
var sum = labels.reduce((accumulator, currentValue) => {
  return accumulator + currentValue
},0);

var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1');
var metadataSamples = {"Player Count":sum,"Highest Rank":max_rank,"Highest Rating":max_rating,"Tallest Height":max_height+'"'};
  //-------------------------------------------------
  // Display the ID's demographic information
  var sampleMetadata = sampleMetadata1.data(d3.entries(metadataSamples))
  sampleMetadata.enter()
                .append('h1')
                .merge(sampleMetadata)
                .text(d => `${d.key} : ${d.value}`)
                .style('font-size','75%')

  sampleMetadata.exit().remove();

  let trace = {
    x: schools,
    y: labels2,
    hoverinfo: 'none',
    marker: {
      color: "rgb(142,124,195)",
    },
    type: "bar",
    orientation: "v",
  };

  // Create data variable
  let data2 = [trace];

  // Create layout variable to set plot's layout
  let layout2 = {
    title: `Recruits from Schools by State of ${selectedState2} `,
    xaxis: {
      tickangle: 45
    },
    yaxis: {
      tickmode: "linear",
    },
    margin: {
      l: 100,
      r: 100,
      t: 150,
      b: 40,
    },
  };

  // Create the bar plot
  Plotly.newPlot("bar2", data2, layout2);
}


///////////////////////////////////////////////////////////////////////////////////////////////
// Map Visualization: We will plot the location of recruits' schools on a map, using city and state information,
// providing a geographical perspective on recruiting hotspots.

// Store our API endpoint as queryUrl.
//let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

let recruitData = undefined;
let schoolData = undefined;

// Perform a GET request to the query URL/
d3.json(url).then(function (data1) {
  // Once we get a response, send the data.features object to the createFeatures function.
  // createFeatures(data1.school);
  schoolData = data1;
});

function createFeatures() {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(school, layer) {
    layer.bindPopup(
      `<h3>${school.stateProvince.city}</h3><hr><p>${new Date(
        school.stateProvince.ranking
      )}</p>`
    );
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let recruitdata = L.geoJSON(schoolData, {
    onEachFeature: onEachFeature,
  });

  // Send our earthquakes layer to the createMap function/
  recruitData = recruitdata;
  createMap();
}

function createMap() {
  // Create the base layers.
  let street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Recruits: recruitData,
  };

  console.log("RecruitData", recruitData);
  console.log("street", street);
  console.log("topo", topo);
  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, recruitData],
  });
  console.log("error2!");

  // add the marker and popup to the map.
  mapCities(myMap);
  

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
  console.log("All code rendered!");
}

/**
 * Add the marker and popup to the map
 * @param {*} myMap 
 */
function mapCities(myMap) {
// Define an array of colors or gradients
    const colors = ['blue', 'red', 'green', 'yellow'];
    const gradients = ['linear-gradient(to right, blue, red)', 'radial-gradient(circle, yellow, green)'];

///Choose a color or gradient based on your desired criteria
    const color = colors[i % colors.length]; // Use modulus operator to cycle through the colors array
    const gradient = gradients[i % gradients.length]; // Use modulus operator to cycle through the gradients array

  // Loop through the school data array and create one marker for each city object.
  for (var i = 0; i < schoolData.length; i++) {
    const schoolArrayItem = schoolData[i];

    L.marker([schoolArrayItem.latitude, schoolArrayItem.longitude], {
      color: color, // Set the color of the circle marker
      fillColor: gradient, // Set the fill color of the circle marker
      fillOpacity: 0.5, // Set the opacity of the fill color
      radius: schoolArrayItem.ranking / 10 // Set the radius of the circle marker based on the ranking
    })
      .addTo(myMap)
      .bindPopup(
        `<h3>City: ${schoolArrayItem.city}</h3> <hr> <h4>Total School: ${schoolArrayItem.school.length}</h4> <hr> <h4>Total Position: ${schoolArrayItem.position.length}</h4> <hr> <h4>Total Players: ${schoolArrayItem.athleteId.length}</h4>`
      );
  }
}
