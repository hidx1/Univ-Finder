const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const PORT = 5000 || process.env.PORT;

const cors = require('cors');

// const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors({
    credentials: true
}));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static('public'));

console.log(`Server listening in port ${PORT}`);

// app.get('/ping', function (req, res) {
//  return res.send('pong');
// });

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// const proxy = createProxyMiddleware({
//     target: 'http://universities.hipolabs.com/',
//     changeOrigin: true,
// })

// app.use('/', proxy);

app.get('/users', function(req, res) {
    let email = req.query.email;

    let em = {
        email: email
    }

    fs.writeFile('users.json', JSON.stringify(em), finished);

    function finished(err) {
        console.log('User saved');
    }
});

app.listen(5000 || process.env.PORT);