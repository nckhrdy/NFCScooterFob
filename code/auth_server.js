var dgram = require('dgram');
var Engine = require('tingodb')();
var db = new Engine.Db('./mydb', {});
var express = require('express');

// Port and IP
var PORT = 8081;
var HOST = '192.168.1.24';

// Create socket
var server = dgram.createSocket('udp4');

// Initialize TingoDB
var db = new Engine.Db('./mydb', {});

// Create server that listens on a port
server.on('listening', function () {
  var address = server.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

// On connection, print out received message
server.on('message', function (message, remote) {
  console.log(remote.address + ':' + remote.port + ' - ' + message);

  // Send Ok acknowledgement
  server.send("Ok!", remote.port, remote.address, function (error) {
    if (error) {
      console.log('MEH!');
    } else {
      console.log('Sent: Ok!');
    }
  });

  // Access TingoDB
  var collection = db.collection('mycollection');

  // Perform find operation
  var SID = message.toString();
  var query = { SID: SID };
  collection.find(query, { KEY: 1 }).toArray(function(err, docs) {
    if (err) throw err;
    console.log("Found the following records:");
    console.log(docs);
    if (docs.length > 0) {
      var key = docs[0].KEY;

      // Log timestamp of the query
      var timestamp = new Date();
      var logCollection = db.collection('querylogs');
      var logEntry = { timestamp: timestamp, querySID: SID };
      logCollection.insert(logEntry, function(err, result) {
        if (err) throw err;
        console.log('Timestamp logged:', timestamp);
      });

      // Send the KEY back to the first specified IP address
      var client1 = dgram.createSocket('udp4');
      var message1 = Buffer.from(key);
      var ipAddress1 = '192.168.1.44'; // replace with the IP address you want to use
      client1.send(message1, 0, message1.length, remote.port, ipAddress1, function (err, bytes) {
        if (err) throw err;
        console.log('Sent KEY to ' + ipAddress1 + ':' + remote.port);
        client1.close();
      });

      // Send the KEY back to the second specified IP address
      var client2 = dgram.createSocket('udp4');
      var message2 = Buffer.from(key);
      var ipAddress2 = '192.168.1.32'; // replace with the IP address you want to use
      client2.send(message2, 0, message2.length, remote.port, ipAddress2, function (err, bytes) {
        if (err) throw err;
        console.log('Sent KEY to ' + ipAddress2 + ':' + remote.port);
        client2.close();
      });

    } else {
      console.log("No record found for SID " + SID);
    }
  });
});

server.bind(PORT, HOST);

