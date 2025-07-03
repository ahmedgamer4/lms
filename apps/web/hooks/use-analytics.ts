import { useQuery } from "@tanstack/react-query";
import {
  getMonthly,
  getOverview,
  getRecentActivities,
  getRevenueBreakdown,
  getStudents,
  getTopCourses,
} from "../lib/analytics";

export const useAnalytics = (period: number = 6) => {
  const overview = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => getOverview(),
  });

  const monthlyData = useQuery({
    queryKey: ["analytics", "monthly", period],
    queryFn: () => getMonthly(period),
  });

  const topCourses = useQuery({
    queryKey: ["analytics", "courses", "top"],
    queryFn: () => getTopCourses(),
  });

  const recentActivity = useQuery({
    queryKey: ["analytics", "activity"],
    queryFn: () => getRecentActivities(),
  });

  const students = useQuery({
    queryKey: ["analytics", "demographics"],
    queryFn: () => getStudents(),
  });

  const revenueBreakdown = useQuery({
    queryKey: ["analytics", "revenue"],
    queryFn: () => getRevenueBreakdown(),
  });

  return {
    overview: overview.data?.data?.overview,
    monthlyData: monthlyData.data?.data?.monthlyData,
    topCourses: topCourses.data?.data?.topCourses,
    recentActivity: recentActivity.data?.data?.recentActivities,
    students: students.data?.data?.students,
    revenueBreakdown: revenueBreakdown.data?.data?.revenueBreakdown,
    isLoading:
      overview.isLoading ||
      monthlyData.isLoading ||
      topCourses.isLoading ||
      revenueBreakdown.isLoading ||
      recentActivity.isLoading ||
      students.isLoading,
    error:
      overview.error ||
      monthlyData.error ||
      topCourses.error ||
      revenueBreakdown.error ||
      recentActivity.error ||
      students.error,
    refetch: () => {
      overview.refetch();
      monthlyData.refetch();
      topCourses.refetch();
      revenueBreakdown.refetch();
      recentActivity.refetch();
    },
  };
};
