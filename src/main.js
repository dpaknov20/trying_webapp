function myfirstlogin() {
    var loginhtml= `
    <h3>Login Access</h3>
            <label><b>Username</b></label>
            <input type="text" placeholder="Username" id="usr" />
            <hr/>
            
            <label><b>Password</b></label>
            <input type="password" placeholder="Password" id="psd" />
            <hr/>
            
            <button type="submit" id="submit_btn" >Login</button>
            <button type="submit" id="register_btn" >Register</button> `;
            document.getElementById('valid').innerHTML=loginhtml;
            
            var submit=document.getElementById('submit_btn');
                 submit.onclick = function() {
                  //create a request
                  var request = new XMLHttpRequest();
                  //capture the response and store it in the variable
                  
                  request.onreadystatechange = function() {
                    if(request.readyState === XMLHttpRequest.DONE)  {
                        if(request.status === 200)
                        {
                            if (window.location.href.substr(-2) !== '?f') {
                                window.location = window.location.href + '?f';
                            }
                            alert('logged in successfully');
                        }
                        else if(request.status === 500)
                        {
                            alert('something went wrong on the server');
                        }
                        else if(request.status === 403)
                        {
                            alert('username/password is incorrect');
                        }
                        else if(request.status === 404)
                        {
                            alert('file not found');
                        }
                    }
                  };
                  var username = document.getElementById('usr').value;
                  var password = document.getElementById('psd').value;
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/login', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"username": username, "password": password}));
            };
                 var register=document.getElementById('register_btn');
                 register.onclick = function() {
                     document.getElementById('valid').innerHTML='';
                     var registerhtml= `
                        <h3>Registration form</h3>
                        <label><b>Name</b></label>
                        <input type="text" placeholder="Name" id="name" />
                        <hr/>
                        <label><b>ID</b></label>
                        <input type="integer" placeholder="Id" id="id" />
                        <hr/>
                        <label><b>Email</b></label>
                        <input type="text" placeholder="Email" id="email" />
                        <hr/>
                        <label><b>Username</b></label>
                        <input type="text" placeholder="Username" id="username" />
                        <hr/>
                        <label><b>Password</b></label>
                        <input type="password" placeholder="Password" id="password" />
                        <hr/>
                        <button type="submit" id="reg_btn" >Register</button> `;
                        document.getElementById('valid').innerHTML=registerhtml;
                        
                   var reg=document.getElementById('reg_btn');
                 reg.onclick = function() {     
                  //create a request
                  var request = new XMLHttpRequest();
                  //capture the response and store it in the variable
                  
                  request.onreadystatechange = function() {
                    if(request.readyState === XMLHttpRequest.DONE)  {
                        if(request.status === 200)
                        {
                            alert('registered successfully');
                        }
                        else if(request.status === 500)
                        {
                            alert('something went wrong on the server');
                        }
                        else if(request.status === 403)
                        {
                            alert('user with this username already exist');
                        }
                        else if(request.status === 404)
                        {
                            alert('file not found');
                        }
                    }
                  };
                  var name = document.getElementById('name').value;
                  var id = document.getElementById('id').value;
                  var email = document.getElementById('email').value;
                  var username = document.getElementById('username').value;
                  var password = document.getElementById('password').value;
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/register', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"name": name, "id": id, "email": email, "username": username, "password": password}));
                };
            };
}
function myfirstloadLogin() {
            // Check if the user is already logged in
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        LoggedInUser(this.responseText);
                    } else {
                        myfirstlogin();
                    }
                }
            };
            request.open('GET', '/check-login', true);
            request.send(null);
        }
        
         function LoggedInUser(username) {
            var loginarena = document.getElementById('valid');
            loginarena.innerHTML = 
                `<h3> Hi! <i>${username}</i></h3>
                <a href="/logout"><button>Logout</button></a><br/><br/>`;
        }
        
         function details() {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                        if(request.status === 200 )
                        {
                            var detaildata = JSON.parse(this.responseText);
                            var content = 
                            `<h3>To view your details: </h3>
                            <a href="/author/${detaildata[0].username}">${detaildata[0].username} DETAILS</a><br/><br/>
                            <div><br><h3>
                            To control the robot click here:</h3>
                            <a href="/controlrobot">click me</a>
                            <h3>
                            New controls click here:</h3>
                            <button onclick="control_the_bot()">start controlling</button>
                            <div id="ui_for_robot"></div>
                             <div id="ui_status"></div>
                            <h3>
                            Current status of robot:</h3>
                            <button onclick=checkrobotstatus()>Check status</button>
                            <div id="stoop"></div>
                            
                            <h3> 
                            To view all the articles:</h3> 
                            <a href="/myfirstapp/articles">click here</a></div><br/><br/>
                            
                            <div>
                            To search any article enter here:
                            <input type="text" id="find" /><button type="submit" id="btn">search</button>
                            </div>
                            <div id="milgaya"></div><hr/>
                            To contribute the articles click here! 
                            <button type="submit" id="contribute_btn">Contribute</button>
                            `;
                            
                            document.getElementById('variable').innerHTML=content;
                            var kuch = document.getElementById('btn');
                            kuch.onclick = function() {
                            var request = new XMLHttpRequest();
                              request.onreadystatechange = function() {
                                if(request.readyState === XMLHttpRequest.DONE)  {
                                    if(request.status === 200)
                                    {
                                        var cont = `you can find this article <a href="/articles/${inp}">here</a>`;
                                        document.getElementById('milgaya').innerHTML = cont;
                                    }
                                    else
                                    {
                                        var kon=`<p></p>`;
                                        document.getElementById('milgaya').innerHTML = kon;
                                        alert('article not found');
                                    }
                                }
                              };
                                var inp = document.getElementById('find').value;
                                var kum = `/articles/${inp}`;
                                request.open('GET', kum, true);
                                request.send(null);
                            }; 
                            
                           var addition = document.getElementById('contribute_btn');
                                addition.onclick = function() {
                                var uploadhtml = `
                                        <hr/>Title for your article: 
                                        <input type="text" id="title" /><br>
                                        Write the content:<br>
                                        <textarea cols="50" rows="5" id="content">Body of the article</textarea><br>
                                        Category of the article:
                                        <input type="text" id="category" /><br>
                                        Date of uploading article:
                                        <input type="date" id="date" /><br>
                                        <button type="submit" id="add_btn">Continue</button> `;
                                    document.getElementById('contribution').innerHTML=uploadhtml;
                                    
                                    var add=document.getElementById('add_btn');
                                     add.onclick = function() {     
                                      //create a request
                                      var request = new XMLHttpRequest();
                                      //capture the response and store it in the variable
                                      
                                      request.onreadystatechange = function() {
                                        if(request.readyState === XMLHttpRequest.DONE)  {
                                            if(request.status === 200)
                                            {
                                                alert('article added successfully');
                                            }
                                            else if(request.status === 500)
                                            {
                                                alert('something went wrong on the server');
                                            }
                                            else if(request.status === 404)
                                            {
                                                alert('file not found');
                                            }
                                        }
                                      };
                                        var articlename = document.getElementById('title').value;
                                        var content = document.getElementById('content').value;
                                        var category = document.getElementById('category').value;
                                        var issuedon = document.getElementById('date').value;
                                      request.open('POST', 'http://adeepak269.imad.hasura-app.io/contribute', true);
                                      request.setRequestHeader('Content-Type','application/json');
                                      request.send(JSON.stringify({"articlename": articlename, "issuedon": issuedon, "content": content, "category": category}));
                                    };
                                }; 
                        }
                    }
                };
            request.open('GET', '/getdetails', true);
            request.send(null);
         }
        
        myfirstloadLogin();
        details();
                
       function checkrobotstatus() {
 			var dee="";
            var request = new XMLHttpRequest();
            request.open('GET', 'https://api.thingspeak.com/channels/380103/feeds.json?api_key=M1DV9XU6R7E2IDST&results=1');
            request.responseType = 'json';
            request.send();
            request.onload = function() {
                var render = request.response;
                var keep=render['feeds'];
                var keepup = keep[0].field1;
                if(keepup==100){
                dee="forward";
                }
                else if(keepup==200){
                dee="left";
                }
                else if(keepup==300){
                dee="right";
                }
                else if(keepup==400){
                dee="backward";
                }
                document.getElementById('stoop').innerHTML = dee;
 		}		
        }
        
        function control_the_bot() {
            var point = 0;
            var inserthojao = `<input type="radio" name="movement" id="move_forward" value="FORWARD" checked="unchecked"/>Forward
            <input type="radio" name="movement" id="move_left" value="LeFT" checked="unchecked" /> Left
            <input type="radio" name="movement" id="move_right" value="RIGHT" checked="unchecked" /> Right
            <input type="radio" name="movement" id="move_back" value="BACK" checked="unchecked" /> Back
            <input type="radio" name="movement" id="move_stop" value="STOP" checked="checked" /> Stop
            <button onclick="move_control()">submit</button> `; 
            document.getElementById("ui_for_robot").innerHTML = inserthojao;
        }
        function move_control() {
            if(document.getElementById('move_forward').checked) {
              point = 100;
            }else if(document.getElementById('move_left').checked) {
              point = 200;
            }
            else if(document.getElementById('move_right').checked) {
              point = 300;
            }
            else if(document.getElementById('move_back').checked) {
              point = 400;
            }
            else if(document.getElementById('move_stop').checked) {
              point = 500;
            }
            document.getElementById("ui_status").innerHTML = point;
            var request = new XMLHttpRequest();
            request.open('POST', 'http://adeepak269.imad.hasura-app.io/robot_present_values', true);
            request.setRequestHeader('Content-Type','application/json');
            request.send(JSON.stringify({"point": point}));
            }
