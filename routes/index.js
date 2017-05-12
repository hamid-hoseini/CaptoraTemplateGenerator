var express = require('express');
var router = express.Router();
var request = require('request');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});
router.post('/request', function (req, res) {
console.log(req.body.url);
  request(req.body.url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      console.log(html);
      res.send(html);
    }
  });
});

// router.get('/request', function (req, res) {
//     request(req.query.url, function (error, response, html) {
//         if (!error && response.statusCode == 200) {
//             console.log(html);
//             res.send(html);
//         }
//     });
// });

module.exports = router;
