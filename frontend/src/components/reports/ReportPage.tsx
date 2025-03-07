// "use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { SidebarNav } from "../dashboard/components/sidebar/SidebarNav"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import styles from "./styles/reports.module.css"
import { useBookingData } from "@/features/reports/hooks/useReports"
import {
  calculateDailyRevenue,
  calculateWeeklyRevenue,
  calculateMonthlyRevenue,
  calculateYearlyRevenue,
  calculateDailyBookings,
  calculateWeeklyBookings,
  calculateMonthlyBookings,
  calculateYearlyBookings,
} from "@/features/reports/revenueCalculations"
import { format } from "date-fns"
import type { BookingData } from "@/features/reports/types/reports"

const calculateCancellations = (
  bookings: BookingData[],
  timeFrame: "daily" | "weekly" | "monthly" | "yearly"
): Record<string, number> => {
  const cancellations: Record<string, number> = { total: 0 };
  const bookingsArray = Array.isArray(bookings) ? bookings : [];

  if (bookingsArray.length === 0) {
    return cancellations;
  }

  bookingsArray.forEach((booking) => {
    if (booking?.status === "ไม่สำเร็จ") {
      let key: string;
      const date = new Date(booking.time_t2);

      switch (timeFrame) {
        case "daily":
          key = format(date, "yyyy-MM-dd");
          break;
        case "weekly":
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
          key = format(weekStart, "yyyy-MM-dd");
          break;
        case "monthly":
          key = format(date, "yyyy-MM");
          break;
        case "yearly":
          key = format(date, "yyyy");
          break;
        default:
          key = format(date, "yyyy-MM-dd");
      }

      cancellations[key] = (cancellations[key] || 0) + 1;
      cancellations.total += 1;
    }
  });

  return cancellations;
};

const ChartCard = ({
  title,
  value,
  date,
  bookings,
  cancellations,
  children,
}: {
  title: string
  value: string
  date: string
  bookings: number
  cancellations: number
  children: React.ReactNode
}) => {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={styles.chartValue}>{value}</p>
        <div className={styles.bookingInfo}>
          <p>
            {t("reports.totalBookings")}: {bookings}
          </p>
          <p>
            {t("reports.totalCancellations")}: {cancellations}
          </p>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

export default function ReportPage() {
  const { t } = useTranslation()
  const { bookingData} = useBookingData()
  const [timeFrame, setTimeFrame] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [exportFormat] = useState("csv")
  const [todayStats, setTodayStats] = useState({ revenue: 0, bookings: 0, cancellations: 0 })

  const dailyRevenue = calculateDailyRevenue(bookingData)
  const weeklyRevenue = calculateWeeklyRevenue(bookingData)
  const monthlyRevenue = calculateMonthlyRevenue(bookingData)
  const yearlyRevenue = calculateYearlyRevenue(bookingData)

  const dailyBookings = calculateDailyBookings(bookingData)
  const weeklyBookings = calculateWeeklyBookings(bookingData)
  const monthlyBookings = calculateMonthlyBookings(bookingData)
  const yearlyBookings = calculateYearlyBookings(bookingData)

  const dailyCancellations = calculateCancellations(bookingData, "daily")
  const weeklyCancellations = calculateCancellations(bookingData, "weekly")
  const monthlyCancellations = calculateCancellations(bookingData, "monthly")
  const yearlyCancellations = calculateCancellations(bookingData, "yearly")

  useEffect(() => {
    if (bookingData.length > 0) {
      const today = format(new Date(), "yyyy-MM-dd")
      const todayRevenue = dailyRevenue[today] || 0
      const todayBookings = dailyBookings[today] || 0
      const todayCancellations = dailyCancellations[today] || 0

      if (
        todayStats.revenue !== todayRevenue ||
        todayStats.bookings !== todayBookings ||
        todayStats.cancellations !== todayCancellations
      ) {
        setTodayStats({
          revenue: todayRevenue,
          bookings: todayBookings,
          cancellations: todayCancellations,
        })
      }
    }
  }, [bookingData, dailyRevenue, dailyBookings, dailyCancellations, todayStats])
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const renderRevenueChart = () => {
    let data;
  
    switch (timeFrame) {
      case "daily":
        data = Object.entries(dailyRevenue).map(([date, revenue]) => ({
          date,
          revenue,
          bookings: dailyBookings[date] || 0,
          cancellations: dailyCancellations[date] || 0,
        }));
  
        // Check if data is empty and set default values
        if (data.length === 0) {
          data = [{ date: 'No Data', revenue: 0, bookings: 0, cancellations: 0 }];
        }
  
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                name={t("reports.totalRevenue")}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                stroke="#82ca9d"
                name={t("reports.totalBookings")}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cancellations"
                stroke="#ff7f7f"
                name={t("reports.totalCancellations")}
              />
            </LineChart>
          </ResponsiveContainer>
        );
  
      case "weekly":
      case "monthly":
        data = Object.entries(timeFrame === "weekly" ? weeklyRevenue : monthlyRevenue).map(([period, revenue]) => ({
          period,
          revenue,
          bookings: (timeFrame === "weekly" ? weeklyBookings : monthlyBookings)[period] || 0,
          cancellations: (timeFrame === "weekly" ? weeklyCancellations : monthlyCancellations)[period] || 0,
        }));
  
        // Check if data is empty and set default values
        if (data.length === 0) {
          data = [{ period: 'No Data', revenue: 0, bookings: 0, cancellations: 0 }];
        }
  
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name={t("reports.totalRevenue")} />
              <Bar dataKey="bookings" fill="#82ca9d" name={t("reports.totalBookings")} />
              <Bar dataKey="cancellations" fill="#ff7f7f" name={t("reports.totalCancellations")} />
            </BarChart>
          </ResponsiveContainer>
        );
  
      case "yearly":
        const yearlyData = Object.keys(yearlyRevenue).map((year) => ({
          year,
          revenue: yearlyRevenue[year],
          bookings: yearlyBookings[year] || 0,
          cancellations: yearlyCancellations[year] || 0,
        }));
  
        // Check if data is empty and set default values
        if (yearlyData.length === 0) {
          yearlyData.push({ year: 'No Data', revenue: 0, bookings: 0, cancellations: 0 });
        }
  
        const COLORS = {
          revenue: "#8884d8",
          bookings: "#82ca9d",
          cancellations: "#ff7f7f",
        };
  
        const pieData = [
          {
            name: t("reports.totalRevenue"),
            value: yearlyData.reduce((sum, item) => sum + item.revenue, 0),
            color: COLORS.revenue,
          },
          {
            name: t("reports.totalBookings"),
            value: yearlyData.reduce((sum, item) => sum + item.bookings, 0),
            color: COLORS.bookings,
          },
          {
            name: t("reports.totalCancellations"),
            value: yearlyData.reduce((sum, item) => sum + item.cancellations, 0),
            color: COLORS.cancellations,
          },
        ];
  
        // Check if pieData is empty and set default values
        if (pieData.every(item => item.value === 0)) {
          pieData.push({ name: 'No Data', value: 0, color: '#ccc' });
        }
  
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };  
  const handleExport = () => {
    let dataToExport;
  
    switch (timeFrame) {
      case "daily":
        dataToExport = Object.entries(dailyRevenue).map(([date, revenue]) => ({
          date,
          revenue,
          bookings: dailyBookings[date] || 0,
          cancellations: dailyCancellations[date] || 0,
        }));
        break;
      case "weekly":
        dataToExport = Object.entries(weeklyRevenue).map(([week, revenue]) => ({
          week,
          revenue,
          bookings: weeklyBookings[week] || 0,
          cancellations: weeklyCancellations[week] || 0,
        }));
        break;
      case "monthly":
        dataToExport = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
          month,
          revenue,
          bookings: monthlyBookings[month] || 0,
          cancellations: monthlyCancellations[month] || 0,
        }));
        break;
      case "yearly":
        dataToExport = Object.entries(yearlyRevenue).map(([year, revenue]) => ({
          year,
          revenue,
          bookings: yearlyBookings[year] || 0,
          cancellations: yearlyCancellations[year] || 0,
        }));
        break;
      default:
        return;
    }
  
    // หาผลรวมของแต่ละคอลัมน์
    const totals = dataToExport.reduce(
      (acc, curr) => {
        acc.totalRevenue += curr.revenue;
        acc.totalBookings += curr.bookings;
        acc.totalCancellations += curr.cancellations;
        return acc;
      },
      { totalRevenue: 0, totalBookings: 0, totalCancellations: 0 },
    );
  
    const headers = [t("date"), t("revenue"), t("bookings"), t("cancellations")];
  
    const csvContent = [
      "\uFEFF", // BOM for UTF-8
      headers.join(","),
      ...dataToExport.map((row) => Object.values(row).join(",")),
      "", // เพิ่มบรรทัดว่างก่อนผลรวม
      `${t("total")},${totals.totalRevenue},${totals.totalBookings},${totals.totalCancellations}`,
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    // เปลี่ยนชื่อไฟล์ที่ดาวน์โหลด
    const fileName = `${t("reports.exportFileName")}_${timeFrame === "daily" ? "วัน" : timeFrame === "weekly" ? "สัปดาห์" : timeFrame === "monthly" ? "เดือน" : "ปี"}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // if (isLoading) {
  //   return <div>Loading...</div>
  // }

  // if (error) {
  //   return <div>Error loading data</div>
  // }

  return (
    <div className={styles.container}>
      <SidebarNav toggleSidebar={toggleSidebar} isCollapsed={!isSidebarCollapsed} />
      <main className={`${styles.main} ${!isSidebarCollapsed ? styles.mainContentCollapsed : ""}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t("reports.title")}</h1>
          <p className={styles.subtitle}>{t("reports.subtitle")}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t("reports.tabs.overview")}</TabsTrigger>
            <TabsTrigger value="daily">{t("reports.tabs.daily")}</TabsTrigger>
            <TabsTrigger value="weekly">{t("reports.tabs.weekly")}</TabsTrigger>
            <TabsTrigger value="monthly">{t("reports.tabs.monthly")}</TabsTrigger>
            <TabsTrigger value="yearly">{t("reports.tabs.yearly")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ChartCard
              title={t("reports.totalRevenue")}
              value={`${Math.round(todayStats.revenue)} ${t("฿")}`}
              date={t("reports.today")}
              bookings={Math.round(todayStats.bookings)}
              cancellations={Math.round(todayStats.cancellations)}
            >
              <Select
                value={timeFrame}
                onValueChange={(value) => setTimeFrame(value as "daily" | "weekly" | "monthly" | "yearly")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("reports.selectTimeFrame")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t("reports.tabs.daily")}</SelectItem>
                  <SelectItem value="weekly">{t("reports.tabs.weekly")}</SelectItem>
                  <SelectItem value="monthly">{t("reports.tabs.monthly")}</SelectItem>
                  <SelectItem value="yearly">{t("reports.tabs.yearly")}</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-[300px]">{renderRevenueChart()}</div>
            </ChartCard>
          </TabsContent>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>{t("reports.dailyRevenue")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{t("reports.tableHeaders.date")}</th>
                        <th>{t("reports.tableHeaders.totalRevenue")}</th>
                        <th>{t("reports.tableHeaders.totalBookings")}</th>
                        <th>{t("reports.tableHeaders.totalCancellations")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(dailyRevenue).map(([date, revenue]) => (
                        <tr key={date}>
                          <td>{date}</td>
                          <td>
                            {Math.round(revenue)} {t("฿")}
                          </td>
                          <td>{Math.round(dailyBookings[date] || 0)}</td>
                          <td>{Math.round(dailyCancellations[date] || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>{t("reports.weeklyRevenue")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{t("reports.tableHeaders.week")}</th>
                        <th>{t("reports.tableHeaders.totalRevenue")}</th>
                        <th>{t("reports.tableHeaders.totalBookings")}</th>
                        <th>{t("reports.tableHeaders.totalCancellations")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(weeklyRevenue).map(([week, revenue]) => (
                        <tr key={week}>
                          <td>{week}</td>
                          <td>
                            {Math.round(revenue)} {t("฿")}
                          </td>
                          <td>{Math.round(weeklyBookings[week] || 0)}</td>
                          <td>{Math.round(weeklyCancellations[week] || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>{t("reports.monthlyRevenue")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{t("reports.tableHeaders.month")}</th>
                        <th>{t("reports.tableHeaders.totalRevenue")}</th>
                        <th>{t("reports.tableHeaders.totalBookings")}</th>
                        <th>{t("reports.tableHeaders.totalCancellations")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(monthlyRevenue).map(([month, revenue]) => (
                        <tr key={month}>
                          <td>{month}</td>
                          <td>
                            {Math.round(revenue)} {t("฿")}
                          </td>
                          <td>{Math.round(monthlyBookings[month] || 0)}</td>
                          <td>{Math.round(monthlyCancellations[month] || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yearly">
            <Card>
              <CardHeader>
                <CardTitle>{t("reports.yearlyRevenue")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{t("reports.tableHeaders.year")}</th>
                        <th>{t("reports.tableHeaders.totalRevenue")}</th>
                        <th>{t("reports.tableHeaders.totalBookings")}</th>
                        <th>{t("reports.tableHeaders.totalCancellations")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(yearlyRevenue).map(([year, revenue]) => (
                        <tr key={year}>
                          <td>{year}</td>
                          <td>
                            {Math.round(revenue)} {t("฿")}
                          </td>
                          <td>{Math.round(yearlyBookings[year] || 0)}</td>
                          <td>{Math.round(yearlyCancellations[year] || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className={styles.export}>
          <Card>
            <CardHeader>
              <CardTitle>{t("reports.exportData")}</CardTitle>
              <CardDescription>{t("reports.exportDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <button className={styles.exportButton} onClick={handleExport}>
                <Download className={styles.exportIcon} />
                {t("reports.exportButton")}
              </button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

