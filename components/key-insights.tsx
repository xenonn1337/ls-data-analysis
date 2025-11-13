import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SurveyData } from "./survey-dashboard"
import { CheckCircle2, Users, GraduationCap, TrendingUp } from "lucide-react"

interface KeyInsightsProps {
  data: SurveyData[]
}

export function KeyInsights({ data }: KeyInsightsProps) {
  const totalResponses = data.length
  const correctAnswers = data.filter((d) => d.politicalKnowledge).length
  const knowledgeRate = ((correctAnswers / totalResponses) * 100).toFixed(1)

  const republicans = data.filter((d) => d.party.includes("Republican")).length
  const democrats = data.filter((d) => d.party.includes("Democrat")).length
  const independents = data.filter((d) => d.party.includes("Independent")).length

  const suburban = data.filter((d) => d.home === "Suburban").length
  const urbanRate = ((data.filter((d) => d.home === "Urban").length / totalResponses) * 100).toFixed(1)

  const tiktokUsers = data.filter((d) => d.newsSource.includes("Tiktok") || d.newsSource.includes("Instagram")).length
  const tiktokRate = ((tiktokUsers / totalResponses) * 100).toFixed(1)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Political Knowledge Rate</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{knowledgeRate}%</div>
          <p className="text-xs text-muted-foreground">
            {correctAnswers} of {totalResponses} correctly identified PA senators
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Party Distribution</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R: {republicans} | D: {democrats}
          </div>
          <p className="text-xs text-muted-foreground">{independents} independents</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Location Profile</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{suburban} Suburban</div>
          <p className="text-xs text-muted-foreground">{urbanRate}% from urban areas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Social Media News</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tiktokRate}%</div>
          <p className="text-xs text-muted-foreground">Use TikTok/Instagram for news</p>
        </CardContent>
      </Card>
    </div>
  )
}
