"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SurveyData } from "./survey-dashboard"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Props {
  data: SurveyData[]
}

export function PartyDistributionChart({ data }: Props) {
  const parties = [
    { name: "Republican", color: "#dc2626" },
    { name: "Democrat", color: "#2563eb" },
    { name: "Independent", color: "#7c3aed" },
    { name: "Don't Know/Don't Identify", color: "#6b7280" },
  ]

  const partyData = parties.map((party) => ({
    ...party,
    value: data.filter((d) => d.party.includes(party.name)).length,
  }))

  // Ideology distribution
  const ideologies = ["Liberal", "Somewhat Liberal", "Moderate", "Somewhat Conservative", "Conservative"]
  const ideologyData = ideologies
    .map((ideology) => ({
      ideology,
      count: data.filter((d) => d.ideology.includes(ideology)).length,
    }))
    .filter((d) => d.count > 0)

  // Parent vs Student party
  const parentInfluence = data.filter((d) => d.party && d.parentsParty)
  const sameParty = parentInfluence.filter((d) => {
    const studentParty = d.party.split(";")[0].trim()
    return d.parentsParty.includes(studentParty)
  }).length
  const differentParty = parentInfluence.length - sameParty

  const influenceData = [
    { category: "Same as Parents", count: sameParty },
    { category: "Different from Parents", count: differentParty },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Student Party Affiliation</CardTitle>
          <CardDescription>Distribution of political party identification</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={partyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0 ? `${name.split("/")[0]}: ${(percent * 100).toFixed(0)}%` : ""
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {partyData.map((entry, index) => (
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
          <CardTitle>Political Ideology Spectrum</CardTitle>
          <CardDescription>Self-reported political ideology</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ideologyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ideology" angle={-45} textAnchor="end" height={100} fontSize={11} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Parental Influence on Party Affiliation</CardTitle>
          <CardDescription>Do students share their parents' political party?</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={influenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#06b6d4" name="Students" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {((sameParty / parentInfluence.length) * 100).toFixed(1)}% of students share their parents' party
              affiliation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
