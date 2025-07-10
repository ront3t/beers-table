import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createHttpError, {isHttpError} from 'http-errors'

import BeerRoute from './routes/beers';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.use('/api/Beer', BeerRoute);
app.use( (req,res,next) => {
  next(createHttpError(404, 'Not Found'));
})

app.use((error:unknown,req:Request, res:Response, next:NextFunction) => {
  let errorMessage = "fuck my life";
  let statusCode = 500;
  if (isHttpError(error))
  {
    statusCode = error.status
    errorMessage = error.message
  }
  res.status(statusCode).json({ error:errorMessage})
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


