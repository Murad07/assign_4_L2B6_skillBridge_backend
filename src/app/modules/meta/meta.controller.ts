import { Request, Response } from 'express';
import { MetaService } from './meta.service.js';

export const MetaController = {
    getPublicStats: async (req: Request, res: Response) => {
        try {
            const stats = await MetaService.getPublicStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch meta stats"
            });
        }
    }
};
