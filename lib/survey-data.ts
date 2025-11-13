// This file parses the real CSV data and makes it available to the app

export interface SurveyResponse {
  GPA: string
  Home: string
  Senators: string
  NewsSource: string
  PoliticalParty: string
  ParentsParty: string
  Ideology: string
  TrustGovernment: string
  TrumpApproval: string
  Environment: string
  ElectionConfidence: string
  MinimumWage: string
  GradeLevel: string
  PoliticalKnowledge: boolean
}

// Parse CSV data - reading from the actual uploaded file
const rawCSV = `GPA,Home,Who are the two senators from Pennsylvania,Primary Source of political news,Political Party,Parents' Party,What best describes your political ideology?,When do you trust the current U.S. government to do what is right?,How do you feel about how Donald Trump is handling his job as a President?,"Do you think the U.S. govt is doing too much, too little, or about the right amount in terms of protecting the environment?",How confident are you in the results of U.S. elections?,Do you feel the federal minimum wage should be,Grade level,Political Knowledge
3.01-3.5,Urban,Josh Shapiro and Madeline Dean,Friends and Family,Democrat,Democrat,Somewhat Liberal,Some of the time,Disapprove,About the right amount,Not confident,Increased,12,FALSE
3.01-3.5,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram,Don't Know/Don't Identify,Don't Know,Somewhat Conservative,Some of the time,Unsure,Unsure/Don't Know,Somewhat confident,Increased,9,FALSE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram,Republican ,Republican,Somewhat Conservative,Most of the time,Approve,About the right amount,Very confident,Increased,12,TRUE
4.01 or above,Urban,Dave McCormick and John Fetterman,Cable TV News,Republican ,Republican,,,,,,,12,TRUE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;,Republican ,Republican;Democrat;,Conservative,Some of the time,Approve,Too little,Very confident,Increased,10,TRUE
4.01 or above,Suburban,Josh Shapiro and Madeline Dean,Friends and Family;Cable TV News;Twitter;Tiktok or Instagram;Online Newspapers;,Independent,Independent;,Moderate,Some of the time,Somewhat Approve,About the right amount,Somewhat confident,Increased,9,FALSE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Cable TV News;,Republican ,Republican;,Conservative,All of the time,Approve,About the right amount,Very confident,Increased,10,TRUE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Friends and Family;Cable TV News;Twitter;Tiktok or Instagram;,Republican ,Republican;,Somewhat Conservative,Some of the time,Somewhat Approve,Unsure/Don't Know,Somewhat confident,Maintained,12,TRUE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Friends and Family;Tiktok or Instagram;,Independent,Republican;,Somewhat Liberal,Most of the time,Somewhat Approve,About the right amount,Very confident,Maintained,10,FALSE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Friends and Family;,Republican ,Republican;,Conservative,Most of the time,Approve,About the right amount,Unsure,Maintained,9,TRUE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram;,Don't Know/Don't Identify,Democrat;,Somewhat Liberal,Most of the time,Disapprove,Too little,Not confident,Increased,12,FALSE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;Friends and Family;,Independent,Republican;Independent;,Moderate,Some of the time,Somewhat Approve,About the right amount,Very confident,Increased,12,TRUE
3.01-3.5,Suburban,Josh Shapiro and Madeline Dean,Cable TV News;,Republican ,Republican;,Conservative,Most of the time,Approve,About the right amount,Very confident,Increased,10,FALSE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;,Republican ,Republican;,Conservative,Most of the time,Approve,About the right amount,Very confident,Increased,12,TRUE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Cable TV News;Tiktok or Instagram;,Democrat,Democrat;,Somewhat Liberal,Most of the time,Disapprove,Too little,Not confident,Increased,10,FALSE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Friends and Family;Tiktok or Instagram;,Don't Know/Don't Identify,Democrat;,Somewhat Liberal,Some of the time,Disapprove,About the right amount,Not confident,Increased,9,FALSE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Cable TV News;Tiktok or Instagram;,Republican ,Republican;,Conservative,Some of the time,Approve,About the right amount,Somewhat confident,Maintained,12,TRUE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Friends and Family;Cable TV News;Tiktok or Instagram;,Don't Know/Don't Identify,Democrat;,Moderate,Most of the time,Somewhat Approve,Too little,Somewhat confident,Maintained,10,FALSE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;,Democrat,Democrat;,Moderate,Most of the time,Disapprove,Too little,Somewhat confident,Increased,12,TRUE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram;,Republican ,Republican;,Conservative,Most of the time,Approve,Too much,Somewhat confident,Increased,9,FALSE
3.01-3.5,Rural,Dave McCormick and John Fetterman,Online Newspapers;,Republican ,Republican;,Somewhat Conservative,Some of the time,Somewhat Approve,About the right amount,Very confident,Increased,12,TRUE
3.01-3.5,Urban,Dave McCormick and John Fetterman,Friends and Family;,Democrat,Democrat;,Moderate,Most of the time,Somewhat Disapprove,Too little,Unsure,Increased,9,TRUE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;,Republican ,Republican;,Somewhat Conservative,Most of the time,Approve,Unsure/Don't Know,Very confident,Don't Know,10,TRUE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;,Don't Know/Don't Identify,Don't Know;,Moderate,Some of the time,Approve,Unsure/Don't Know,Very confident,Increased,9,TRUE
4.01 or above,Suburban,Josh Shapiro and Madeline Dean,Cable TV News;,Republican ,Republican;,Moderate,Most of the time,Somewhat Approve,About the right amount,Somewhat confident,Increased,12,FALSE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;Online Newspapers;,Republican ,Republican;,Somewhat Conservative,Most of the time,Somewhat Approve,Unsure/Don't Know,Somewhat confident,Increased,10,TRUE
3.01-3.5,Rural,Dave McCormick and John Fetterman,Friends and Family;,Don't Know/Don't Identify,Democrat;,Somewhat Liberal,Some of the time,Somewhat Disapprove,Too little,Somewhat confident,Increased,12,TRUE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Cable TV News;Twitter;,Republican ,Don't Know;,Conservative,Most of the time,Approve,About the right amount,Somewhat confident,Increased,9,TRUE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;,Republican ,Republican;,Conservative,Most of the time,Approve,Too little,Somewhat confident,Increased,10,TRUE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Friends and Family;Twitter;Tiktok or Instagram;,Republican ,Republican;,Conservative,Most of the time,Approve,About the right amount,Somewhat confident,Maintained,12,TRUE
3.0 or below,Suburban,,Twitter;Tiktok or Instagram;,Don't Know/Don't Identify,Don't Know;,Moderate,Some of the time,Unsure,Unsure/Don't Know,Unsure,Don't Know,9,FALSE
,Suburban,,Friends and Family;Tiktok or Instagram;,Republican ,Republican;,,Most of the time,Somewhat Approve,Too little,Unsure,Increased,9,FALSE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;,Democrat,Democrat;,Somewhat Liberal,Some of the time,Somewhat Disapprove,Too little,Somewhat confident,Increased,12,TRUE
4.01 or above,Suburban,,,Republican ,Republican;Democrat;,Somewhat Conservative,Most of the time,Somewhat Approve,Too much,Unsure,Increased,10,FALSE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Cable TV News;,Republican ,Republican;,Conservative,Most of the time,Approve,About the right amount,Very confident,Maintained,9,TRUE
3.01-3.5,Suburban,Warren Davidson and Dave Mccormick,Friends and Family;Cable TV News;Tiktok or Instagram;,Republican ,Republican;,Somewhat Conservative,Some of the time,Approve,Too little,Somewhat confident,Increased,10,FALSE
3.01-3.5,Urban,Josh Shapiro and Madeline Dean,Cable TV News;Twitter;Tiktok or Instagram;,Republican ,Republican;,Conservative,Some of the time,Approve,About the right amount,Unsure,Increased,12,FALSE
3.01-3.5,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram;,Don't Know/Don't Identify,Don't Know;,Moderate,Most of the time,Somewhat Disapprove,Too little,Unsure,Increased,9,FALSE
3.51-4.0,Rural,Dave McCormick and John Fetterman,Tiktok or Instagram;,Don't Know/Don't Identify,Don't Know;,Moderate,Some of the time,Unsure,Unsure/Don't Know,Unsure,Increased,9,TRUE
3.0 or below,Urban,Dave McCormick and John Fetterman,Cable TV News;,Independent,Republican;Democrat;,Moderate,Never,Disapprove,Too little,Unsure,Increased,12,TRUE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram;,Don't Know/Don't Identify,Don't Know;,Moderate,Most of the time,Unsure,About the right amount,Unsure,Increased,10,FALSE
3.01-3.5,Rural,Josh Shapiro and Madeline Dean,Tiktok or Instagram;,Democrat,Democrat;,Moderate,Most of the time,Somewhat Approve,About the right amount,Somewhat confident,Increased,9,FALSE
3.0 or below,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram;,Republican ,Republican;,Conservative,Some of the time,Approve,Too little,Very confident,Don't Know,12,TRUE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Friends and Family;Cable TV News;Tiktok or Instagram;,Independent,Democrat;,Moderate,Never,Disapprove,Too little,Not confident,Increased,9,TRUE
3.01-3.5,Suburban,,Cable TV News;Tiktok or Instagram;,Republican ,Republican;,Somewhat Conservative,All of the time,Approve,About the right amount,Very confident,Increased,10,FALSE
4.01 or above,Suburban,Josh Shapiro and Madeline Dean,Friends and Family;Cable TV News;Twitter;Tiktok or Instagram;,Republican ,Republican;,Somewhat Conservative,Most of the time,Somewhat Approve,Too little,Somewhat confident,Increased,12,FALSE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Friends and Family;Tiktok or Instagram;,Republican ,Don't Know;,Conservative,Most of the time,Approve,About the right amount,Very confident,Maintained,9,TRUE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Friends and Family;Cable TV News;,Republican ,Republican;,Somewhat Conservative,Most of the time,Somewhat Approve,Unsure/Don't Know,Somewhat confident,Increased,9,FALSE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Online Newspapers;,Democrat,Democrat;,Liberal,Some of the time,Disapprove,Too little,Somewhat confident,Increased,12,TRUE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Cable TV News;Twitter;Tiktok or Instagram;,Republican ,Republican;,Somewhat Conservative,Most of the time,Somewhat Approve,Unsure/Don't Know,Very confident,Increased,10,TRUE
3.51-4.0,Suburban,Warren Davidson and Dave Mccormick,Cable TV News;,Republican ,Republican;,Conservative,Most of the time,Approve,Unsure/Don't Know,Very confident,Maintained,9,FALSE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Cable TV News;Tiktok or Instagram;,Republican ,Republican;,Conservative,Never,Somewhat Approve,Too much,Somewhat confident,Maintained,12,TRUE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Cable TV News;,Republican ,Republican;Democrat;,Moderate,Most of the time,Disapprove,Unsure/Don't Know,Somewhat confident,Increased,10,TRUE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Cable TV News;Tiktok or Instagram;,Republican ,Republican;,Conservative,Some of the time,Somewhat Approve,Too little,Somewhat confident,Increased,9,TRUE
3.51-4.0,Suburban,Warren Davidson and Dave Mccormick,Friends and Family;Cable TV News;Tiktok or Instagram;,Independent,Republican;Democrat;,Moderate,Some of the time,Disapprove,Too little,Very confident,Increased,12,FALSE
3.01-3.5,Suburban,Warren Davidson and Dave Mccormick,Cable TV News,Republican ,Republican,Somewhat Liberal,Most of the time,Somewhat Approve,Unsure/Don't Know,Somewhat confident,Increased,10,FALSE
3.51-4.0,Urban,Warren Davidson and Dave Mccormick,Friends and Family;Cable TV News;Tiktok or Instagram,Republican ,Republican,Moderate,Most of the time,Approve,About the right amount,Somewhat confident,Increased,9,FALSE
3.0 or below,Suburban,Dave McCormick and John Fetterman,Cable TV News;Tiktok or Instagram,Republican ,Republican,Conservative,Most of the time,Approve,Too little,Very confident,Maintained,9,TRUE
4.01 or above,Suburban,Josh Shapiro and Madeline Dean,Friends and Family;Online Newspapers,Don't Know/Don't Identify,Republican,Liberal,Some of the time,Disapprove,Too little,Very confident,Increased,10,FALSE
3.01-3.5,Suburban,Josh Shapiro and Madeline Dean,Cable TV News,Republican ,Republican,Conservative,Most of the time,Approve,About the right amount,Very confident,Increased,10,FALSE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Friends and Family,Republican ,Republican,,Most of the time,Approve,About the right amount,Somewhat confident,Maintained,9,TRUE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram,Republican ,Republican,Conservative,Most of the time,Approve,About the right amount,Very confident,Increased,10,FALSE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Friends and Family;Cable TV News;Tiktok or Instagram,Don't Know/Don't Identify,Don't Know,Moderate,Some of the time,Disapprove,Too little,Somewhat confident,Increased,9,TRUE
3.51-4.0,Rural,Dave McCormick and John Fetterman,Friends and Family;Tiktok or Instagram,Independent,Independent,Moderate,Most of the time,Unsure,About the right amount,Somewhat confident,Increased,9,TRUE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Cable TV News,Don't Know/Don't Identify,Don't Know,Moderate,Most of the time,Somewhat Approve,Unsure/Don't Know,Somewhat confident,Increased,10,TRUE
3.01-3.5,Suburban,,Online Newspapers,Don't Know/Don't Identify,Don't Know,,Some of the time,Somewhat Approve,Unsure/Don't Know,Unsure,Increased,10,FALSE
4.01 or above,Suburban,Warren Davidson and Dave Mccormick,Tiktok or Instagram,Don't Know/Don't Identify,Don't Know,Moderate,Never,Somewhat Approve,Unsure/Don't Know,Unsure,Increased,10,FALSE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Friends and Family,Democrat,Democrat,Moderate,Some of the time,Disapprove,Too little,Somewhat confident,Increased,10,TRUE
3.0 or below,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram,Republican ,Republican,,Most of the time,Approve,About the right amount,Very confident,Increased,10,FALSE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Friends and Family,Democrat,Democrat;Independent,Liberal,Some of the time,Disapprove,Too little,Not confident,Increased,10,TRUE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Friends and Family,Republican ,Republican,Conservative,Most of the time,Approve,Unsure/Don't Know,Somewhat confident,Increased,11,TRUE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Cable TV News,Republican ,Republican,Moderate,Most of the time,Approve,About the right amount,Somewhat confident,Increased,11,TRUE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Cable TV News,Don't Know/Don't Identify,Don't Know,Moderate,Most of the time,Unsure,Unsure/Don't Know,Somewhat confident,Increased,11,TRUE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram,Don't Know/Don't Identify,Don't Know,Somewhat Conservative,Some of the time,Approve,Unsure/Don't Know,Somewhat confident,Increased,11,TRUE
3.0 or below,Suburban,Dave McCormick and John Fetterman,Friends and Family;Tiktok or Instagram,Don't Know/Don't Identify,Republican;Democrat,Moderate,Some of the time,Disapprove,Too little,Unsure,Increased,11,TRUE
3.01-3.5,Rural,Josh Shapiro and Madeline Dean,Tiktok or Instagram,Democrat,Democrat,Moderate,Never,Disapprove,Too much,Somewhat confident,Increased,11,FALSE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Friends and Family;Tiktok or Instagram,Republican ,Republican,Somewhat Conservative,Some of the time,Somewhat Approve,Too little,Very confident,Maintained,11,TRUE
3.01-3.5,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram,Don't Know/Don't Identify,Republican,Moderate,Most of the time,Somewhat Approve,Too little,Very confident,Increased,11,FALSE
3.51-4.0,Suburban,Josh Shapiro and Madeline Dean,Cable TV News;Tiktok or Instagram,Don't Know/Don't Identify,Republican;Democrat,Moderate,Some of the time,Unsure,About the right amount,Somewhat confident,Increased,11,FALSE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram,Don't Know/Don't Identify,Don't Know,Moderate,Most of the time,Somewhat Disapprove,Unsure/Don't Know,Unsure,Increased,11,TRUE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Friends and Family;Cable TV News,Republican ,Republican;Independent,Conservative,Some of the time,Approve,About the right amount,Very confident,Increased,11,TRUE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Cable TV News,Republican ,Republican,Moderate,Most of the time,Somewhat Approve,Unsure/Don't Know,Somewhat confident,Increased,11,TRUE
3.51-4.0,Urban,Dave McCormick and John Fetterman,Tiktok or Instagram,Don't Know/Don't Identify,Democrat,Moderate,Some of the time,Disapprove,Unsure/Don't Know,Not confident,Increased,11,TRUE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Friends and Family,Don't Know/Don't Identify,Don't Know,Moderate,Most of the time,Unsure,Unsure/Don't Know,Unsure,Increased,11,TRUE
3.01-3.5,Suburban,Dave McCormick and John Fetterman,Cable TV News,Republican ,Republican,Somewhat Conservative,Most of the time,Approve,About the right amount,Somewhat confident,Increased,11,TRUE
3.51-4.0,Suburban,Warren Davidson and Dave Mccormick,Cable TV News,Democrat,Republican,Somewhat Liberal,Most of the time,Disapprove,Too little,Very confident,Increased,11,FALSE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Cable TV News,Republican ,Republican,Conservative,Most of the time,Approve,About the right amount,Somewhat confident,Increased,11,TRUE
3.01-3.5,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram,Don't Know/Don't Identify,Don't Know,Moderate,Some of the time,Unsure,Unsure/Don't Know,Somewhat confident,Increased,11,FALSE
3.01-3.5,Suburban,Josh Shapiro and Madeline Dean,Tiktok or Instagram,Don't Know/Don't Identify,Don't Know,Moderate,Some of the time,Somewhat Disapprove,Too little,Unsure,Increased,11,FALSE
3.51-4.0,Rural,Dave McCormick and John Fetterman,Friends and Family;Cable TV News;Tiktok or Instagram,Don't Know/Don't Identify,Don't Know,Moderate,Some of the time,Unsure,Too little,Unsure,Increased,11,TRUE
3.51-4.0,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram,Republican ,Republican;Democrat,Conservative,Most of the time,Somewhat Approve,Unsure/Don't Know,Somewhat confident,Increased,11,TRUE
4.01 or above,Suburban,Dave McCormick and John Fetterman,Tiktok or Instagram,Don't Know/Don't Identify,Don't Know,Moderate,Some of the time,Unsure,Unsure/Don't Know,Unsure,Increased,11,TRUE`

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())

  return result
}

const lines = rawCSV.split("\n").filter((line) => line.trim())
const headers = parseCSVLine(lines[0])

export const surveyData: SurveyResponse[] = lines.slice(1).map((line) => {
  const values = parseCSVLine(line)
  return {
    GPA: values[0] || "",
    Home: values[1] || "",
    Senators: values[2] || "",
    NewsSource: values[3] || "",
    PoliticalParty: values[4] || "",
    ParentsParty: values[5] || "",
    Ideology: values[6] || "",
    TrustGovernment: values[7] || "",
    TrumpApproval: values[8] || "",
    Environment: values[9] || "",
    ElectionConfidence: values[10] || "",
    MinimumWage: values[11] || "",
    GradeLevel: values[12] || "",
    PoliticalKnowledge: values[13]?.toUpperCase() === "TRUE",
  }
})

// Helper functions for data analysis
export function getNewsSourcePrimary(source: string): string {
  if (!source) return "Unknown"
  if (source.includes("Tiktok") || source.includes("Instagram")) return "TikTok/Instagram"
  if (source.includes("Cable TV")) return "Cable TV News"
  if (source.includes("Friends and Family")) return "Friends & Family"
  if (source.includes("Online Newspapers")) return "Online News"
  if (source.includes("Twitter")) return "Twitter"
  return "Other"
}

export function getPartySimplified(party: string): string {
  if (!party || party === "Don't Know/Don't Identify") return "No Affiliation"
  if (party.includes("Republican")) return "Republican"
  if (party.includes("Democrat")) return "Democrat"
  if (party.includes("Independent")) return "Independent"
  return "Other"
}

export function getIdeologyLabel(ideology: string): string {
  if (!ideology) return "Unknown"
  const lower = ideology.toLowerCase()
  if (lower.includes("liberal")) return ideology.includes("Somewhat") ? "Somewhat Liberal" : "Liberal"
  if (lower.includes("conservative")) return ideology.includes("Somewhat") ? "Somewhat Conservative" : "Conservative"
  if (lower.includes("moderate")) return "Moderate"
  return ideology
}

// Dynamic column list for the explorer
export const columnOptions = [
  { value: "GPA", label: "GPA" },
  { value: "Home", label: "Home Location" },
  { value: "Senators", label: "Senator Knowledge" },
  { value: "NewsSource", label: "News Source" },
  { value: "PoliticalParty", label: "Political Party" },
  { value: "ParentsParty", label: "Parents' Party" },
  { value: "Ideology", label: "Political Ideology" },
  { value: "TrustGovernment", label: "Trust in Government" },
  { value: "TrumpApproval", label: "Trump Approval" },
  { value: "Environment", label: "Environmental Protection" },
  { value: "ElectionConfidence", label: "Election Confidence" },
  { value: "MinimumWage", label: "Minimum Wage Opinion" },
  { value: "GradeLevel", label: "Grade Level" },
  { value: "PoliticalKnowledge", label: "Political Knowledge (Correct)" },
]

export function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  if (n === 0) return 0

  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
}

export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function calculateStdDev(values: number[]): number {
  if (values.length === 0) return 0
  const mean = calculateMean(values)
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  return Math.sqrt(variance)
}

export function convertGPAToNumeric(gpa: string): number {
  if (!gpa) return 0
  if (gpa === "4.01 or above") return 4.2
  if (gpa === "3.51-4.0") return 3.75
  if (gpa === "3.01-3.5") return 3.25
  if (gpa === "3.0 or below") return 2.75
  return 0
}

export function convertGradeLevelToNumeric(grade: string): number {
  const num = Number.parseInt(grade)
  return isNaN(num) ? 0 : num
}
