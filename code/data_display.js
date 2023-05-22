var express = require('express');
var Engine = require('tingodb')();
var db = new Engine.Db('./mydb', {});
var app = express();

app.get('/', function(req, res) {
  db.collection('querylogs', function(err, collection) {
    if (err) throw err;
    collection.find().toArray(function(err, data) {
      if (err) throw err;

      // Format data into a table
      var table = '<table>';
      table += '<thead><tr><th>Timestamp</th><th>SID</th></tr></thead>';
      table += '<tbody>';

      for (var i = 0; i < data.length; i++) {
        table += '<tr><td>' + data[i].timestamp + '</td><td>' + data[i].querySID + '</td></tr>';
      }

      table += '</tbody></table>';

      // Send the table as a response
      var html = '<!DOCTYPE html>' +
                 '<html>' +
                 '<head>' +
                 '<meta charset="utf-8">' +
                 '<title>Query Logs</title>' +
                 '<style>' +
                 'table { border-collapse: collapse; }' +
                 'th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }' +
                 'tr:nth-child(even) { background-color: #f2f2f2; }' +
                 '</style>' +
                 '</head>' +
                 '<body>' +
                 table +
                 '</body>' +
                 '</html>';
      res.send(html);
    });
  });
});

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
