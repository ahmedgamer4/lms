"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  RefreshCw,
  Loader,
} from "lucide-react";
import { useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

const mockData = {
  overview: {
    totalStudents: 1247,
    totalCourses: 23,
    totalRevenue: 45678,
    avgCompletionRate: 78.5,
    studentGrowth: 12.3,
    revenueGrowth: 8.7,
    courseGrowth: 15.2,
    completionGrowth: -2.1,
  },
  recentActivity: [
    {
      id: 1,
      type: "enrollment",
      student: "Sarah Johnson",
      course: "Advanced React Development",
      time: "2 minutes ago",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      type: "completion",
      student: "Mike Chen",
      course: "Python for Data Science",
      time: "15 minutes ago",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      type: "review",
      student: "Emma Davis",
      course: "UI/UX Design Fundamentals",
      time: "1 hour ago",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      type: "purchase",
      student: "Alex Thompson",
      course: "Machine Learning Basics",
      time: "2 hours ago",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  ],
  topCourses: [
    {
      name: "Advanced React Development",
      students: 234,
      revenue: 11700,
      rating: 4.8,
    },
    {
      name: "Python for Data Science",
      students: 189,
      revenue: 9450,
      rating: 4.9,
    },
    {
      name: "UI/UX Design Fundamentals",
      students: 156,
      revenue: 7800,
      rating: 4.7,
    },
    {
      name: "Machine Learning Basics",
      students: 142,
      revenue: 7100,
      rating: 4.6,
    },
    {
      name: "Web Development Bootcamp",
      students: 128,
      revenue: 6400,
      rating: 4.5,
    },
  ],
  monthlyData: [
    { month: "Jan", students: 120, revenue: 6000, completions: 85 },
    { month: "Feb", students: 150, revenue: 7500, completions: 110 },
    { month: "Mar", students: 180, revenue: 9000, completions: 135 },
    { month: "Apr", students: 200, revenue: 10000, completions: 150 },
    { month: "May", students: 220, revenue: 11000, completions: 165 },
    { month: "Jun", students: 250, revenue: 12500, completions: 180 },
  ],
};

const chartConfig = {
  students: {
    label: "Students",
    color: "var(--chart-1)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
  completions: {
    label: "Completions",
    color: "var(--chart-3)",
  },
  courses: {
    label: "Courses",
    color: "var(--chart-4)",
  },
};

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend = "up",
}: {
  title: string;
  value: string | number;
  change: number;
  icon: any;
  trend?: "up" | "down";
}) => {
  const t = useTranslations("analytics");

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center space-x-1">
              {trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {Math.abs(change)}%
              </span>
              <span className="text-muted-foreground text-sm">
                {t("metrics.fromLastMonth")}
              </span>
            </div>
          </div>
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <Icon className="text-primary h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ activity }: { activity: any }) => {
  const t = useTranslations("analytics");

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "completion":
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case "review":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "purchase":
        return <DollarSign className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (type: string, student: string, course: string) => {
    switch (type) {
      case "enrollment":
        return `${student} ${t("activity.enrolledIn")} ${course}`;
      case "completion":
        return `${student} ${t("activity.completed")} ${course}`;
      case "review":
        return `${student} ${t("activity.reviewed")} ${course}`;
      case "purchase":
        return `${student} ${t("activity.purchased")} ${course}`;
      default:
        return `${student} ${t("activity.performedActionOn")} ${course}`;
    }
  };

  return (
    <div className="hover:bg-muted/50 flex items-center space-x-4 rounded-lg p-2 transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={activity.student.avatar} />
        <AvatarFallback>
          {activity.student.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          {getActivityIcon(activity.type)}
          <p className="text-sm font-medium">
            {getActivityText(
              activity.type,
              activity.student.name,
              activity.course.title,
            )}
          </p>
        </div>
        <p className="text-muted-foreground text-xs">{activity.timeAgo}</p>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const t = useTranslations("analytics");

  const timeRangeToPeriod = {
    "90d": 3,
    "6m": 6,
    "1y": 12,
  };
  const period =
    timeRangeToPeriod[timeRange as keyof typeof timeRangeToPeriod] || 6;

  const {
    overview,
    monthlyData,
    topCourses,
    recentActivity,
    students,
    revenueBreakdown,
    error,
    isLoading,
    refetch,
  } = useAnalytics(period);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
    refetch();
  };

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="text-red-500">{error.message}</div>
        <Button variant="outline" onClick={handleRefresh}>
          {t("refresh")}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="text-muted-foreground h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center space-x-2 place-self-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                {timeRange === "90d"
                  ? t("timeRanges.last90Days")
                  : timeRange === "6m"
                    ? t("timeRanges.last6Months")
                    : timeRange === "1y"
                      ? t("timeRanges.last1Year")
                      : t("timeRanges.custom")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange("90d")}>
                {t("timeRanges.last90Days")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("6m")}>
                {t("timeRanges.last6Months")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("1y")}>
                {t("timeRanges.last1Year")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {t("refresh")}
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("metrics.totalStudents")}
          value={overview?.totalStudents || 0}
          change={Number(overview?.studentGrowth) || 0}
          icon={Users}
          trend="up"
        />
        <MetricCard
          title={t("metrics.totalCourses")}
          value={overview?.totalCourses || 0}
          change={Number(overview?.courseGrowth) || 0}
          icon={BookOpen}
          trend="up"
        />
        <MetricCard
          title={t("metrics.totalRevenue")}
          value={`$${overview?.totalRevenue?.toLocaleString()}`}
          change={Number(overview?.revenueGrowth) || 0}
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title={t("metrics.completionRate")}
          value={`${Number(overview?.avgCompletionRate).toFixed(2)}%`}
          change={overview?.completionGrowth || 0}
          icon={Target}
          trend="down"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="courses">{t("tabs.courses")}</TabsTrigger>
          <TabsTrigger value="students">{t("tabs.students")}</TabsTrigger>
          <TabsTrigger value="revenue">{t("tabs.revenue")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {/* Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>{t("charts.studentGrowth")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient
                        id="studentGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-muted-foreground text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      className="text-muted-foreground text-xs"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background rounded-lg border p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground text-[0.70rem] uppercase">
                                    {t("metrics.totalStudents")}
                                  </span>
                                  <span className="text-muted-foreground font-bold">
                                    {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#studentGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>{t("charts.revenueTrend")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-muted-foreground text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      className="text-muted-foreground text-xs"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background rounded-lg border p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground text-[0.70rem] uppercase">
                                    {t("metrics.totalRevenue")}
                                  </span>
                                  <span className="text-muted-foreground font-bold">
                                    ${payload[0].value?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{
                        fill: "hsl(var(--chart-2))",
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                        stroke: "hsl(var(--chart-2))",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>{t("charts.completionRate")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {Number(overview?.avgCompletionRate).toFixed(2) || 0}%
                    </span>
                    <Badge variant="secondary">{t("charts.target")}: 85%</Badge>
                  </div>
                  <Progress
                    value={Number(overview?.avgCompletionRate) || 0}
                    className="h-2"
                  />
                  <p className="text-muted-foreground text-sm">
                    {Number(overview?.avgCompletionRate) >= 85
                      ? t("charts.aboveTarget")
                      : t("charts.belowTarget")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>{t("activity.recentActivity")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivity?.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Performing Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>{t("charts.topPerformingCourses")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCourses?.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{course.courseName}</p>
                        <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                          <span>
                            {course.students}{" "}
                            {t("courses.students").toLowerCase()}
                          </span>
                          <span>${course.revenue.toLocaleString()}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{mockData.topCourses[0]?.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>{t("charts.coursePerformance")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    data={topCourses?.slice(0, 5).map((course) => ({
                      ...course,
                      students: Number(course.students),
                      revenue: Number(course.revenue),
                      completionRate: Number(course.completionRate),
                    }))}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="courseName"
                      className="text-muted-foreground text-xs"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value.split(" ")[0]}
                    />
                    <YAxis
                      className="text-muted-foreground text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background rounded-lg border p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground text-[0.70rem] uppercase">
                                    {t("courses.students")}
                                  </span>
                                  <span className="text-muted-foreground font-bold">
                                    {payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="students"
                      fill="var(--chart-1)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Student Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>{t("students.studentDemographics")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("students.ageGroups.age18to25")}
                    </span>
                    <span className="font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("students.ageGroups.age26to35")}
                    </span>
                    <span className="font-medium">32%</span>
                  </div>
                  <Progress value={32} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("students.ageGroups.age36plus")}
                    </span>
                    <span className="font-medium">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{t("students.geographicDistribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("students.regions.northAmerica")}
                    </span>
                    <span className="font-medium">52%</span>
                  </div>
                  <Progress value={52} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("students.regions.europe")}
                    </span>
                    <span className="font-medium">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("students.regions.asiaPacific")}
                    </span>
                    <span className="font-medium">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>{t("students.engagementMetrics")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">78.5%</div>
                    <div className="text-muted-foreground text-sm">
                      {t("students.averageCompletionRate")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      4.7/5
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {t("students.averageRating")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2.3</div>
                    <div className="text-muted-foreground text-sm">
                      {t("students.coursesPerStudent")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>{t("revenue.revenueBreakdown")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("revenue.courseSales")}</span>
                    <span className="font-medium">$38,450</span>
                  </div>
                  <Progress value={84} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("revenue.subscriptions")}
                    </span>
                    <span className="font-medium">$5,228</span>
                  </div>
                  <Progress value={11} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {t("revenue.certifications")}
                    </span>
                    <span className="font-medium">$2,000</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChartIcon className="h-5 w-5" />
                  <span>{t("charts.revenueTrend")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--chart-2)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--chart-2)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-muted-foreground text-xs"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      className="text-muted-foreground text-xs"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background rounded-lg border p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground text-[0.70rem] uppercase">
                                    {t("metrics.totalRevenue")}
                                  </span>
                                  <span className="text-muted-foreground font-bold">
                                    ${payload[0].value?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-2))"
                      fill="url(#revenueGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
