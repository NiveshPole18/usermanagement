"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Users, Activity, LineChart, ArrowUpRight, ArrowDownRight } from "lucide-react"

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,345",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-sky-500",
    },
    {
      title: "Active Users",
      value: "1,876",
      change: "+8.2%",
      trend: "up",
      icon: Activity,
      color: "text-emerald-500",
    },
    {
      title: "Conversion Rate",
      value: "32.5%",
      change: "-2.4%",
      trend: "down",
      icon: LineChart,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Dashboard Overview</h2>
        <p className="text-slate-400 mt-2">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isUp = stat.trend === "up"
          const Arrow = isUp ? ArrowUpRight : ArrowDownRight
          const trendColor = isUp ? "text-emerald-500" : "text-red-500"

          return (
            <Card key={stat.title} className="bg-slate-900/50 border-white/[0.08] hover:border-white/[0.12] transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                    <Arrow className="h-4 w-4" />
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-white/[0.08] hover:border-white/[0.12] transition-colors">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <div className="h-8 w-8 rounded-full bg-sky-500/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">New user registered</p>
                    <p className="text-xs text-slate-400">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/[0.08] hover:border-white/[0.12] transition-colors">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Add User", icon: Users, color: "bg-sky-500/10 text-sky-500" },
                { title: "Analytics", icon: LineChart, color: "bg-purple-500/10 text-purple-500" },
                { title: "Reports", icon: Activity, color: "bg-emerald-500/10 text-emerald-500" },
                { title: "Settings", icon: Users, color: "bg-orange-500/10 text-orange-500" },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.title}
                    className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className={`h-8 w-8 rounded-lg ${action.color} mb-3 flex items-center justify-center`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-white">{action.title}</p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
