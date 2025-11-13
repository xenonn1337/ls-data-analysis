"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SurveyData } from "./survey-dashboard"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Props {
  data: SurveyData[]
}

export function TrumpApprovalChart({ data }: Props) {
  const opinions = ["Approve", "Somewhat Approve", "Unsure", "Somewhat Disapprove", "Disapprove"]

  const opinionData = opinions
    .map((opinion) => {
      const total = data.filter((d) => d.trumpOpinion.includes(opinion)).length
      return {
        opinion,
        count: total,
      }
    })
    .filter((d) => d.count > 0)

  // By party
  const parties = ["Republican", "Democrat", "Independent"]
  const partyOpinionData = parties.map((party) => {
    const partyData = data.filter((d) => d.party.includes(party))
    const approve = partyData.filter(
      (d) => d.trumpOpinion.includes("Approve") && !d.trumpOpinion.includes("Disapprove"),
    ).length
    const disapprove = partyData.filter((d) => d.trumpOpinion.includes("Disapprove")).length
    const unsure = partyData.filter((d) => d.trumpOpinion.includes("Unsure")).length

    return {
      party,
      Approve: approve,
      Disapprove: disapprove,
      Unsure: unsure,
    }
  })

  // Election confidence
  const confidence = ["Very confident", "Somewhat confident", "Not confident", "Unsure"]
  const confidenceData = confidence
    .map((level) => ({
      level: level.replace("confident", "conf."),
      count: data.filter((d) => d.electionConfidence.includes(level)).length,
    }))
    .filter((d) => d.count > 0)

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trump Job Approval</CardTitle>
            <CardDescription>Overall student opinion on Trump's presidency</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={opinionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="opinion" angle={-45} textAnchor="end" height={100} fontSize={11} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Confidence in U.S. Elections</CardTitle>
            <CardDescription>Trust in election results</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trump Approval by Party Affiliation</CardTitle>
          <CardDescription>How different political parties view Trump's job performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={partyOpinionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="party" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Approve" fill="#10b981" />
              <Bar dataKey="Unsure" fill="#94a3b8" />
              <Bar dataKey="Disapprove" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
