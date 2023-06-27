function fetchAndDisplayCSV() {
  $.ajax({
      type: "GET",
      url: "Football_positions.csv",
      success: function (data) {
          var parsedData = Papa.parse(data).data;
          var table = arrayToTable(parsedData);
          $('body').append(table);
      }
  });
}

function arrayToTable(tableData) {
  var table = $('<table></table>');
  $(tableData).each(function (i, rowData) {
      var row = $('<tr></tr>');
      $(rowData).each(function (j, cellData) {
          row.append($('<td>'+cellData+'</td>'));
      });
      table.append(row);
  });
  return table;
}

$(document).ready(fetchAndDisplayCSV);
