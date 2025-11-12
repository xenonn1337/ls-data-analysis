"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SurveyData } from "./survey-dashboard"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Props {
  data: SurveyData[]
}

export function EnvironmentChart({ data }: Props) {
  const envOpinions = ["Too much", "About the right amount", "Too little", "Unsure/Don't Know"]

  const envData = envOpinions
    .map((opinion) => ({
      opinion: opinion === "Unsure/Don't Know" ? "Unsure" : opinion,
      value: data.filter((d) => d.environment === opinion).length,
      color:
        opinion === "Too little"
          ? "#10b981"
          : opinion === "About the right amount"
            ? "#3b82f6"
            : opinion === "Too much"
              ? "#ef4444"
              : "#94a3b8",
    }))
    .filter((d) => d.value > 0)

  // By party
  const parties = ["Republican", "Democrat", "Independent"]
  const partyEnvData = parties.map((party) => {
    const partyData = data.filter((d) => d.party.includes(party))
    return {
      party,
      "Too little": partyData.filter((d) => d.environment === "Too little").length,
      "Right amount": partyData.filter((d) => d.environment === "About the right amount").length,
      "Too much": partyData.filter((d) => d.environment === "Too much").length,
    }
  })

  // Government trust
  const trustLevels = ["All of the time", "Most of the time", "Some of the time", "Never"]
  const trustData = trustLevels
    .map((level) => ({
      level: level.replace(" of the time", ""),
      count: data.filter((d) => d.trustGov === level).length,
    }))
    .filter((d) => d.count > 0)

  // Minimum wage
  const wageOpinions = ["Increased", "Maintained", "Don't Know"]
  const wageData = wageOpinions
    .map((opinion) => ({
      opinion,
      count: data.filter((d) => d.minimumWage === opinion).length,
    }))
    .filter((d) => d.count > 0)

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Environmental Protection Opinion</CardTitle>
            <CardDescription>Is the government doing enough?</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={envData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ opinion, percent }) => `${opinion}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {envData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trust in Government</CardTitle>
            <CardDescription>When do students trust the government?</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trustData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#06b6d4" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environmental Views by Party</CardTitle>
          <CardDescription>How different parties view environmental protection efforts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={partyEnvData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="party" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Too little" stackId="a" fill="#10b981" />
              <Bar dataKey="Right amount" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Too much" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Federal Minimum Wage Opinion</CardTitle>
          <CardDescription>Should the minimum wage be increased?</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={wageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="opinion" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
