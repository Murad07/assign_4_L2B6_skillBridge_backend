import { Request, Response } from 'express';
import { OverviewService } from './overview.service.js';

export const OverviewController = {
    getOverview: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;

            const result = await OverviewService.getOverviewData(userId as string, role as string);

            res.status(200).json({
                success: true,
                message: "Overview data fetched successfully",
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to fetch overview data"
            });
        }
    }
};
