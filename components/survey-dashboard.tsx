"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PoliticalKnowledgeChart } from "./political-knowledge-chart"
import { NewsSourceChart } from "./news-source-chart"
import { PartyDistributionChart } from "./party-distribution-chart"
import { TrumpApprovalChart } from "./trump-approval-chart"
import { EnvironmentChart } from "./environment-chart"
import { KeyInsights } from "./key-insights"

export interface SurveyData {
  gpa: string
  home: string
  senators: string
  newsSource: string
  party: string
  parentsParty: string
  ideology: string
  trustGov: string
  trumpOpinion: string
  environment: string
  electionConfidence: string
  minimumWage: string
  gradeLevel: string
  politicalKnowledge: boolean
}

export function SurveyDashboard() {
  const [data, setData] = useState<SurveyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/data/survey-data.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.split("\n")
        const headers = lines[0].split(",")

        const parsed = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => {
            const values = line.split(",")
            return {
              gpa: values[0] || "",
              home: values[1] || "",
              senators: values[2] || "",
              newsSource: values[3] || "",
              party: values[4] || "",
              parentsParty: values[5] || "",
              ideology: values[6] || "",
              trustGov: values[7] || "",
              trumpOpinion: values[8] || "",
              environment: values[9] || "",
              electionConfidence: values[10] || "",
              minimumWage: values[11] || "",
              gradeLevel: values[12] || "",
              politicalKnowledge: values[13]?.trim().toUpperCase() === "TRUE",
            }
          })

        setData(parsed)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading survey data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Pennsylvania Student Political Survey Analysis</h1>
        <p className="text-muted-foreground text-lg">
          Analyzing {data.length} student responses on political knowledge, attitudes, and media consumption
        </p>
      </div>

      <KeyInsights data={data} />

      <Tabs defaultValue="knowledge" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="knowledge">Political Knowledge</TabsTrigger>
          <TabsTrigger value="party">Party Affiliation</TabsTrigger>
          <TabsTrigger value="news">News Sources</TabsTrigger>
          <TabsTrigger value="trump">Trump Approval</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="space-y-4">
          <PoliticalKnowledgeChart data={data} />
        </TabsContent>

        <TabsContent value="party" className="space-y-4">
          <PartyDistributionChart data={data} />
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <NewsSourceChart data={data} />
        </TabsContent>

        <TabsContent value="trump" className="space-y-4">
          <TrumpApprovalChart data={data} />
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <EnvironmentChart data={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
