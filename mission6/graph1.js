var express = require('express')
var app = express()
fs = require('fs');
mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'sensor',
    password: '504ehdgns',
    database: 'data'
})
connection.connect();


app.get('/data', function (req, res) {
    console.log('got app.get(data)');
    var html = fs.readFile('./data.html', function (err, html) {
    html = " "+ html
    console.log('read file');

    var qstr = 'select * from sensors ';
    var qdate = 'select time from sensors';
    var qvalue = 'select value from sensors';
    connection.query(qstr, function(err, rows, cols) {
      
      if (err) throw err;

      var data = "";
      var comma = ""
      html += "['Date', 'Temp'],"; 
      for (var i=0; i< rows.length; i++) {
         r = rows[i];
	//console.log(rows[i]);
        // data += comma + "[new Date(2017,04-1,"+ r.id +",00,38),"+ r.value +"]";
        // console.log(data);
	//console.log("\nmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n");
	html += comma + "['" + r.time + "'," + r.value + "]";
	comma = ",\n";
      }
      html += "]);\n"	
	
     // html += data;
     // html +="['Year', 'Sales', 'Expenses'],";
     // html +="['2004',  1000,      400],";
     // html +="['2005',  1170,      460],";
     // html +="['2006',  660,       1120],";
     // html +="['2007',  1030,      540]";
     // html +="]);";
      html +="var options = {\n";
      html +="    title: '20123339 KimDongHoon NewSystemTechnology Temperature',\n";
      html +="    curveType: 'function',\n";
      html +="    legend: { position: 'bottom' }\n";
      html +="  };\n";
      html +="  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));\n";
      html +="  chart.draw(data, options);\n";
      html +=" }\n";
      html +=" </script>\n";
      html +="</head>\n";
      html +="<body>\n";
      html +="<div id='curve_chart' style='width: 900px; height: 500px'></div>\n";
      html +="</body>\n";
      html +="</html>\n"; 
      res.writeHeader(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
