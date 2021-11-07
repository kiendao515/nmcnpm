fetch("https://nmcnpm.herokuapp.com/api/v1/admin/login", {
     
    // Adding method type
    method: "POST",
    mode: 'no-cors',
     
    // Adding body or contents to send
    body: JSON.stringify({
        email: "admin@email.com",
        password: "admin"
    }),
     
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8",
        
    }
})
 
// Converting to JSON
.then(response => response.json())
 
// Displaying results to console
.then(json => console.log(json));