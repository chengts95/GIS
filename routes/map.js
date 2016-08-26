var express = require('express');
var router = express.Router();


router.get('/1', function(req, res, next) {

  res.render('map');
});

/* GET json data. */
router.get('/:name', function (req, res) {
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
