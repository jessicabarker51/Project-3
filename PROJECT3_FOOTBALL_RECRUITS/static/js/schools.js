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
  const Schoolsname = [
    ...new Set(data.map((item) => item.school)),
  ].sort();

  // Add an option for each state province
  Schoolsname.forEach(function (schoolid) {
    dropdown.append("option").attr("value", schoolid).text(schoolid);
  });
}
// Rest of your existing JavaScript code
function init() {
    buildPlot();
  }
  
  function optionChanged() {
    buildPlot();
  }
  
  function buildPlot() {
    d3.json("http://127.0.0.1:5000/api/recruits/top10/Texas A&M").then((data) => {
      let trace1 = {
        x: [],
        y: [],
        type: 'bar'
      };
      data.forEach(function(val) {
        trace1.x.push(val["name"]);
        trace1.y.push(val["height"]);
      });
      Plotly.newPlot('bar1', [trace1], {
        title: "Top 10 Committed Players by Height"
      });
    });
  }
  
  init();
  