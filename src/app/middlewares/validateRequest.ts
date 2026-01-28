import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const validateRequest = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate body, params and query when provided by schema
            await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default validateRequest;
