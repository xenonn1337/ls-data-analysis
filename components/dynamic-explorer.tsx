"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Line,
  ComposedChart,
} from "recharts"
import {
  surveyData,
  columnOptions,
  getNewsSourcePrimary,
  getPartySimplified,
  getIdeologyLabel,
  calculateCorrelation,
  calculateMean,
  calculateStdDev,
  convertGPAToNumeric,
  convertGradeLevelToNumeric,
} from "@/lib/survey-data"
import { Activity, TrendingUp, BarChart3 } from "lucide-react"

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
          <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}:{" "}
            <span className="font-bold text-base">
              {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
            </span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DynamicExplorer() {
  const chartColors = useChartColors()
  const CHART_COLORS = [
    chartColors.chart1,
    chartColors.chart2,
    chartColors.chart3,
    chartColors.chart4,
    chartColors.chart5,
    chartColors.chart6,
  ]

  const [xAxis, setXAxis] = useState("PoliticalParty")
  const [yAxis, setYAxis] = useState("PoliticalKnowledge")

  const { chartData, chartType, stats } = useMemo(() => {
    const xIsNumeric = xAxis === "GradeLevel" || xAxis === "GPA"
    const yIsNumeric = yAxis === "GradeLevel" || yAxis === "GPA"
    const yIsBoolean = yAxis === "PoliticalKnowledge"
    const xIsBoolean = xAxis === "PoliticalKnowledge"

    if (xIsNumeric && yIsNumeric) {
      const scatterData = surveyData
        .filter((d) => d[xAxis as keyof typeof d] && d[yAxis as keyof typeof d])
        .map((d) => {
          const xVal =
            xAxis === "GPA" ? convertGPAToNumeric(String(d.GPA)) : convertGradeLevelToNumeric(String(d.GradeLevel))
          const yVal =
            yAxis === "GPA" ? convertGPAToNumeric(String(d.GPA)) : convertGradeLevelToNumeric(String(d.GradeLevel))
          return { x: xVal, y: yVal }
        })
        .filter((d) => d.x > 0 && d.y > 0)

      const xVals = scatterData.map((d) => d.x)
      const yVals = scatterData.map((d) => d.y)
      const correlation = calculateCorrelation(xVals, yVals)

      const xMean = calculateMean(xVals)
      const yMean = calculateMean(yVals)
      const slope =
        xVals.reduce((sum, x, i) => sum + (x - xMean) * (yVals[i] - yMean), 0) /
        xVals.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0)
      const intercept = yMean - slope * xMean

      const regressionData = [
        { x: Math.min(...xVals), y: slope * Math.min(...xVals) + intercept },
        { x: Math.max(...xVals), y: slope * Math.max(...xVals) + intercept },
      ]

      return {
        chartData: { scatter: scatterData, regression: regressionData },
        chartType: "scatter" as const,
        stats: {
          correlation: correlation.toFixed(3),
          xMean: calculateMean(xVals).toFixed(2),
          yMean: calculateMean(yVals).toFixed(2),
          xStdDev: calculateStdDev(xVals).toFixed(2),
          yStdDev: calculateStdDev(yVals).toFixed(2),
          count: scatterData.length,
          rsquared: (correlation * correlation).toFixed(3),
        },
      }
    }

    if (yIsBoolean || xIsBoolean) {
      const isYBoolean = yIsBoolean
      const variableAxis = isYBoolean ? xAxis : yAxis
      const groups: Record<string, { correct: number; total: number }> = {}

      surveyData.forEach((d) => {
        let key = String(d[variableAxis as keyof typeof d])
        if (variableAxis === "NewsSource") key = getNewsSourcePrimary(key)
        if (variableAxis === "PoliticalParty" || variableAxis === "ParentsParty") key = getPartySimplified(key)
        if (variableAxis === "Ideology") key = getIdeologyLabel(key)
        if (variableAxis === "GradeLevel") key = String(d.GradeLevel)
        if (!key || key === "Unknown" || key === "") return

        if (!groups[key]) groups[key] = { correct: 0, total: 0 }
        groups[key].total++
        if (d.PoliticalKnowledge) groups[key].correct++
      })

      const data = Object.entries(groups)
        .map(([name, counts]) => ({
          name,
          percentage: (counts.correct / counts.total) * 100,
          count: counts.total,
          correct: counts.correct,
        }))
        .sort((a, b) => b.percentage - a.percentage)

      const avgPercentage = data.reduce((sum, d) => sum + d.percentage, 0) / data.length
      const totalCorrect = data.reduce((sum, d) => sum + d.correct, 0)
      const totalResponses = data.reduce((sum, d) => sum + d.count, 0)

      return {
        chartData: data,
        chartType: "bar" as const,
        stats: {
          average: `${avgPercentage.toFixed(1)}%`,
          overallRate: `${((totalCorrect / totalResponses) * 100).toFixed(1)}%`,
          categories: data.length,
          count: totalResponses,
          highestCategory: data[0]?.name || "N/A",
          highestRate: `${data[0]?.percentage.toFixed(1)}%` || "N/A",
        },
      }
    }

    if (!xIsNumeric && !yIsNumeric && !xIsBoolean && !yIsBoolean) {
      const groups: Record<string, Record<string, number>> = {}

      surveyData.forEach((d) => {
        let xKey = String(d[xAxis as keyof typeof d])
        let yKey = String(d[yAxis as keyof typeof d])

        if (xAxis === "NewsSource") xKey = getNewsSourcePrimary(xKey)
        if (xAxis === "PoliticalParty" || xAxis === "ParentsParty") xKey = getPartySimplified(xKey)
        if (xAxis === "Ideology") xKey = getIdeologyLabel(xKey)
        if (xAxis === "GradeLevel") xKey = String(d.GradeLevel)

        if (yAxis === "NewsSource") yKey = getNewsSourcePrimary(yKey)
        if (yAxis === "PoliticalParty" || yAxis === "ParentsParty") yKey = getPartySimplified(yKey)
        if (yAxis === "Ideology") yKey = getIdeologyLabel(yKey)
        if (yAxis === "GradeLevel") yKey = String(d.GradeLevel)

        if (!xKey || !yKey || xKey === "Unknown" || yKey === "Unknown") return

        if (!groups[xKey]) groups[xKey] = {}
        groups[xKey][yKey] = (groups[xKey][yKey] || 0) + 1
      })

      const data = Object.entries(groups).map(([name, counts]) => ({
        name,
        ...counts,
      }))

      const totalCount = data.reduce((sum, d) => {
        return (
          sum +
          Object.values(d)
            .filter((v) => typeof v === "number")
            .reduce((s: number, v) => s + (v as number), 0)
        )
      }, 0)

      const categories = new Set<string>()
      data.forEach((d) => {
        Object.keys(d).forEach((k) => {
          if (k !== "name") categories.add(k)
        })
      })

      return {
        chartData: data,
        chartType: "grouped" as const,
        stats: {
          totalResponses: totalCount,
          xCategories: data.length,
          yCategories: categories.size,
          count: totalCount,
        },
      }
    }

    return {
      chartData: [],
      chartType: "grouped" as const,
      stats: {
        totalResponses: 0,
        xCategories: 0,
        yCategories: 0,
        count: 0,
      },
    }
  }, [xAxis, yAxis])

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="text-xs px-4 py-1.5 font-bold tracking-wide">
          INTERACTIVE ANALYSIS
        </Badge>
        <h2 className="text-4xl font-black text-foreground tracking-tight">Dynamic Data Explorer</h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
          Create custom visualizations by selecting variables. Chart types automatically adapt: scatter plots with
          correlation lines for numeric data, bar charts for knowledge rates, and grouped charts for categorical
          comparisons.
        </p>
      </div>

      <Card className="p-8 bg-card border border-border shadow-xl">
        <div className="space-y-6 mb-10">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Variable Selection</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground uppercase tracking-wide">X-Axis Variable</label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger className="bg-input border border-border text-foreground h-12 text-base font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columnOptions.map((col) => (
                    <SelectItem key={col.value} value={col.value} className="text-base">
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground uppercase tracking-wide">Y-Axis Variable</label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger className="bg-input border border-border text-foreground h-12 text-base font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columnOptions.map((col) => (
                    <SelectItem key={col.value} value={col.value} className="text-base">
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-secondary/20 rounded-2xl p-6 border border-border/50">
              <ResponsiveContainer width="100%" height={500}>
                {chartType === "scatter" ? (
                  <ComposedChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={["dataMin - 0.1", "dataMax + 0.1"]}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 600 }}
                      label={{
                        value: columnOptions.find((c) => c.value === xAxis)?.label,
                        position: "insideBottom",
                        offset: -5,
                        fill: "hsl(var(--foreground))",
                        fontWeight: 700,
                      }}
                    />
                    <YAxis
                      dataKey="y"
                      type="number"
                      domain={["dataMin - 0.1", "dataMax + 0.1"]}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 600 }}
                      label={{
                        value: columnOptions.find((c) => c.value === yAxis)?.label,
                        angle: -90,
                        position: "insideLeft",
                        fill: "hsl(var(--foreground))",
                        fontWeight: 700,
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter
                      name="Data Points"
                      data={(chartData as any).scatter}
                      fill={CHART_COLORS[1]}
                      opacity={0.7}
                    />
                    <Line
                      type="linear"
                      dataKey="y"
                      data={(chartData as any).regression}
                      stroke={CHART_COLORS[0]}
                      strokeWidth={3}
                      dot={false}
                      name="Correlation Line"
                    />
                  </ComposedChart>
                ) : chartType === "bar" ? (
                  <BarChart data={chartData as any}>
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
                      label={{
                        value:
                          yAxis === "PoliticalKnowledge" || xAxis === "PoliticalKnowledge" ? "Correct (%)" : "Count",
                        angle: -90,
                        position: "insideLeft",
                        fill: "hsl(var(--foreground))",
                        fontWeight: 700,
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey={
                        yAxis === "PoliticalKnowledge" || xAxis === "PoliticalKnowledge" ? "percentage" : "value"
                      }
                      radius={[8, 8, 0, 0]}
                    >
                      {(chartData as any).map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : chartType === "grouped" ? (
                  <BarChart data={chartData as any}>
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
                      label={{
                        value: "Count",
                        angle: -90,
                        position: "insideLeft",
                        fill: "hsl(var(--foreground))",
                        fontWeight: 700,
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: "hsl(var(--foreground))", fontWeight: 600, paddingTop: "20px" }} />
                    {(chartData as any).length > 0 &&
                      Object.keys((chartData as any)[0])
                        .filter((k: string) => k !== "name")
                        .map((key: string, idx: number) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={CHART_COLORS[idx % CHART_COLORS.length]}
                            radius={[8, 8, 0, 0]}
                          />
                        ))}
                  </BarChart>
                ) : (
                  <div>No chart data available</div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-bold text-foreground">Statistical Analysis</h4>
            </div>

            {chartType === "scatter" && (
              <div className="space-y-4">
                <Card className="p-5 bg-primary/10 border border-primary/30">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Correlation (r)
                  </p>
                  <p className="text-3xl font-black text-primary">{stats.correlation}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.abs(Number.parseFloat(stats.correlation || "0")) > 0.7
                      ? "Strong"
                      : Math.abs(Number.parseFloat(stats.correlation || "0")) > 0.4
                        ? "Moderate"
                        : "Weak"}{" "}
                    relationship
                  </p>
                </Card>
                <Card className="p-5 bg-secondary/30 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">R² Value</p>
                  <p className="text-2xl font-black text-chart-2">{stats.rsquared}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {(Number.parseFloat(stats.rsquared || "0") * 100).toFixed(1)}% variance explained
                  </p>
                </Card>
                <Card className="p-5 bg-secondary/30 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Sample Size (n)
                  </p>
                  <p className="text-2xl font-black text-chart-3">{stats.count}</p>
                </Card>
                <Card className="p-4 bg-secondary/30 border border-border space-y-3">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">X Mean ± SD</p>
                    <p className="text-base font-bold text-foreground">
                      {stats.xMean} ± {stats.xStdDev}
                    </p>
                  </div>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Y Mean ± SD</p>
                    <p className="text-base font-bold text-foreground">
                      {stats.yMean} ± {stats.yStdDev}
                    </p>
                  </div>
                </Card>
              </div>
            )}

            {chartType === "bar" && (
              <div className="space-y-4">
                <Card className="p-5 bg-primary/10 border border-primary/30">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Overall Rate</p>
                  <p className="text-3xl font-black text-primary">{stats.overallRate}</p>
                  <p className="text-xs text-muted-foreground mt-2">Correct identification</p>
                </Card>
                <Card className="p-5 bg-secondary/30 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Mean by Category
                  </p>
                  <p className="text-2xl font-black text-chart-2">{stats.average}</p>
                </Card>
                <Card className="p-5 bg-secondary/30 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Highest Rate</p>
                  <p className="text-xl font-black text-chart-3">{stats.highestRate}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stats.highestCategory}</p>
                </Card>
                <Card className="p-5 bg-secondary/30 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Total Responses
                  </p>
                  <p className="text-2xl font-black text-chart-4">{stats.count}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stats.categories} categories</p>
                </Card>
              </div>
            )}

            {chartType === "grouped" && (
              <div className="space-y-4">
                <Card className="p-5 bg-primary/10 border border-primary/30">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Total Responses
                  </p>
                  <p className="text-3xl font-black text-primary">{stats.count}</p>
                </Card>
                <Card className="p-5 bg-secondary/30 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
                  <p className="text-2xl font-black text-chart-2">{stats.xCategories}</p>
                </Card>
                <Card className="p-5 bg-secondary/30 border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Sub-Categories
                  </p>
                  <p className="text-2xl font-black text-chart-3">{stats.yCategories}</p>
                </Card>
              </div>
            )}

            <Card className="p-4 bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                <BarChart3 className="w-4 h-4 inline mr-1.5" />
                Chart type: {chartType === "scatter" && "Scatter + Correlation"}
                {chartType === "bar" && "Bar Chart"}
                {chartType === "grouped" && "Grouped Bar"}
              </p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  )
}
