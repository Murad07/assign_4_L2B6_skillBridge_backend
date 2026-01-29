/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import config from '../../config/index.js';
import { ApiError, handleZodError } from '../../errors/index.js';
import { TErrorSources } from '../types/error.js';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //setting default values
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  // in development, log the full error to help debugging
  if (config.node_env === 'development') {
    // eslint-disable-next-line no-console
    console.error('Global Error Handler caught:', err);
  }

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof ApiError || (err && typeof (err as any).statusCode === 'number')) {
    // sometimes errors may not pass instanceof checks depending on how they're imported/constructed
    // so also accept any object that has a numeric statusCode
    const e: any = err;
    statusCode = e?.statusCode ?? 500;
    message = e?.message ?? message;
    errorSources = [
      {
        path: '',
        message: e?.message ?? message,
      },
    ];
  }

  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;