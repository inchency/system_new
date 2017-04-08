var express = require('express');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'sensor',
    password: '504ehdgns',
    database: 'data'
})
connection.connect(function(err){
  if(err){
  console.log('mysql connection is fail');
  console.log(err);
  throw err;
  }
  else{
  console.log('mysql connection is success');
  }
});


app.get("/log", function(req, res) {
  console.log("param=" + req.query);

  var qstr = 'SELECT * from sensors where time > date_sub(now(), INTERVAL 1 DAY) ';
  connection.query(qstr, function(err, rows, cols) {
    if (err) {
      throw err;
      // res.send('query error: '+ qstr);
      return;
    }
    console.log('This is temperature : ', rows);
   // console.log('cols is: ', cols);
    console.log("Got "+ rows.length +" records");
    res.send(rows);   
  });

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
