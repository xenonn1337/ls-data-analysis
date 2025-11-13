"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { surveyData, getNewsSourcePrimary, getPartySimplified, getIdeologyLabel } from "@/lib/survey-data"
import { TrendingUp, Users, Brain, Leaf, BookOpen, Award } from "lucide-react"

function useChartColors() {
  const [colors, setColors] = useState({
    chart1: "#3b82f6",
    chart2: "#10b981",
    chart3: "#f59e0b",
    chart4: "#ef4444",
    chart5: "#8b5cf6",
    chart6: "#06b6d4",
  })

  useEffect(() => {
    // Create a temporary element to resolve CSS colors
    const temp = document.createElement("div")
    temp.style.display = "none"
    document.body.appendChild(temp)

    const resolveColor = (cssVar: string) => {
      temp.style.color = `var(${cssVar})`
      const computed = getComputedStyle(temp).color
      return computed
    }

    setColors({
      chart1: resolveColor("--chart-1"),
      chart2: resolveColor("--chart-2"),
      chart3: resolveColor("--chart-3"),
      chart4: resolveColor("--chart-4"),
      chart5: resolveColor("--chart-5"),
      chart6: resolveColor("--chart-6"),
    })

    document.body.removeChild(temp)
  }, [])

  return colors
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-2 border-primary/40 rounded-xl shadow-2xl p-4">
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}:{" "}
            <span className="font-black text-base">
              {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
            </span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function InsightsPage() {
  const chartColors = useChartColors()
  const CHART_COLORS = [
    chartColors.chart1,
    chartColors.chart2,
    chartColors.chart3,
    chartColors.chart4,
    chartColors.chart5,
    chartColors.chart6,
  ]

  // Chart 1: News Source Distribution
  const newsSourceData = Object.entries(
    surveyData.reduce(
      (acc, d) => {
        const source = getNewsSourcePrimary(d.NewsSource)
        if (source !== "Unknown") {
          acc[source] = (acc[source] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    ),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Chart 2: Political Knowledge by Party
  const knowledgeByParty = Object.entries(
    surveyData.reduce(
      (acc, d) => {
        const party = getPartySimplified(d.PoliticalParty)
        if (party === "No Affiliation" || party === "Other") return acc
        if (!acc[party]) acc[party] = { correct: 0, total: 0 }
        acc[party].total++
        if (d.PoliticalKnowledge) acc[party].correct++
        return acc
      },
      {} as Record<string, { correct: number; total: number }>,
    ),
  )
    .map(([name, counts]) => ({
      name,
      percentage: (counts.correct / counts.total) * 100,
      count: counts.total,
    }))
    .sort((a, b) => b.percentage - a.percentage)

  // Chart 3: Trump Approval by Ideology
  const trumpByIdeology = Object.entries(
    surveyData.reduce(
      (acc, d) => {
        const ideology = getIdeologyLabel(d.Ideology)
        const approval = d.TrumpApproval
        if (ideology === "Unknown" || !approval || approval === "Unsure") return acc

        if (!acc[ideology])
          acc[ideology] = { Approve: 0, Disapprove: 0, "Somewhat Approve": 0, "Somewhat Disapprove": 0 }

        if (approval.includes("Approve")) {
          if (approval.includes("Somewhat")) {
            acc[ideology]["Somewhat Approve"]++
          } else {
            acc[ideology].Approve++
          }
        } else if (approval.includes("Disapprove")) {
          if (approval.includes("Somewhat")) {
            acc[ideology]["Somewhat Disapprove"]++
          } else {
            acc[ideology].Disapprove++
          }
        }
        return acc
      },
      {} as Record<string, Record<string, number>>,
    ),
  ).map(([name, counts]) => ({
    name,
    ...counts,
  }))

  // Chart 4: Parental Influence
  const parentalInfluence = surveyData.reduce(
    (acc, d) => {
      const userParty = getPartySimplified(d.PoliticalParty)
      const parentParty = getPartySimplified(d.ParentsParty)

      if (
        userParty !== "No Affiliation" &&
        parentParty !== "No Affiliation" &&
        userParty !== "Other" &&
        parentParty !== "Other"
      ) {
        const match = userParty === parentParty
        acc[match ? "Same as Parents" : "Different from Parents"]++
      }
      return acc
    },
    { "Same as Parents": 0, "Different from Parents": 0 },
  )

  const parentalData = Object.entries(parentalInfluence).map(([name, value]) => ({ name, value }))

  // Chart 5: Environmental Protection by Home Location
  const environmentByLocation = Object.entries(
    surveyData.reduce(
      (acc, d) => {
        const location = d.Home || "Unknown"
        const opinion = d.Environment
        if (location === "Unknown" || !opinion || opinion.includes("Unsure")) return acc

        if (!acc[location]) acc[location] = { "Too Little": 0, "Too Much": 0, "Right Amount": 0 }

        if (opinion.includes("Too little")) {
          acc[location]["Too Little"]++
        } else if (opinion.includes("Too much")) {
          acc[location]["Too Much"]++
        } else if (opinion.includes("right amount")) {
          acc[location]["Right Amount"]++
        }
        return acc
      },
      {} as Record<string, Record<string, number>>,
    ),
  ).map(([name, counts]) => ({
    name,
    ...counts,
  }))

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Badge variant="secondary" className="text-xs px-4 py-1.5 font-bold tracking-wide">
          COMPREHENSIVE ANALYSIS
        </Badge>
        <h2 className="text-4xl font-black text-foreground tracking-tight">Key Insights & Findings</h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
          In-depth statistical analysis of Pennsylvania student political attitudes, civic knowledge, and media
          consumption patterns from {surveyData.length} survey responses collected in November 2025.
        </p>
      </div>

      {/* Chart 1 */}
      <Card className="p-8 bg-card border border-border shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground mb-2">News Source Distribution</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Primary information channels utilized by surveyed students
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={newsSourceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 600 }}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {newsSourceData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-8 p-6 bg-secondary/20 rounded-2xl border border-border">
          <h4 className="font-black text-lg mb-4 text-foreground flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            Statistical Interpretation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Sample Size</p>
              <p className="text-2xl font-black text-primary">{newsSourceData.reduce((s, d) => s + d.value, 0)}</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Top Source</p>
              <p className="text-xl font-black text-chart-2">{newsSourceData[0]?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {((newsSourceData[0]?.value / newsSourceData.reduce((s, d) => s + d.value, 0)) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Source Diversity</p>
              <p className="text-2xl font-black text-chart-3">{newsSourceData.length}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Key Finding:</strong> Social media platforms, particularly TikTok and
            Instagram, dominate as primary news sources among Pennsylvania students, representing{" "}
            {(
              ((newsSourceData.find((d) => d.name === "TikTok/Instagram")?.value || 0) /
                newsSourceData.reduce((s, d) => s + d.value, 0)) *
              100
            ).toFixed(1)}
            % of respondents. This significant shift toward algorithm-driven content delivery reflects broader
            generational trends in media consumption and raises important questions about information quality, echo
            chambers, and the impact of algorithmic curation on political knowledge formation among young voters.
          </p>
        </div>
      </Card>

      {/* Chart 2 */}
      <Card className="p-8 bg-card border border-border shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-2 to-chart-3 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground mb-2">Political Knowledge by Party Affiliation</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Percentage correctly identifying Pennsylvania's U.S. Senators (Dave McCormick & John Fetterman)
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={knowledgeByParty}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
              label={{
                value: "% Correct",
                angle: -90,
                position: "insideLeft",
                fill: "hsl(var(--foreground))",
                fontWeight: 700,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentage" radius={[8, 8, 0, 0]} fill={CHART_COLORS[0]}>
              {knowledgeByParty.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-8 p-6 bg-secondary/20 rounded-2xl border border-border">
          <h4 className="font-black text-lg mb-4 text-foreground flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            Statistical Interpretation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Overall Rate</p>
              <p className="text-2xl font-black text-primary">
                {(
                  knowledgeByParty.reduce((s, d) => s + d.percentage * d.count, 0) /
                  knowledgeByParty.reduce((s, d) => s + d.count, 0)
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Highest Group</p>
              <p className="text-lg font-black text-chart-2">{knowledgeByParty[0]?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{knowledgeByParty[0]?.percentage.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Sample Size</p>
              <p className="text-2xl font-black text-chart-3">{knowledgeByParty.reduce((s, d) => s + d.count, 0)}</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Range</p>
              <p className="text-xl font-black text-chart-4">
                {(knowledgeByParty[0]?.percentage - knowledgeByParty[knowledgeByParty.length - 1]?.percentage).toFixed(
                  1,
                )}
                pp
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Key Finding:</strong> Civic knowledge levels, measured by correct
            identification of Pennsylvania's U.S. Senators, reveal significant partisan variation.{" "}
            {knowledgeByParty[0]?.name} students demonstrate the highest accuracy rate at{" "}
            {knowledgeByParty[0]?.percentage.toFixed(1)}%, compared to{" "}
            {knowledgeByParty[knowledgeByParty.length - 1]?.percentage.toFixed(1)}% among{" "}
            {knowledgeByParty[knowledgeByParty.length - 1]?.name} students. This{" "}
            {(knowledgeByParty[0]?.percentage - knowledgeByParty[knowledgeByParty.length - 1]?.percentage).toFixed(1)}{" "}
            percentage point gap suggests differential levels of political engagement and news consumption patterns
            across partisan lines.
          </p>
        </div>
      </Card>

      {/* Chart 3 */}
      <Card className="p-8 bg-card border border-border shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-3 to-chart-4 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground mb-2">Presidential Approval by Ideology</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Trump approval ratings across the ideological spectrum
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={trumpByIdeology}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 600 }}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Approve" stackId="a" fill={CHART_COLORS[0]} radius={[0, 0, 0, 0]} name="Approve" />
            <Bar
              dataKey="Somewhat Approve"
              stackId="a"
              fill={CHART_COLORS[1]}
              radius={[0, 0, 0, 0]}
              name="Somewhat Approve"
            />
            <Bar
              dataKey="Somewhat Disapprove"
              stackId="a"
              fill={CHART_COLORS[2]}
              radius={[0, 0, 0, 0]}
              name="Somewhat Disapprove"
            />
            <Bar dataKey="Disapprove" stackId="a" fill={CHART_COLORS[3]} radius={[8, 8, 0, 0]} name="Disapprove" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-8 p-6 bg-secondary/20 rounded-2xl border border-border">
          <h4 className="font-black text-lg mb-4 text-foreground flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            Statistical Interpretation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Total Responses</p>
              <p className="text-2xl font-black text-primary">
                {trumpByIdeology.reduce(
                  (s, d) =>
                    s +
                    (d.Approve || 0) +
                    (d["Somewhat Approve"] || 0) +
                    (d["Somewhat Disapprove"] || 0) +
                    (d.Disapprove || 0),
                  0,
                )}
              </p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Ideologies Measured</p>
              <p className="text-2xl font-black text-chart-2">{trumpByIdeology.length}</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Response Categories</p>
              <p className="text-2xl font-black text-chart-3">4</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Key Finding:</strong> Presidential approval demonstrates pronounced
            ideological polarization, with conservative students expressing overwhelming support (combining "Approve"
            and "Somewhat Approve" responses) while liberal students show strong opposition. The stacked visualization
            reveals nuanced "somewhat" approval ratings in moderate categories, indicating that ideological alignment
            serves as the primary determinant of presidential performance evaluation among politically engaged youth.
          </p>
        </div>
      </Card>

      {/* Chart 4 */}
      <Card className="p-8 bg-card border border-border shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-4 to-chart-5 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground mb-2">Parental Influence on Political Identity</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Alignment between student and parental party affiliation
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={parentalData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {parentalData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-8 p-6 bg-secondary/20 rounded-2xl border border-border">
          <h4 className="font-black text-lg mb-4 text-foreground flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            Statistical Interpretation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Alignment Rate</p>
              <p className="text-2xl font-black text-primary">
                {(
                  (parentalInfluence["Same as Parents"] /
                    (parentalInfluence["Same as Parents"] + parentalInfluence["Different from Parents"])) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Total Analyzed</p>
              <p className="text-2xl font-black text-chart-2">
                {parentalInfluence["Same as Parents"] + parentalInfluence["Different from Parents"]}
              </p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Independent Thinkers</p>
              <p className="text-2xl font-black text-chart-3">{parentalInfluence["Different from Parents"]}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Key Finding:</strong> The{" "}
            {(
              (parentalInfluence["Same as Parents"] /
                (parentalInfluence["Same as Parents"] + parentalInfluence["Different from Parents"])) *
              100
            ).toFixed(1)}
            % alignment rate between student and parental party affiliation demonstrates the profound influence of
            familial socialization on political identity formation. This exceptionally high correlation suggests that
            early-life political exposure within the household creates durable partisan attachments that persist into
            young adulthood, highlighting the enduring impact of primary socialization agents on political development.
          </p>
        </div>
      </Card>

      {/* Chart 5 */}
      <Card className="p-8 bg-card border border-border shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chart-5 to-chart-1 flex items-center justify-center flex-shrink-0">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground mb-2">Environmental Policy by Geographic Location</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Perceptions of government environmental protection by residence type
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={environmentByLocation}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Too Little" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} name="Too Little" />
            <Bar dataKey="Right Amount" fill={CHART_COLORS[1]} radius={[8, 8, 0, 0]} name="Right Amount" />
            <Bar dataKey="Too Much" fill={CHART_COLORS[2]} radius={[8, 8, 0, 0]} name="Too Much" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-8 p-6 bg-secondary/20 rounded-2xl border border-border">
          <h4 className="font-black text-lg mb-4 text-foreground flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            Statistical Interpretation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Total Responses</p>
              <p className="text-2xl font-black text-primary">
                {environmentByLocation.reduce(
                  (s, d) => s + (d["Too Little"] || 0) + (d["Right Amount"] || 0) + (d["Too Much"] || 0),
                  0,
                )}
              </p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Location Types</p>
              <p className="text-2xl font-black text-chart-2">{environmentByLocation.length}</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Opinion Categories</p>
              <p className="text-2xl font-black text-chart-3">3</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Key Finding:</strong> Geographic location demonstrates correlation with
            environmental policy preferences, with urban students showing higher proportions believing the government
            does "too little" for environmental protection compared to suburban and rural counterparts. This spatial
            variation likely reflects differential exposure to environmental challenges (air quality, green space
            access, climate impacts) and competing economic priorities, illustrating the complex interplay between lived
            experience, socioeconomic context, and policy preference formation.
          </p>
        </div>
      </Card>
    </div>
  )
}
