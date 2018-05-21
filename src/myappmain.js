            function loadLoginPage() {
                var loginHTML = 
                    `<h3>Login Access</h3>
                    <label><b>PASSENGER NAME</b></label>
                    <br>
                    <input type="text" placeholder="Name" id="name" />
                    <br>
                    <hr/>
                    <label><b>BAG TAG NUMBER</b></label>
                    <br>
                    <input type="text" placeholder="Tagid" id="tagid" />
                    <hr/> 
                    <button type="submit" id="myappsubmit" >Login</button>`;
                    document.getElementById('loginsubmit').innerHTML=loginHTML;
                
                var submit=document.getElementById('myappsubmit');
                 submit.onclick = function() {
                  var request = new XMLHttpRequest();
                  request.onreadystatechange = function() {
                    if(request.readyState === XMLHttpRequest.DONE)  {
                        if(request.status === 200)
                        {
                            alert('login successful !!');
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
                  var name = document.getElementById('name').value;
                  var tagid = document.getElementById('tagid').value;
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/myapp/login', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"name": name, "tagid": tagid}));
            };
        }
        
        function loadLogin() {
            // Check if the user is already logged in
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        loadLoggedInUser(this.responseText);
                    } else {
                        loadLoginPage();
                    }
                }
            };
            request.open('GET', '/myapp/checklogin', true);
            request.send(null);
        }
        
        function loadLoggedInUser(username) {
            var loginArea = document.getElementById('loginsubmit');
            loginArea.innerHTML = 
                `<h3> Hi! <i>${username}</i></h3>
                <a href="/myapp/logout">Logout</a>`;
        }
        
        function loadDetails() {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                        if(request.status === 200 )
                        {
                            var detailData = JSON.parse(this.responseText);
                            var contentHTML = 
                            `<a href="/customer/${detailData[0].booking}">${detailData[0].name} DETAILS</a><br/><br/>
                            <div>For checking the status of your baggage...</div>
                            <a href="/customer/baggage/${detailData[0].tagid}">click here</a>`;
                            document.getElementById('customer').innerHTML = contentHTML;
                        }
                    }
                };
            request.open('GET', '/myapp/getdetails', true);
            request.send(null);
        }

        loadLogin();
        loadDetails();
        
        
        
         var register=document.getElementById('myapp_register');
                 register.onclick = function() {
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
                            alert('forbidden request');
                        }
                        else if(request.status === 404)
                        {
                            alert('file not found');
                        }
                    }
                  };
                  
                  var name = document.getElementById('name').value;
                  var email = document.getElementById('email').value;
                  var contact = document.getElementById('contact').value;
                  var flight = document.getElementById('flight').value;
                  var fromcity = document.getElementById('fromcity').value;
                  var tocity = document.getElementById('tocity').value;
                  var date = document.getElementById('date').value;
                  var booking = document.getElementById('book').value;
                  var pnr = document.getElementById('pnr').value;
                  var tagid = document.getElementById('tagid').value;
    
                  request.open('POST', 'http://adeepak269.imad.hasura-app.io/registration', true);
                  request.setRequestHeader('Content-Type','application/json');
                  request.send(JSON.stringify({"name": name, "email": email, "contact": contact, "flight": flight, "fromcity": fromcity, "tocity": tocity, "date": date, "booking": booking, "pnr": pnr, "tagid": tagid}));
                };
            
