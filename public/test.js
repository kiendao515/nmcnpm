axios.post('http://localhost:5000/api/v1/accounts/add?type=d', {
    email: 'admin@gmail.com',
    password: 'admin'
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

// const xhr = new XMLHttpRequest();
// xhr.open('POST', 'https://nmcnpm.herokuapp.com/api/v1/admin/login');
// xhr.setRequestHeader('X-PINGOTHER', 'pingpong');
// xhr.setRequestHeader('Content-Type', 'application/xml');
// xhr.onreadystatechange = handler;
// xhr.send('<person><name>Arun</name></person>');

// async function postData(url = 'http://localhost:5000/api/v1/admin/login', data = {
//         email: "admin@gmail.com",
//         password: "admin"
//     }) {
//         const response = await fetch(url, {
//             method: 'POST',
//             mode: 'no-cors',
//             cache: 'no-cache',
//             credentials: 'same-origin',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             redirect: 'follow',
//             referrerPolicy: 'no-referrer',
//             body: JSON.stringify(data)
//         });
//         const date = await response.json()
//         console.log(date)
//         return response.json(); 
// }