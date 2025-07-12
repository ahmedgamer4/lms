import { authFetch } from "./auth-fetch";
import { BACKEND_URL } from "./constants";

const baseUrl = BACKEND_URL + "/analytics";

export const getOverview = async () => {
  return await authFetch<{
    overview: {
      totalStudents: number;
      totalCourses: number;
      totalRevenue: string;
      avgCompletionRate: string;
      studentGrowth: number;
      revenueGrowth: number;
      courseGrowth: number;
      completionGrowth: number;
    };
  }>(`${baseUrl}/overview`);
};

export const getMonthly = async (period: number = 6) => {
  return await authFetch<{
    monthlyData: {
      month: string;
      students: number;
      revenue: string;
      completions: number;
      enrollments: number;
      activeUsers: number;
    }[];
  }>(`${baseUrl}/monthly?period=${period}`);
};

export const getRevenueBreakdown = async () => {
  return await authFetch<{
    revenueBreakdown: {
      byType: {
        type: string;
        amount: string;
      }[];
      byPeriod: {
        month: string;
        revenue: string;
      }[];
    };
  }>(`${baseUrl}/revenue/breakdown`);
};

export const getTopCourses = async () => {
  return await authFetch<{
    topCourses: {
      courseId: number;
      courseName: string;
      students: number;
      revenue: string;
      completionRate: string;
      imageUrl: string | null;
      createdAt: string;
    }[];
  }>(`${baseUrl}/top-courses`);
};

export const getRecentActivities = async () => {
  return await authFetch<{
    recentActivities: {
      id: number;
      type: string;
      student: {
        id: number;
        name: string;
        email: string;
      };
      course: {
        id: number;
        title: string;
        imageUrl: string;
      };
      timestamp: string;
      timeAgo: string;
    }[];
  }>(`${baseUrl}/activity`);
};

export const getStudents = async () => {
  return await authFetch<{
    students: {
      id: number;
      name: string;
      email: string;
      createdAt: string;
    }[];
  }>(`${baseUrl}/students`);
};
