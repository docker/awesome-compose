const express = require('express');
const redis = require('redis');
const app = express();
const redisClient = redis.createClient({
  host: 'redis',
  port: 6379
});


app.get('/', function(req, res) {
    redisClient.get('numVisits', function(err, numVisits) {
        numVisitsToDisplay = parseInt(numVisits) + 1;
        if (isNaN(numVisitsToDisplay)) {
            numVisitsToDisplay = 1;
        }
        res.send('web1: Total number of visits is: ' + numVisitsToDisplay);
        numVisits++;
        redisClient.set('numVisits', numVisits);
    });
});

app.listen(5000, function() {
    console.log('Web app is listening on port 5000');
});
