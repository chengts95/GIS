var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { username: 'Express',title:'GIS_TEST'});
});
router.get('/map/1', function(req, res, next) {
  res.render('map');
});
/* GET json data. */
router.get('/map/:name', function (req, res) {
    if (req.params.name===1) {
      res.render('map');
    }else{

      res.render('error',{
        message: "No such map",
        error: "404"
      });

    }
});
module.exports = router;
