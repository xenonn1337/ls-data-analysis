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

export function PoliticalKnowledgeChart({ data }: Props) {
  // Knowledge by party
  const parties = ["Republican", "Democrat", "Independent", "Don't Know/Don't Identify"]
  const partyKnowledge = parties.map((party) => {
    const partyData = data.filter((d) => d.party.includes(party))
    const correct = partyData.filter((d) => d.politicalKnowledge).length
    return {
      party,
      correct,
      incorrect: partyData.length - correct,
      rate: partyData.length > 0 ? ((correct / partyData.length) * 100).toFixed(1) : "0",
    }
  })

  // Knowledge by GPA
  const gpaRanges = ["3.0 or below", "3.01-3.5", "3.51-4.0", "4.01 or above"]
  const gpaKnowledge = gpaRanges.map((gpa) => {
    const gpaData = data.filter((d) => d.gpa === gpa)
    const correct = gpaData.filter((d) => d.politicalKnowledge).length
    return {
      gpa,
      Correct: correct,
      Incorrect: gpaData.length - correct,
      rate: ((correct / gpaData.length) * 100).toFixed(1),
    }
  })

  // Overall knowledge
  const correct = data.filter((d) => d.politicalKnowledge).length
  const incorrect = data.length - correct
  const overallData = [
    { name: "Correct", value: correct, color: "#10b981" },
    { name: "Incorrect", value: incorrect, color: "#ef4444" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Overall Political Knowledge</CardTitle>
          <CardDescription>Can students correctly identify PA senators?</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overallData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {overallData.map((entry, index) => (
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
          <CardTitle>Knowledge by Party Affiliation</CardTitle>
          <CardDescription>Political knowledge across party lines</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={partyKnowledge}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="party" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="correct" stackId="a" fill="#10b981" name="Correct" />
              <Bar dataKey="incorrect" stackId="a" fill="#ef4444" name="Incorrect" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Knowledge by GPA Range</CardTitle>
          <CardDescription>Correlation between academic performance and political knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gpaKnowledge}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gpa" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Correct" fill="#10b981" />
              <Bar dataKey="Incorrect" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
