# Political Survey Dashboard

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/xenonn1337s-projects/v0-dataset-analysis)

A modern, interactive data visualization dashboard for analyzing political survey responses from LaSalle College High School students. Built with Next.js 16, React 19, TypeScript, and Recharts, this application provides comprehensive insights into student political opinions, demographics, and knowledge.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Data Structure](#data-structure)
- [Components](#components)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)

## Overview

This dashboard visualizes survey data collected from students in grades 9-12 at LaSalle College High School regarding their political views, news consumption habits, and civic knowledge. The survey was conducted in November 2025 and includes responses on topics such as:

- Political party affiliation and ideology
- Presidential approval ratings
- Trust in government institutions
- Environmental policy opinions
- News source preferences
- Political knowledge assessments
- Election confidence levels
- Minimum wage policy views

## Features

### Key Insights Page

- **Interactive Visualizations**: Pre-built charts highlighting the most important findings from the survey data
- **Political Party Distribution**: Bar chart showing student political affiliations and parental party influence
- **Trump Approval Ratings**: Comprehensive breakdown of student opinions on presidential performance
- **News Source Analysis**: Distribution of primary news sources among students
- **Political Knowledge Assessment**: Accuracy rates on senator identification questions
- **Environmental Policy Views**: Student opinions on government environmental protection efforts

### Dynamic Explorer

- **Custom Data Analysis**: Select any two survey columns to create custom visualizations
- **Multiple Chart Types**:
  - Bar charts for categorical comparisons
  - Scatter plots for correlation analysis
  - Statistical insights (mean, standard deviation, correlation coefficients)
- **Flexible Exploration**: Combine any survey dimensions for personalized analysis
- **Real-time Updates**: Instant chart regeneration based on user selections

### Additional Features

- **Responsive Design**: Fully responsive layout optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Built-in theme switching for comfortable viewing in any environment
- **Data Export**: Download raw CSV data for external analysis
- **Modern UI**: Clean, professional interface using Radix UI components and Tailwind CSS
- **Performance Optimized**: Server-side rendering with Next.js for fast load times

## Technology Stack

### Frontend Framework
- **Next.js 16.0.0** - React framework with App Router
- **React 19.2.0** - UI library with latest concurrent features
- **TypeScript 5** - Type-safe development

### UI Components & Styling
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled component primitives
- **shadcn/ui** - Re-usable component library
- **Lucide React** - Beautiful icon library
- **next-themes** - Theme management

### Data Visualization
- **Recharts** - Composable charting library built on D3
- **Custom chart components** for specialized visualizations

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **PostCSS** - CSS transformation
- **ESLint** - Code linting

## Project Structure

```
ls-data-analysis-/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme provider
│   └── page.tsx                 # Main page component
├── components/                   # React components
│   ├── data-dashboard.tsx       # Main dashboard container
│   ├── dynamic-explorer.tsx     # Custom data exploration tool
│   ├── insights-page.tsx        # Pre-built insights view
│   ├── key-insights.tsx         # Key insights summary cards
│   ├── party-distribution-chart.tsx
│   ├── trump-approval-chart.tsx
│   ├── news-source-chart.tsx
│   ├── political-knowledge-chart.tsx
│   ├── environment-chart.tsx
│   ├── theme-provider.tsx       # Dark mode provider
│   └── ui/                      # shadcn/ui components
│       ├── card.tsx
│       ├── badge.tsx
│       ├── select.tsx
│       └── ...
├── lib/                         # Utility functions
│   ├── survey-data.ts          # Data parsing and analysis utilities
│   └── utils.ts                # General utilities
├── data/                        # Survey data
│   └── survey-data.csv         # Raw survey responses (112 entries)
├── styles/                      # Global styles
│   └── globals.css             # Tailwind directives and custom CSS
├── public/                      # Static assets
│   └── lasalle-logo.png        # School branding
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration
├── components.json             # shadcn/ui configuration
└── README.md                   # This file
```

## Installation

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm/yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ls-data-analysis-
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

   Or with npm:
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

   Or with npm:
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Viewing Key Insights

1. Launch the application
2. The **Key Insights** page loads by default
3. Scroll through the pre-built visualizations:
   - Party distribution charts
   - Trump approval breakdowns
   - News source preferences
   - Political knowledge accuracy
   - Environmental policy opinions
4. Hover over chart elements for detailed tooltips
5. Click the **Download Data** button (top right) to export the raw CSV

### Using the Dynamic Explorer

1. Click **Dynamic Explorer** in the sidebar
2. Select a column for the **X-axis** from the dropdown
3. Select a column for the **Y-axis** from the dropdown
4. The chart automatically updates with:
   - Visual representation (bar chart or scatter plot)
   - Statistical metrics (mean, std dev, correlation)
   - Data insights
5. Experiment with different column combinations to discover patterns

### Toggling Dark Mode

- Click the theme toggle button in the header
- The application automatically saves your preference

## Data Structure

### Survey Response Schema

Each survey response contains the following fields:

```typescript
interface SurveyResponse {
  GPA: string                      // "3.0 or below" | "3.01-3.5" | "3.51-4.0" | "4.01 or above"
  Home: string                     // "Urban" | "Suburban" | "Rural"
  Senators: string                 // Open text response
  NewsSource: string               // Comma-separated sources
  PoliticalParty: string           // "Democrat" | "Republican" | "Independent" | etc.
  ParentsParty: string             // Parent political affiliation(s)
  Ideology: string                 // "Liberal" | "Conservative" | "Moderate" | etc.
  TrustGovernment: string          // "Never" | "Some of the time" | "Most of the time" | "All of the time"
  TrumpApproval: string            // "Approve" | "Disapprove" | "Somewhat Approve" | etc.
  Environment: string              // "Too much" | "Too little" | "About the right amount"
  ElectionConfidence: string       // Confidence level in election results
  MinimumWage: string             // "Increased" | "Maintained" | "Don't Know"
  GradeLevel: string              // "9" | "10" | "11" | "12"
  PoliticalKnowledge: boolean     // TRUE if correctly identified both PA senators
}
```

### Data Analysis Functions

The `lib/survey-data.ts` file provides utility functions:

- `getNewsSourcePrimary(source)` - Categorizes news sources
- `getPartySimplified(party)` - Normalizes party affiliations
- `getIdeologyLabel(ideology)` - Formats ideology labels
- `calculateCorrelation(x, y)` - Computes Pearson correlation
- `calculateMean(values)` - Calculates arithmetic mean
- `calculateStdDev(values)` - Calculates standard deviation
- `convertGPAToNumeric(gpa)` - Converts GPA ranges to numeric values
- `convertGradeLevelToNumeric(grade)` - Converts grade strings to numbers

## Components

### Main Components

**DataDashboard** (`components/data-dashboard.tsx`)
- Root dashboard component
- Manages page navigation and sidebar state
- Handles data download functionality

**InsightsPage** (`components/insights-page.tsx`)
- Displays pre-configured insights
- Renders multiple chart components
- Provides key statistical summaries

**DynamicExplorer** (`components/dynamic-explorer.tsx`)
- Interactive data exploration tool
- Dynamic chart generation based on user selections
- Statistical analysis display

### Chart Components

Individual chart components follow a consistent pattern:
- Accept `data` prop (survey responses)
- Calculate aggregated statistics
- Render using Recharts components
- Provide responsive layouts
- Include tooltips and legends

Examples:
- `PartyDistributionChart`
- `TrumpApprovalChart`
- `NewsSourceChart`
- `PoliticalKnowledgeChart`
- `EnvironmentChart`

## Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Adding New Visualizations

1. **Create a new component** in `components/`:
   ```tsx
   export function MyNewChart({ data }: { data: SurveyResponse[] }) {
     // Process data
     // Render chart
   }
   ```

2. **Import in InsightsPage** or DynamicExplorer:
   ```tsx
   import { MyNewChart } from "./my-new-chart"
   ```

3. **Add to the layout**:
   ```tsx
   <MyNewChart data={surveyData} />
   ```

### Customizing Styles

- Global styles: `styles/globals.css`
- Component styles: Use Tailwind classes
- Theme variables: Defined in `globals.css` with CSS variables
- Dark mode: Automatically handled by `next-themes`

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel auto-detects Next.js configuration

3. **Deploy**
   - Vercel automatically builds and deploys
   - Subsequent pushes trigger automatic deployments

### Environment Variables

No environment variables are required for basic deployment. All data is embedded in the application.

### Build Configuration

The project includes optimized Next.js configuration:
- Image optimization disabled (for static export compatibility)
- TypeScript and ESLint checks relaxed for builds
- Automatic static optimization where possible

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes as part of LaSalle College High School's civic education program.

---

**Dataset Information**
- Survey Period: November 2025
- Total Responses: 112 students
- Grades Surveyed: 9-12
- Institution: LaSalle College High School

**Built with** ❤️ **using Next.js, React, and TypeScript**
