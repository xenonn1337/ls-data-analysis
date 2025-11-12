"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SurveyData } from "./survey-dashboard"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Props {
  data: SurveyData[]
}

export function NewsSourceChart({ data }: Props) {
  const sources = ["Tiktok or Instagram", "Cable TV News", "Friends and Family", "Online Newspapers", "Twitter"]

  const sourceData = sources
    .map((source) => {
      const count = data.filter((d) => d.newsSource.includes(source)).length
      const withKnowledge = data.filter((d) => d.newsSource.includes(source) && d.politicalKnowledge).length
      return {
        source: source.replace(" or ", "/").replace("Tiktok", "TikTok"),
        users: count,
        knowledgeable: withKnowledge,
        rate: count > 0 ? ((withKnowledge / count) * 100).toFixed(1) : "0",
      }
    })
    .sort((a, b) => b.users - a.users)

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Primary News Sources</CardTitle>
          <CardDescription>Where students get their political news</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sourceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="source" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3b82f6" name="Total Users" />
              <Bar dataKey="knowledgeable" fill="#10b981" name="Politically Knowledgeable" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {sourceData.slice(0, 3).map((source) => (
          <Card key={source.source}>
            <CardHeader>
              <CardTitle className="text-base">{source.source}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-2xl font-bold">{source.users}</div>
                  <p className="text-xs text-muted-foreground">Students using this source</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">{source.rate}%</div>
                  <p className="text-xs text-muted-foreground">Knowledge rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
