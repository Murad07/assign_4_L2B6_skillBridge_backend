import { UserRole } from "../../middlewares/auth.js";
import { prisma } from "../../../lib/prisma.js";

interface ChartPoint {
    name: string;
    value: number;
}

interface OverviewData {
    stats: any[];
    chartData: {
        main: ChartPoint[];
        distribution: ChartPoint[];
    };
    recentActivity: any[];
}

export const OverviewService = {
    getOverviewData: async (userId: string, role: string): Promise<OverviewData> => {
        // Base Stats
        let stats: any[] = [];
        let chartData: { main: ChartPoint[]; distribution: ChartPoint[] } = {
            main: [],
            distribution: []
        };
        let recentActivity: any[] = [];

        // Role-based logic
        if (role === UserRole.ADMIN || role === UserRole.MANAGER) {
            const [totalUsers, totalStudents, totalTutors] = await Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { role: UserRole.STUDENT } }),
                prisma.user.count({ where: { role: UserRole.TUTOR } })
            ]);

            stats = [
                { label: "Total Users", value: totalUsers, trend: "+5%", icon: "Users" },
                { label: "Active Students", value: totalStudents, trend: "+12%", icon: "GraduationCap" },
                { label: "Verified Tutors", value: totalTutors, trend: "+2%", icon: "UserCheck" },
                { label: "Platform Revenue", value: "$12,450", trend: "+18%", icon: "DollarSign" }
            ];

            chartData.main = [
                { name: "Jan", value: 4000 },
                { name: "Feb", value: 3000 },
                { name: "Mar", value: 5000 },
                { name: "Apr", value: 4500 },
                { name: "May", value: 6000 },
                { name: "Jun", value: 5500 }
            ];

            chartData.distribution = [
                { name: "Students", value: totalStudents },
                { name: "Tutors", value: totalTutors },
                { name: "Staff", value: totalUsers - totalStudents - totalTutors }
            ];
        } else if (role === UserRole.TUTOR) {
            stats = [
                { label: "Total Sessions", value: 48, trend: "+8%", icon: "Video" },
                { label: "My Students", value: 12, trend: "+1", icon: "Users" },
                { label: "Total Earnings", value: "$1,240", trend: "+15%", icon: "CreditCard" },
                { label: "Average Rating", value: "4.9", trend: "0", icon: "Star" }
            ];

            chartData.main = [
                { name: "Mon", value: 4 },
                { name: "Tue", value: 6 },
                { name: "Wed", value: 8 },
                { name: "Thu", value: 5 },
                { name: "Fri", value: 9 },
                { name: "Sat", value: 12 },
                { name: "Sun", value: 7 }
            ];

            chartData.distribution = [
                { name: "Completed", value: 40 },
                { name: "Pending", value: 5 },
                { name: "Cancelled", value: 3 }
            ];
        } else {
            // Student
            stats = [
                { label: "Courses Joined", value: 4, trend: "0", icon: "BookOpen" },
                { label: "Hours Learned", value: 124, trend: "+12h", icon: "Clock" },
                { label: "Upcoming Sessions", value: 2, trend: "-1", icon: "Calendar" },
                { label: "Community Points", value: 850, trend: "+50", icon: "Award" }
            ];

            chartData.main = [
                { name: "Week 1", value: 10 },
                { name: "Week 2", value: 15 },
                { name: "Week 3", value: 8 },
                { name: "Week 4", value: 22 }
            ];

            chartData.distribution = [
                { name: "Programming", value: 60 },
                { name: "Design", value: 20 },
                { name: "Others", value: 20 }
            ];
        }

        // Mock recent activity for all
        recentActivity = [
            { id: 1, type: "Registration", message: "New student joined the platform", time: "2 mins ago" },
            { id: 2, type: "Booking", message: "Mathematics session confirmed", time: "1 hour ago" },
            { id: 3, type: "Payment", message: "Payout processed for Tutor John", time: "3 hours ago" }
        ];

        return {
            stats,
            chartData,
            recentActivity
        };
    }
};
