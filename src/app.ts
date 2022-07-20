import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from 'morgan';
import * as cors from 'cors';

// in case of anything wrong, put the message forward
function handleError(err, _req, res, _next) {
  res.status(err.statusCode || 500).send(err.message)
}


const app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: 'http://localhost:3000',
  preflightContinue: false,
};

app.use(cors(options))
app.use(handleError);

export default app;
