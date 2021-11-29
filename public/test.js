// axios.post('https://nmcnpm.herokuapp.com/api/v1/admin/login', {
//     email: 'admin@gmail.com',
//     password: 'admin'
//   })
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

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

const api = `https://nmcnpm.herokuapp.com/api/v2/bikes/free/619e7bc033bbc513096ead10`;
axios.get(api,{ headers: {"Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2MTcyZGQ2OTNlMDliMWEwOGFmZDk4NDEiLCJpYXQiOjE2MzgxNDc4MzMsImV4cCI6MTYzODE1MTQzM30.-Y_I0R-N4ad4Ce_GeHpoTD0Vbrcrhz02WmV7_Mfez8c"} })
        .then(res => {
            console.log(res.data);
})

// axios.post('https://nmcnpm.herokuapp.com/api/v1/user/login', {
//     password: "kiendao",
//     email:"kiend9814@gmail.com",
// }).then((response) => {
//     console.log(response)
// }).catch((error) => {
//     console.log(error)
// })