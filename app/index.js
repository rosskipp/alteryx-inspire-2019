const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

const predict = (data, done) => {
  const body = data;
  const url = "http://localhost/ross/models/ShotPredictor/predict";
  const options = {
    url: url,
    method: 'post',
    body: body,
    json: true,
    auth: {
      user: 'USER',
      pass: 'API_KEY'
    }
  };
  request(options, (err, res, body) => {
    done(err, body);
  });
}

app.post('/predict', (req, res) => {
  predict(req.body, (err, response) => {
    if (err) {
      console.log(err);
      return;
    }
    if (response && response.status && response.status === "ERROR") {
      console.log("issue with the prediciton ", JSON.stringify(response));
    }
    if (response && response.result && response.result.shot_prob) {
      res.json({
        status: "OK",
        prediction: response.result.shot_prob,
      });
    } else {
      console.log("issue with the response:", JSON.stringify(response));
    }
  });
});

app.listen(process.env.PORT || 8787, () => console.log('Running on port 8787!'));
