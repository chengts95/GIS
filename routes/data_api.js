var pg = require('pg')

var express = require('express');
var router = express.Router();
// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
hostname='223.3.60.170'
var config = {
  user: 'gis', //env var: PGUSER
  database: 'data', //env var: PGDATABASE
  password: '123456', //env var: PGPASSWORD
  host: hostname, // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  });

  var onError = function(err) {
    console.log(err.message, err.stack)
  };

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})


router.get('/map1/heat', function(req, res, next) {



  pool.query('SELECT lng, lat, load from trans_data', function(err, result) {
      // handle an error from the query
      if(err) return onError(err);
      array=result['rows'];

      var i = array.length;
      var temp = new Array(array.length);
      while (i--){
        if (!array[i]['lat'])
          {
              array[i]['lat']=0;
          }
          if (!array[i]['lng'])
            {
                array[i]['lng']=0;
            }

          temp[i]=[array[i]['lat'],array[i]['lng'],array[i]['load']]
      }




        res.json(temp);
      })

    }
);





router.get('/map1/trans', function(req, res, next) {



  pool.query('SELECT name,lng, lat, load from trans_data', function(err, result) {
      // handle an error from the query
      if(err) return onError(err);
      array=result['rows'];
      var temp=new Object();

      temp.type='FeatureCollection';
      temp.features=[];


      var i = array.length;
      while (i--){
        /*if (!array[i]['lat'])
          {
              array[i]['lat']=0;
          }
          if (!array[i]['lng'])
            {
                array[i]['lng']=0;
            }*/
            if (array[i]['lat'] && array[i]['lng'])
              {


                    temp.features.push(
                      { "type": "Feature","geometry":
                        {"type": "Point", "coordinates": [array[i]['lng'], array[i]['lat']]},
                        "properties": {"name": array[i]['name'],'load':array[i]['load']}
                      }
                   );
              }
          //temp[i]=[array[i]['lat'],array[i]['lng'],array[i]['load']]
      }




        res.json(temp);
      })

    }
);

module.exports = router;
