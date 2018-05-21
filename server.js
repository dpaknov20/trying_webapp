
var express = require('express');
var morgan = require('morgan');
var path = require('path');
//for the encryption of the password 
var crypto = require('crypto');
//this is for the database connection
var Pool = require('pg').Pool;
//for the body parsing(using JSON method)
var bodyParser = require('body-parser');
var session = require('express-session');
//configuraton for the database
var config = {
    user: 'adeepak269',
    database: 'adeepak269',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    //paswword: process.env.DB_PASSWORD
    password: 'db-adeepak269-82983'
    
};
var pool = new Pool(config);

var app = express();
app.use(morgan('combined'));
//for the JSON file to load 
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue', 
    cookie: {maxAge: 1000*60*60*24*30}
}));

var count=0;
app.get('/counter', function (req, res) {
  count=count+1;    
  res.send(count.toString());
});

var point =0;
app.post('/robot_present_values', function (req, res) {
    point=req.body.point;  
  res.status(200).send(alert("got the value"));
});

app.get('/robot_values', function (req, res) {
  res.send(point.toString());
});

app.get('/myapp', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'myapp.html'));
});

 app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
}); 
//function for the encryption of the passsword
function hash (input,salt) {
    var hashed=crypto.pbkdf2Sync(input, salt, 100000, 512, 'sha512');
    return ["pbkdf2" , "100000" , salt , hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function (req, res) {
   var hashedString = hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
});

app.get('/calculator/:opera/:val1/:val2', function (req, res) {
    var value1=req.params.val1;
    var value2=req.params.val2;
    var operation=req.params.opera;
    var calvalue=0;
    var x=Math.round(value1);
    var y=Math.round(value2);
    if(operation.includes('add')) {
        calvalue=x+y;
    }
    else if (operation.includes('sub')) {
        calvalue=value1-value2;
    }
    else if (operation.includes('mul')) {
        calvalue=value1*value2;
    }
    else if (operation.includes('div')) {
        calvalue=value1/value2;
    }
    res.send(calvalue.toString());
});

app.get('/controlrobot', function(req,res) {
    if(req.session && req.session.auth && req.session.auth.userName) {
        res.send(control());
   }  
   else
        res.status(400).send('you are not logged in');
});

function control() {
    var jump=`
    <button><a href="http://api.thingspeak.com/update?api_key=GR1IFBYTK5NKNIV6&field1=100&status=forward" target="_blank">click me to move forward</a></button><br>
    <button><a href="http://api.thingspeak.com/update?api_key=GR1IFBYTK5NKNIV6&field1=200&status=left" target="_blank">click me to move left</a></button><br>
    <button><a href="http://api.thingspeak.com/update?api_key=GR1IFBYTK5NKNIV6&field1=300&status=right" target="_blank">click me to move right</a></button><br>
    <button><a href="http://api.thingspeak.com/update?api_key=GR1IFBYTK5NKNIV6&field1=400&status=backward" target="_blank">click me to move backward</a></button><br>
    <button><a href="http://api.thingspeak.com/update?api_key=GR1IFBYTK5NKNIV6&field1=500&status=stop" target="_blank">click me to stop robot</a></button><br>`;
    return jump;
}

app.post('/login',function(req,res) {
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else
        {
            if(result.rows.length === 0)
            {
                res.status(403).send('username/password is invalid');
            }
            else
            {
                var dbstring = result.rows[0].password;
                var salt = dbstring.split('$')[2];
                var hashedPassword = hash(password , salt);
                if(hashedPassword === dbstring)
                {
                    //set the session
                    req.session.auth={userName: result.rows[0].username };
                    res.send('credentials correct !');
                } 
                else
                    res.status(403).send('username/password is invalid');
            }
        }
    });
});

app.post('/register',function(req,res) {
    //we already have a username and password for now
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var id = req.body.id;
    var email = req.body.email;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbstring = hash(password, salt);
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else
        {
            if(result.rows === 0) {
                res.status(403).send('username already present');
            }
            else {
                pool.query('INSERT INTO "authors" (id, name, email, username) VALUES ($1,$2,$3,$4)', [id,name,email,username], function(err,result) {
                    if(err) {
                        res.status(500).send(err.toString());
                    }
                    else {
                        pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)', [username,dbstring], function(err,result) {
                            if(err) {
                                res.status(500).send(err.toString());
                            }
                            else {
                                 res.send('user successfully created: ' + username);
                            }
                        });
                    }
                });
                
            }
        }
    });
});

app.post('/contribute',function(req,res) {
        var articlename = req.body.articlename;
        var content = req.body.content;
        var category = req.body.category;
        var issuedon = req.body.issuedon;
        pool.query('INSERT INTO "articles" (article_name, issued_on, content, category) VALUES ($1,$2,$3,$4)', [articlename,issuedon,content,category], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
                res.send('article successfully updated'); 
        }
    });
});

app.get('/check-login',function(req,res) {
   if(req.session && req.session.auth && req.session.auth.userName) {
        pool.query('SELECT * FROM "user" WHERE username = $1', [req.session.auth.userName], function(err,result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   }  
   else
        res.status(400).send('you are not logged in');
});

app.get('/myfirstapp/articles',function(req,res) {
     if(req.session && req.session.auth && req.session.auth.userName) {
   pool.query('SELECT * from articles' , function(err,result) {
       if(err)
       {
           res.status(500).send(err.toString());
       }
       else {
           var something = JSON.stringify(result.rows);
            res.send(arttemp(something));
        }
           /* pool.query("select * from articles",function(err,result) {
              if(err) {
                   res.status(500).send(err.toString());
              } 
              else {
                  res.send(result.rows);
              }
           }); */
   });
     }
});

function arttemp(some) {
    var some1 = JSON.parse(some);
    var update = 400;
    var content = `<ul style="list-style-type:none;">`;
    for (var i=0; i< some1.length; i++) {
        content += `<li>
        <a href="/articles/${some1[i].article_name}">${some1[i].article_name}</a><br/><br/>
        </li>`;
    }
    content += "</ul>";
    var tempo = `
        <html>
            <head>
            <title>
                List of the Articles:
            </title>
            <style> 
                a {
                    text-decoration: none;
                }
                a:hover {
                    color: red;
                }
            </style>
            </head>
            <body>
                <div align="center">
                    <h3>List of the Articles: </h3>
                    <div>${content}</div><br>
                    <button id="but1"><a href="https://api.thingspeak.com/update?api_key=GR1IFBYTK5NKNIV6&field1=${update}">click here to update fields</a></button>
                    <hr/>
                    <a href = "/logout"><button>LOGOUT</button></a> 
                </div>
            </body>
        </html>
    `;
    return tempo;
}

app.get('/author/:username',function(req,res) {
    
     pool.query('SELECT * FROM authors WHERE username = ($1)', [req.params.username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } 
      else {
          if(req.session && req.session.auth && req.session.auth.userName) {
            if (result.rows.length === 0) {
                res.status(404).send('user not found');
            } else {
                var authordata=result.rows[0];
                res.send(authorTemplate(authordata));
            }
    }
      }
   });
});

app.get('/authortable/:username',function(req,res) {
    
     pool.query("SELECT * FROM author_data WHERE username = '" + req.params.username + "'", function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } 
      else {
          if(req.session && req.session.auth && req.session.auth.userName) {
            if (result.rows.length === 0) {
                res.status(404).send('user not found');
            } else {
                res.send(JSON.stringify(result.rows));
            }
    }
      }
   });
});

function authorTemplate(writedata) {
    var id=writedata.id;
    var name=writedata.name;
    var email=writedata.email;
    var username=writedata.username;
    var template = `
    <html>
        <head>
            <title>
                Author details:  
            </title>
        </head>
        <body>
                <div align="center">
                    <div><h3>
                    Author id: </h3>${id}
                    </div>
                    <hr/>
                    <div>
                        <h3>Author name: </h3>${name}
                    </div>
                    <hr/>
                    <div>
                        <h3>Author username: </h3>${username}
                    </div>
                    <hr/>
                    <div>
                       <h3>Author email: </h3>${email}
                    </div>
                </div>
        </body>
    </html>
    `;
    return template;
}

app.get('/logout',function(req,res) {
   delete req.session.auth;
   res.send('<html><body style="padding-top : 50";><div align="center">Logged out!<br/><br/><a href="/">Back to home</a></div></body></html>');
});

app.post('/myapp/login',function(req,res) {
    var name = req.body.name;
    var tagid = req.body.tagid;
    pool.query('SELECT name,tagid FROM customer WHERE tagid = $1', [tagid], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else
        {
            if(result.rows.length === 0)
            {
                console.log("program not working properly");
                res.status(403).send('username/password is invalid');
            }
            else
            {
                var user1 = result.rows[0].name;
                if(user1 === name)
                {
                    //set the session
                    req.session.auth={tagid: result.rows[0].tagid };
                    res.send('credentials correct !');
                }
                else
                    res.status(403).send('username/password is invalid');
            }
        }
    });
});

app.get('/myapp/checklogin', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.tagid) {
       // Load the user object
        pool.query('SELECT * FROM customer WHERE tagid = $1', [req.session.auth.tagid], function(err,result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].name);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/myapp/getdetails', function (req, res) {
   pool.query('SELECT * FROM customer WHERE tagid = ($1)', [req.session.auth.tagid], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.status(200).send(JSON.stringify(result.rows));
      }
   });
});

app.get('/getdetails', function (req, res) {
   pool.query('SELECT * FROM authors WHERE username = $1', [req.session.auth.userName], function(err,result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.status(200).send(JSON.stringify(result.rows));
      }
   });
});

app.get('/customer/:bookingid', function (req, res) {
  pool.query('SELECT * FROM customer WHERE tagid = ($1)', [req.session.auth.tagid], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('customer tagid_id not found');
        } else {
            var custData = result.rows[0];
            res.send(makeTemplate(custData));
        }
    }
  });
});

app.get('/customer/baggage/:tagid', function (req, res) {
  pool.query('SELECT * FROM customer_tags WHERE tagid = ($1)', [req.session.auth.tagid], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('customer tagid_id not found');
        } else {
            var metdata=result.rows[0];
            res.send(statusTemplate(metdata));
        }
    }
  });
});

function statusTemplate(statusdata) {
    var tagid=statusdata.tagid;
    var stat1=statusdata.status1;
    var stat2=statusdata.status2;
    var stat3=statusdata.status3;
        var statTemplate = `
        <!DOCTYPE html>
        <html>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="ui/style2.css">
        <body>
        
        <div class="w3-container w3-orange">
          <h2>This is the baggage status page!</h2>      
          <p>Baggage Tag ID :- ${tagid}</p>      
        </div>
        
        <div class="w3-row-padding">
        
        <div class="w3-third">
          <h2>Status-1</h2>
          <p>${stat1}</p>
        </div>
        
        <div class="w3-third">
          <h2>Status-2</h2>
          <p>${stat2}</p>
        </div>
        
        <div class="w3-third">
          <h2>Status-3</h2>
          <p>${stat3}</p>
        </div>
        <a href="/myapp"><button>HOME</button></a>
        <a href="/myapp/logout"><button>LOGOUT</button></a>
        </div>
        
        </body>
        </html>`
        ;
        return statTemplate;
}

function makeTemplate(data) {
    var name=data.name;
    var email=data.email;
    var contact=data.contact;
    var flight=data.flight;
    var fromcity=data.fromcity;
    var tocity=data.tocity;
    var date=data.date;
    var booking=data.booking;
    var pnr=data.pnr;
    var tagid=data.tagid;
    var fcitylink=data.fcitylink;
    var tcitylink=data.tcitylink;
        var bookTemplate = `
        <html>
            <head>  
                <title>
                    ${name}
                </title>
               
            </head>
            <body>
                <div align="center" style="padding-top : 5">
                <div style="position: relative;">
                    <div style="position: absolute; top: 0; right: 0; padding-top: 10; padding-right: 10">
                        ${fcitylink}
                            <h4>DEPARTURE AIRPORT</h4>
                         ${tcitylink}
                            <h4>ARRIVAL AIRPORT</h4>   
                    </div>
                </div>
                <h1>Passenger Details</h1>
                    <h3>BOOKING ID : </h3>
                    <p>${booking}<p>
                    <h3>PNR NO. : </h3>
                    <p>${pnr}<p>
                    <h3>TAG ID : </h3>
                    <p>${tagid}<p>
                    <h3>Passenger Name : </h3>
                    <p>${name}<p>
                    <h3>Passenger Contact : </h3>
                    <p>${contact}<p>
                    <h3>Flight no. : </h3>
                    <p>${flight}<p>
                    <h3>From : </h3>
                    <p>${fromcity}<p>
                    <h3>DESTINATION : </h3>
                    <p>${tocity}<p>
                    <h3>ON date : </h3>
                    <p>${date}<p>
                    <hr/>
                    <a href="/myapp/logout"><button>LOGOUT</button></a>
                </div>
            </body>
        </html>`
        ;
        return bookTemplate;
}

app.post('/registration',function(req,res) {
    var name = req.body.name;
    var email = req.body.email;
    var contact = req.body.contact;
    var flight = req.body.flight;
    var fromcity = req.body.fromcity;
    var tocity = req.body.tocity;
    var date = req.body.date;
    var booking = req.body.booking;
    var pnr = req.body.pnr;
    var tagid = req.body.tagid;
    pool.query('INSERT INTO customer (name,email,contact,flight,fromcity,tocity,date,booking,pnr,tagid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [name, email, contact, flight, fromcity, tocity, date, booking, pnr, tagid], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.send('user successfully registered: ' + booking);
        }
    });
});

app.get('/myapp/logout',function(req,res) {
   delete req.session.auth;
   res.send('<html><body style="padding-top : 50";><div align="center">Logged out!<br/><br/><a href="/myapp">Back to home</a></div></body></html>');
});


app.get('/articles/:articleName', function (req, res) {
  pool.query('SELECT * FROM articles WHERE article_name = $1' ,[req.params.articleName], function(err,result) {
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else 
        {
            if(result.rows.length === 0)
            {
                res.status(404).send('article not found');
            }
            else
            {
                var articleData = result.rows[0];
                var articlename = result.rows[0].article_name;
                pool.query("SELECT author_id FROM article_editor WHERE article_name = ($1)" ,[articlename], function(err,result) {
                    if(err)
                    {
                        res.status(500).send(err.toString());
                    }
                    else {
                            var artauth = JSON.stringify(result.rows);
                            res.send(createTemplate(articleData,artauth));
                    }
                }); 
            }
        }  
  });
});

function createTemplate(data,autdet) {
    var title=data.article_name;
    var name=data.article_name;
    var date=data.issued_on;
    var content=data.content;
    var category=data.category;
    var aura = JSON.parse(autdet);
    var cont = '<ul>';
    for (var i=0; i< aura.length; i++) {
        cont += `<li>
        ${aura[i].author_id}
        </li>`;
    }
    cont += "</ul>";
        var htmlTemplate = `
        <html>
            <head>  
                <title>
                   ${title}
                </title>
                 
            </head>
            <body>
                <div align="center">
                    <div><h3>
                    Name of the article: </h3>${name}</div>
                    <hr/>
                    <div>
                        <h3>Publishing date: </h3>${date.toDateString()}
                    </div>
                    <hr/>
                    <div>
                        <h3>About: </h3>${content}
                    </div>
                    <hr/>
                    <div>
                       <h3>Category: </h3> ${category}
                    </div>
                    <hr/>
                    <div>
                       <h3>Authors of this article: </h3> ${cont}
                    </div>
                    <hr/>
                    <div>
                        <a href="/logout"><button>Logout</button></a>
                        </div>
                </div>
            </body>
        </html>`
        ;
        return htmlTemplate;
}

app.get('/database', function (req, res) {
    //make a select request
    //return the rrsponse with results
    pool.query('SELECT * FROM authors',function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/myapp/database', function (req, res) {
    //make a select request
    //return the rrsponse with results
    pool.query('SELECT * FROM customer',function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/about_us', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'about.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/style2.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style2.css'));
});


app.get('/ui/main.js', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/myapp', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'myapp.html'));
});

app.get('/ui/myappmain.js', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'myappmain.js'));
});

app.get('/myappregister', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'myappregister.html'));
});
// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
