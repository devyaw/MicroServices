import  logger  from '../Config/logger.js';


export const errorHandler = (err, req, res, next) => {
  logger.error(err);
  res.status(500).send('Internal Server Error');
};

export default errorHandler;
