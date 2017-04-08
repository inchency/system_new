/*
 * 2016/11/20 Kyuho Kim
 * GET으로 호출하는 경우.
 * http://localhost:8080/logone?user=202&serial=6&format=2&items=0-T-22.65,2-D-45.32,0-C-452
 * 
 * POST의 경우,  
 * http://localhost:8080/logone?user=202&serial=6&format=2 와 함께 
 * header는
 * 'Content-Type: application/x-www-form-urlencoded\r\n' 
 * body는 
 * items=0-T-22.65,2-D-45.32,0-C-452
*/

var express = require('express');
var app = express();
bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var fs = require("fs");
var df = require('dateformat');
function insert_mysql(temp)
{
  
mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'sensor',
    password: '504ehdgns',
    database: 'data'
})
connection.connect();

r={};
r.seq=1;
r.type='T';
r.device='102';
r.unit='0';
r.ip="10.42.0.124";
r.value=temp;
var query = connection.query('insert into sensors set ?', r, function(err, rows, cols) {
  if (err) throw err;
   console.log("insert to mysql done");
  // process.exit();
});



}

function insert_sensor(user, type, value, user2, serial, ip)
{
  obj = {};
  obj.user = user;
  obj.type = type;
  obj.value = value;
  obj.user2 = user2;
  obj.serial = serial;
  obj.ip = ip
  obj.date = df(new Date(), "yyyy-mm-dd HH:MM:ss");
  var d = JSON.stringify(obj);
  ret = " "+ type + user2 +"="+ value;
  //console.log("RET "+ ret);

  fs.appendFile("Data.txt", d+'\n', function(err) {
    if(err) console.log("File Write Err: %j", r);
  });
  return(ret);
}

function do_get_post(cmd, r, req, res)
{
  console.log(cmd +" %j", r);
  ret_msg = "{serial:"+ r.serial +",user:"+ r.user;

  if (r.format == '2') {
    //console.log("got format 2");
    var items = r.items.split(',');
    for (var i=0; i< items.length; i++) {
      if (items[i].length < 3) continue;
      var v = items[i].split('-');
          ret_msg += insert_sensor(r.user, v[1], v[2], v[0], r.serial, req.connection.remoteAddress);
    }
  }
  ret_msg += "}";

  //res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('X-ACK:' + ret_msg + "test");
  //res.send("hi");
}

app.get('/temperature', function(req, res) {
  r = req.query;
  //console.log("GET %j", r);
  fs.appendFile("Data.txt","temperautre : " + r.temperature + "\n");
  insert_mysql(r.temperature);
  //res.send("hi");
  var html = "<!doctype html><html><body>";
  html += "<h1>This is Mission 4 & 5 <br> Look at temperature!!</h1>";
  html += "<h5>This is html tag.. <br> KookminUniversity/Computer Science/20123339/KimDongHoon</h5>";
  //console.log(r.temperature);
  //html += "<script> var time = new Date(); document.write(time); </script>" + r.temperature + "<br>";
  html += "<p>" + r.temperature + "</p>";
  html += "</body></html>";
  res.send(html);
  //do_get_post("GET", r, req, res);
});

app.post('/temperature', function(req, res) {
  r = req.body;
  //console.log("POST %j", r);
  //do_get_post("POST", r, req, res);
});

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});
