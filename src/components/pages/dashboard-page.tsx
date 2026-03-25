"use client";

import { useMemo, useState, useRef, useEffect } from "react";

type MetricPoint = {
  period: string;
  revenue: number;
  operatingCash: number;
  flaggedTxns: number;
  trend?: number;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type DepartmentPoint = {
  name: string;
  planned: number;
  actual: number;
  trend?: number;
};

type GraphNode = {
  id: string;
  label: string;
  type: "Company" | "Vendor" | "Director" | "Account" | "Entity";
  x: number;
  y: number;
  risk: "Low" | "Medium" | "High";
  aiScore?: number;
};

type GraphEdge = {
  from: string;
  to: string;
  relation: string;
};

type AIInsight = {
  id: string;
  category: "anomaly" | "recommendation" | "alert" | "opportunity";
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
};

type KPICard = {
  label: string;
  value: string | number;
  status: "positive" | "neutral" | "negative" | "warning";
  trend?: number;
};

type ControlGap = {
  id: string;
  title: string;
  category: "Design" | "Operating" | "Both";
  severity: "Critical" | "High" | "Medium" | "Low";
  process: string;
  remediation: string;
};

type FinanceIndicator = {
  id: string;
  type:
    | "revenue_manipulation"
    | "expense_masking"
    | "asset_inflation"
    | "liability_concealment";
  indicator: string;
  riskScore: number;
  evidence: string;
  status: "flagged" | "investigating" | "cleared";
};

type Inconsistency = {
  id: string;
  title: string;
  category: "Reconciliation" | "Valuation" | "Policy" | "Disclosure";
  impact: "High" | "Medium" | "Low";
  accounts: string[];
  variance: number;
  notes: string;
};

type ExpenseCategory = {
  name: string;
  actual: number;
  budget: number;
  ytd: number;
};

type FilingItem = {
  id: string;
  type: "10-K" | "10-Q" | "8-K" | "Tax-1120" | "Tax-941" | "Form-20-F";
  company: string;
  dueDate: string;
  submitted: boolean;
  completeness: number;
};

type ReportTemplate = {
  id: string;
  name: string;
  sections: string[];
  generatedDate?: string;
  pages: number;
};

const quarterlyData: Record<string, MetricPoint[]> = {
  "FY 2025": [
    { period: "Q1", revenue: 42, operatingCash: 34, flaggedTxns: 12, trend: 5 },
    {
      period: "Q2",
      revenue: 51,
      operatingCash: 40,
      flaggedTxns: 16,
      trend: 12,
    },
    {
      period: "Q3",
      revenue: 58,
      operatingCash: 45,
      flaggedTxns: 11,
      trend: -8,
    },
    {
      period: "Q4",
      revenue: 66,
      operatingCash: 52,
      flaggedTxns: 19,
      trend: 42,
    },
  ],
  "FY 2026": [
    {
      period: "Q1",
      revenue: 55,
      operatingCash: 43,
      flaggedTxns: 9,
      trend: -12,
    },
    { period: "Q2", revenue: 62, operatingCash: 50, flaggedTxns: 13, trend: 8 },
    {
      period: "Q3",
      revenue: 71,
      operatingCash: 57,
      flaggedTxns: 17,
      trend: 24,
    },
    {
      period: "Q4",
      revenue: 78,
      operatingCash: 63,
      flaggedTxns: 14,
      trend: -18,
    },
  ],
};

const departmentVariance: DepartmentPoint[] = [
  { name: "Revenue Ops", planned: 78, actual: 91, trend: 15 },
  { name: "Procurement", planned: 66, actual: 72, trend: 8 },
  { name: "Treasury", planned: 59, actual: 52, trend: -12 },
  { name: "Payroll", planned: 48, actual: 44, trend: -8 },
  { name: "Inventory", planned: 72, actual: 84, trend: 18 },
];

const aiInsights: AIInsight[] = [
  {
    id: "ai1",
    category: "anomaly",
    title: "Suspected Management Override - Transaction Clustering",
    description:
      "ML flagged 47 transactions with non-business hour posting pattern (22:14-22:41) by single approver on 2025-12-15. High indicator of management circumvention of controls.",
    confidence: 0.94,
    actionable: true,
  },
  {
    id: "ai2",
    category: "recommendation",
    title: "Related-Party Due Diligence Control Deficiency",
    description:
      "3 entities added in Q4 lack complete KYC (Know-Your-Customer) documentation. Control design weakness in vendor master validation. Recommend automated KYC verification controls.",
    confidence: 0.88,
    actionable: true,
  },
  {
    id: "ai3",
    category: "alert",
    title: "Material Segregation-of-Duties Exception",
    description:
      "Revenue Cycle process SoD violation detected: single user authorized and recorded AR write-offs. Classified as significant deficiency. Risk Rating: Medium with upward trend.",
    confidence: 0.91,
    actionable: true,
  },
  {
    id: "ai4",
    category: "opportunity",
    title: "Process Efficiency Enhancement - Procurement Cycle",
    description:
      "ML analysis projects 23% reduction in Procurement-to-Pay cycle time through workflow automation. RPA opportunity: requisition-to-invoice matching.",
    confidence: 0.79,
    actionable: true,
  },
];

const controlGaps: ControlGap[] = [
  {
    id: "gap1",
    title: "Lack of Dual Approval for High-Value Transactions",
    category: "Operating",
    severity: "Critical",
    process: "Procurement",
    remediation:
      "Implement mandatory dual approval for transactions >$50K. Target: Q1 2026",
  },
  {
    id: "gap2",
    title: "Incomplete Segregation of Duties",
    category: "Design",
    severity: "High",
    process: "Revenue Cycle",
    remediation:
      "Restructure approval workflows in SAP. Estimated effort: 120 hours",
  },
  {
    id: "gap3",
    title: "Missing System Access Recertification",
    category: "Operating",
    severity: "High",
    process: "Access Management",
    remediation: "Conduct quarterly access reviews. Next review: April 2026",
  },
  {
    id: "gap4",
    title: "Inadequate Vendor Master Data Validation",
    category: "Both",
    severity: "Medium",
    process: "Master Data",
    remediation: "Enhanced validation rules in vendor creation process",
  },
  {
    id: "gap5",
    title: "Missing Expense Reallocation Controls",
    category: "Design",
    severity: "Medium",
    process: "Period Close",
    remediation: "New balance sheet reconciliation template required",
  },
];

const financeIndicators: FinanceIndicator[] = [
  {
    id: "fi1",
    type: "revenue_manipulation",
    indicator: "Round-Tripping with Related Party",
    riskScore: 0.87,
    evidence:
      "2.3M inter-company invoices, minimal business justification, circular cash flow pattern",
    status: "flagged",
  },
  {
    id: "fi2",
    type: "asset_inflation",
    indicator: "Capitalization of Routine Maintenance",
    riskScore: 0.72,
    evidence:
      "PPE additions up 42% YoY. Sample testing shows $1.8M routine repairs capitalized",
    status: "investigating",
  },
  {
    id: "fi3",
    type: "liability_concealment",
    indicator: "Contingent Liability Under-Disclosure",
    riskScore: 0.68,
    evidence:
      "Legal case reserve $300K; actual exposure estimated $2.1M per legal counsel",
    status: "flagged",
  },
  {
    id: "fi4",
    type: "expense_masking",
    indicator: "Channel Stuffing in Q4 Revenue",
    riskScore: 0.81,
    evidence: "Q4 sales 38% of annual; returns processing delayed to Q1 2026",
    status: "investigating",
  },
];

const inconsistencies: Inconsistency[] = [
  {
    id: "inc1",
    title: "Accounts Receivable Aging Discrepancy",
    category: "Reconciliation",
    impact: "High",
    accounts: ["AR Sub-Ledger", "GL Trial Balance"],
    variance: 2340000,
    notes: "2.34M unreconciled difference; 87 invoices missing matching RFQ",
  },
  {
    id: "inc2",
    title: "Inventory Valuation Policy Inconsistency",
    category: "Valuation",
    impact: "High",
    accounts: ["Raw Materials", "Work-in-Process", "Finished Goods"],
    variance: 1560000,
    notes:
      "FIFO applied inconsistently; 12% variance in weighted average cost calculation",
  },
  {
    id: "inc3",
    title: "Depreciation Schedule vs. Fixed Asset Register",
    category: "Policy",
    impact: "Medium",
    accounts: ["Machinery", "Buildings"],
    variance: 890000,
    notes:
      "23 retired assets still in depreciation schedule; useful lives misaligned",
  },
  {
    id: "inc4",
    title: "Revenue Recognition Timing Mismatch",
    category: "Disclosure",
    impact: "High",
    accounts: ["Revenue", "Deferred Revenue", "AR"],
    variance: 4120000,
    notes:
      "FOB shipping point vs. destination discrepancies; $4.1M in Q4/Q1 cutoff exceptions",
  },
  {
    id: "inc5",
    title: "Intercompany Elimination Completeness",
    category: "Reconciliation",
    impact: "Medium",
    accounts: ["Due From Affiliates", "Due To Affiliates"],
    variance: 450000,
    notes:
      "2 reciprocal transactions not eliminated; timing gap in period-end cutoff",
  },
];

const expenseCategories: ExpenseCategory[] = [
  { name: "Cost of Goods Sold", actual: 187420, budget: 165000, ytd: 467980 },
  { name: "Sales & Marketing", actual: 42560, budget: 38000, ytd: 112340 },
  { name: "Research & Development", actual: 28900, budget: 31000, ytd: 89200 },
  {
    name: "General & Administrative",
    actual: 34120,
    budget: 32000,
    ytd: 98560,
  },
  {
    name: "Employee Compensation",
    actual: 156780,
    budget: 142000,
    ytd: 456120,
  },
  { name: "Facilities & Operations", actual: 18950, budget: 16500, ytd: 52340 },
  { name: "Professional Services", actual: 12340, budget: 10000, ytd: 31200 },
  { name: "Technology & IT", actual: 22100, budget: 20000, ytd: 61340 },
];

const filings: FilingItem[] = [
  {
    id: "f1",
    type: "10-K",
    company: "Helios Manufacturing",
    dueDate: "2026-03-15",
    submitted: false,
    completeness: 78,
  },
  {
    id: "f2",
    type: "10-Q",
    company: "Helios Manufacturing",
    dueDate: "2026-02-15",
    submitted: true,
    completeness: 100,
  },
  {
    id: "f3",
    type: "Tax-1120",
    company: "Helios Corp USA",
    dueDate: "2026-04-15",
    submitted: false,
    completeness: 65,
  },
  {
    id: "f4",
    type: "Tax-941",
    company: "Helios Corp USA",
    dueDate: "2026-01-31",
    submitted: true,
    completeness: 100,
  },
  {
    id: "f5",
    type: "Form-20-F",
    company: "Helios Global",
    dueDate: "2026-03-31",
    submitted: false,
    completeness: 52,
  },
];

const reportTemplates: ReportTemplate[] = [
  {
    id: "r1",
    name: "Internal Control Deficiencies Summary",
    sections: [
      "Gap Analysis",
      "Risk Assessment",
      "Remediation Plans",
      "Control Objectives",
    ],
    pages: 12,
    generatedDate: "2026-01-15",
  },
  {
    id: "r2",
    name: "Financial Statement Risk Assessment",
    sections: [
      "Key Audit Matters",
      "Significant Risks",
      "Control Testing Results",
      "Recommendations",
    ],
    pages: 18,
    generatedDate: "2026-01-12",
  },
  {
    id: "r3",
    name: "Fraud Risk Analysis Report",
    sections: [
      "Fraud Triangle Analysis",
      "Indicator Assessment",
      "Red Flag Summary",
      "Management Responses",
    ],
    pages: 14,
  },
  {
    id: "r4",
    name: "Compliance Review Report",
    sections: [
      "Regulatory Overview",
      "Checklist Results",
      "Exception Summary",
      "Corrective Actions",
    ],
    pages: 10,
  },
];

const knowledgeNodes: GraphNode[] = [
  {
    id: "n1",
    label: "Helios Manufacturing",
    type: "Company",
    x: 280,
    y: 190,
    risk: "High",
    aiScore: 0.87,
  },
  {
    id: "n2",
    label: "Nova Raw Materials",
    type: "Vendor",
    x: 120,
    y: 90,
    risk: "High",
    aiScore: 0.92,
  },
  {
    id: "n3",
    label: "Astra Logistics",
    type: "Vendor",
    x: 460,
    y: 95,
    risk: "Medium",
    aiScore: 0.65,
  },
  {
    id: "n4",
    label: "R. Mehta",
    type: "Director",
    x: 120,
    y: 280,
    risk: "Medium",
    aiScore: 0.58,
  },
  {
    id: "n5",
    label: "Revenue Control A17",
    type: "Account",
    x: 455,
    y: 285,
    risk: "Low",
    aiScore: 0.34,
  },
  {
    id: "n6",
    label: "Dormant Entity Kappa",
    type: "Entity",
    x: 285,
    y: 45,
    risk: "High",
    aiScore: 0.94,
  },
];

const knowledgeEdges: GraphEdge[] = [
  { from: "n1", to: "n2", relation: "high-value procurement" },
  { from: "n1", to: "n3", relation: "dispatch routing" },
  { from: "n1", to: "n4", relation: "approval authority" },
  { from: "n1", to: "n5", relation: "control mapping" },
  { from: "n2", to: "n6", relation: "shared GST trail" },
  { from: "n6", to: "n4", relation: "common signatory" },
];

const ragChunks = [
  "Chunk 1: Board minutes (Dec) note emergency vendor onboarding without full due diligence closure.",
  "Chunk 2: Ledger samples show clustered postings between 22:14 and 22:41 tied to the same approver credentials.",
  "Chunk 3: Control testing file indicates delayed segregation-of-duties remediation in Revenue Ops.",
];

function pointColor(risk: GraphNode["risk"]) {
  if (risk === "High") {
    return "#f87171";
  }
  if (risk === "Medium") {
    return "#f59e0b";
  }
  return "#34d399";
}

function getStatusColor(status: string) {
  switch (status) {
    case "positive":
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40";
    case "negative":
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40";
    case "warning":
      return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40";
    default:
      return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40";
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "anomaly":
      return "⚠️";
    case "recommendation":
      return "💡";
    case "alert":
      return "🔴";
    case "opportunity":
      return "⭐";
    default:
      return "📊";
  }
}

function getContextAwareResponse(
  activeTab: string,
  userMessage: string,
): string {
  const lowerMessage = userMessage.toLowerCase();

  // Overview tab responses
  if (activeTab === "overview") {
    if (lowerMessage.includes("revenue") || lowerMessage.includes("trend")) {
      return "Based on FY 2026 data, quarterly revenue shows an upward trajectory, trending from $55M in Q1 to $78M in Q4 YTD. Operating cash flow remains stable at 80-85% of revenue. The 32% increase in flagged transactions in Q4 warrants further investigation for potential period-end anomalies.";
    }
    if (lowerMessage.includes("cash") || lowerMessage.includes("liquidity")) {
      return "Operating cash flow maintains healthy levels at $63M YTD for Q4 2026. The variance between revenue and cash suggests strong receivables collection and working capital management. Monitor quarter-end cash conversion cycles for potential bottlenecks.";
    }
    return "The dashboard shows FY 2026 financial performance with revenue growth of 18% YTD and operating cash flow at 81% of revenue. Transaction flagging has increased 32% YTD, indicating heightened control monitoring. Department variances range from -12% to +18% against budget.";
  }

  // Gaps tab responses
  if (activeTab === "gaps") {
    if (
      lowerMessage.includes("critical") ||
      lowerMessage.includes("immediate")
    ) {
      return "Critical control gap identified: Lack of dual approval for high-value transactions (>$50K) in Procurement. This represents a material weakness in authorization controls. Recommend immediate implementation with target remediation of Q2 2026 to mitigate segregation-of-duties risk.";
    }
    if (lowerMessage.includes("revenue") || lowerMessage.includes("sod")) {
      return "Segregation-of-Duties gaps detected in the Revenue Cycle, particularly in invoice-to-cash processes. Incomplete role separation in the AR function creates override risk. Estimated remediation: 120 hours SAP workflow restructuring, targeting Q2 2026 completion.";
    }
    return "Five material control gaps identified across Procurement, Revenue, and Access Management functions. Gap severity distribution: 1 Critical, 2 High, 2 Medium. Estimated aggregate remediation effort: 220 hours. Highest priority: dual approval controls and SoD exceptions.";
  }

  // Fudging tab responses
  if (activeTab === "fudging") {
    if (
      lowerMessage.includes("revenue") ||
      lowerMessage.includes("manipulation")
    ) {
      return "Round-tripping with related parties flagged at $2.3M with 87% confidence. Intercompany invoicing shows minimal business substance and circular cash flows. Recommend expanded sample testing and management inquiry regarding economic rationale for transactions.";
    }
    if (
      lowerMessage.includes("asset") ||
      lowerMessage.includes("capitalization")
    ) {
      return "PPE capitalization anomaly detected: 42% YoY increase in asset additions. Sample testing revealed $1.8M in routine maintenance capitalized as Property, Plant & Equipment. Non-compliance with IAS 16/ASC 360. Recommend reclassification and enhanced capitalization policies.";
    }
    return "Four key financial statement risk indicators identified with aggregate confidence of 85%: (1) Revenue Manipulation 87%, (2) Channel Stuffing 81%, (3) Asset Inflation 72%, (4) Liability Concealment 68%. Recommend targeted audit procedures for each assertion.";
  }

  // Inconsistencies tab responses
  if (activeTab === "inconsistencies") {
    if (
      lowerMessage.includes("reconciliation") ||
      lowerMessage.includes("ar")
    ) {
      return "Accounts Receivable aging discrepancy of $2.34M identified between subledger and general ledger. Root cause: 87 invoices lack matching sales orders. Recommend comprehensive AR reconciliation and implementation of automated SOX-compliant matching controls.";
    }
    if (
      lowerMessage.includes("inventory") ||
      lowerMessage.includes("valuation")
    ) {
      return "Inventory valuation policy inconsistency across Raw Materials, WIP, and Finished Goods. FIFO methodology applied inconsistently with 12% weighted average cost variance. Recommend standardized valuation methodology and quarterly reconciliation procedures.";
    }
    return "Five material reconciliation exceptions identified with total variance of $9.4M. Primary issues: AR aging ($2.34M), inventory valuation ($1.56M), revenue cutoff ($4.12M). All require management adjustment or disclosure under ASC 250.";
  }

  // Expenses tab responses
  if (activeTab === "expenses") {
    if (lowerMessage.includes("cogs") || lowerMessage.includes("cost")) {
      return "Cost of Goods Sold exceeds budget by 13.6% ($22.4K variance YTD). Current spending at $187K vs. budget of $165K. Recommend variance analysis by production line and cost center. Investigate materials price inflation vs. efficiency variances.";
    }
    if (
      lowerMessage.includes("compensation") ||
      lowerMessage.includes("payroll")
    ) {
      return "Employee Compensation YTD actual of $456K shows 3.2% favorable variance against budget of $456K. Headcount-adjusted rates remain within policy parameters. Monitor Q4 bonus accruals for accuracy and completeness under ASC 710.";
    }
    return "Departmental spending analysis reveals mixed variance profile: COGS +13.6%, Sales & Marketing +12%, and R&D -6.7% favorable. Aggregate expense variance YTD: +4.2%. Recommend drill-down by cost center and detailed variance analysis by line item.";
  }

  // Filings tab responses
  if (activeTab === "filings") {
    if (lowerMessage.includes("10-k") || lowerMessage.includes("annual")) {
      return "Form 10-K filing for Helios Manufacturing is 78% complete with due date of March 15, 2026. Outstanding items: MD&A update, Risk Factors revision, and controls & procedures certification. Recommend parallel finalization track with legal and SEC counsel.";
    }
    if (lowerMessage.includes("tax") || lowerMessage.includes("1120")) {
      return "U.S. Federal Tax Return (Form 1120) is 65% complete with April 15, 2026 deadline. Pending: intercompany transaction documentation, R&D credit substantiation, and depreciation schedule verification. Recommend acceleration to achieve 90% completion by March 31.";
    }
    return "Regulatory filing status: 2 of 5 filings completed (40%). Non-compliance risk on 10-K (78% complete), Form 20-F (52% complete), and Tax 1120 (65% complete). Expedite completion to mitigate regulatory exposure and potential penalties.";
  }

  // Reports tab responses
  if (activeTab === "reports") {
    if (lowerMessage.includes("control") || lowerMessage.includes("internal")) {
      return "Internal Control Deficiencies Summary report (12 pages) was generated on January 15, 2026. Covers: gap analysis of 5 control weaknesses, risk assessment framework application, detailed remediation timelines, and control objective mappings per COSO framework.";
    }
    if (lowerMessage.includes("fraud") || lowerMessage.includes("risk")) {
      return "Fraud Risk Analysis Report documents: fraud triangle assessment (opportunity/pressure/rationalization), red flag inventory with confidence scoring, and management response tracking. Recommend updating with current control environment changes quarterly.";
    }
    return "Four audit reports available in template library. Generated reports include Control Deficiencies (Jan 2026) and Financial Risk Assessment (Jan 2026). Drafts pending: Fraud Analysis and Compliance Review. Generate PDF export for distribution to Audit Committee.";
  }

  // Insights/Graph tab responses
  if (activeTab === "insights" || activeTab === "graph") {
    if (lowerMessage.includes("ai") || lowerMessage.includes("anomaly")) {
      return "Machine learning analysis identified 4 high-confidence anomalies: non-business hours transaction clustering (94%), vendor KYC gaps (88%), SoD exceptions (91%), and process optimization opportunity (79%). Each supports targeted audit procedures and control enhancements.";
    }
    if (
      lowerMessage.includes("relationship") ||
      lowerMessage.includes("entity")
    ) {
      return "Entity relationship mapping reveals 6 critical nodes and 6 direct relationships. High-risk entities: Helios Manufacturing (87% AI score), Nova Raw Materials (92% AI score), and Dormant Entity Kappa (94% AI score). Recommend enhanced related-party transaction testing.";
    }
    return "AI-driven insights surface control gaps in authorization workflows, process efficiency opportunities, and data quality issues. Knowledge graph analysis identifies 6 entities with concentrated risk: 3 high-risk, 2 medium-risk, 1 low-risk. Recommend risk mitigation prioritization.";
  }

  // Default response
  return "I can provide analysis across overview metrics, control gaps, financial risk indicators, reconciliation exceptions, departmental expenses, regulatory filings, and audit reports. Ask me about any section or specific metrics you'd like to explore.";
}

export function DashboardPage() {
  const [fiscalYear, setFiscalYear] = useState<"FY 2025" | "FY 2026">(
    "FY 2026",
  );
  const [chartHoverIndex, setChartHoverIndex] = useState<number | null>(null);
  const [barMode, setBarMode] = useState<"actual" | "variance">("actual");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("n1");
  const [expandedInsight, setExpandedInsight] = useState<string | null>("ai1");
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "insights"
    | "graph"
    | "gaps"
    | "fudging"
    | "inconsistencies"
    | "expenses"
    | "filings"
    | "reports"
  >("overview");
  const [expandedGap, setExpandedGap] = useState<string | null>("gap1");
  const [filterSeverity, setFilterSeverity] = useState<
    "All" | "Critical" | "High" | "Medium" | "Low"
  >("All");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI Audit Intelligence Assistant. I can help you understand the data in any section of this dashboard. Ask me about financial metrics, control gaps, fraud risks, expenses, filings, or reports. What would you like to know?",
      timestamp: new Date(0),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const series = quarterlyData[fiscalYear];

  const linePoints = useMemo(() => {
    const maxRevenue = Math.max(...series.map((d) => d.revenue));
    const maxCash = Math.max(...series.map((d) => d.operatingCash));
    const max = Math.max(maxRevenue, maxCash);

    const width = 620;
    const height = 220;
    const left = 28;
    const right = width - 28;
    const top = 16;
    const bottom = height - 26;

    const toX = (i: number) =>
      left + (i / (series.length - 1)) * (right - left);
    const toY = (value: number) => bottom - (value / max) * (bottom - top);

    const revenue = series.map((point, i) => ({
      x: toX(i),
      y: toY(point.revenue),
      value: point.revenue,
      label: point.period,
    }));
    const cash = series.map((point, i) => ({
      x: toX(i),
      y: toY(point.operatingCash),
      value: point.operatingCash,
      label: point.period,
    }));

    return { revenue, cash, max, width, height, bottom };
  }, [series]);

  const activeIndex = chartHoverIndex ?? series.length - 1;
  const activePoint = series[activeIndex];

  const bars = useMemo(() => {
    return departmentVariance.map((item) => {
      const variance = item.actual - item.planned;
      return {
        ...item,
        variance,
        displayValue: barMode === "actual" ? item.actual : Math.abs(variance),
      };
    });
  }, [barMode]);

  const maxBar = Math.max(...bars.map((b) => b.displayValue));

  const selectedNode =
    knowledgeNodes.find((node) => node.id === selectedNodeId) ??
    knowledgeNodes[0];

  const anomalyCount = aiInsights.filter(
    (i) => i.category === "anomaly",
  ).length;
  const recommendationCount = aiInsights.filter(
    (i) => i.category === "recommendation",
  ).length;

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Simulate AI response with context-aware answer
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getContextAwareResponse(activeTab, chatInput),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 600);

    setChatInput("");
  };

  return (
    <section className="grid gap-4 fade-up sm:gap-5 pb-24">
      {/* Header */}
      <div className="card-glass border-white/10 p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="section-title">AI-Powered Audit Intelligence</p>
            <h2 className="mt-2 text-2xl font-bold text-fg sm:text-3xl">
              Helios Manufacturing: Executive Analytics Cockpit
            </h2>
            <p className="mt-1 text-sm text-fg-subtle">
              Real-time insights · Risk-based prioritization · AI-driven
              recommendations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="grid gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                Period
              </span>
              <select
                value={fiscalYear}
                onChange={(event) =>
                  setFiscalYear(event.target.value as "FY 2025" | "FY 2026")
                }
                className="form-select"
              >
                <option value="FY 2025">FY 2025</option>
                <option value="FY 2026">FY 2026</option>
              </select>
            </label>
            <div className="flex flex-wrap gap-1 self-end">
              {[
                "overview",
                "insights",
                "graph",
                "gaps",
                "fudging",
                "inconsistencies",
                "expenses",
                "filings",
                "reports",
              ].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab as
                        | "overview"
                        | "insights"
                        | "graph"
                        | "gaps"
                        | "fudging"
                        | "inconsistencies"
                        | "expenses"
                        | "filings"
                        | "reports",
                    )
                  }
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold capitalize transition-all duration-200 whitespace-nowrap hover:shadow-md active:scale-95 ${
                    activeTab === tab
                      ? "border-accent bg-accent/20 text-accent shadow-md"
                      : "border-border bg-surface text-fg-subtle hover:border-accent/50 hover:bg-surface"
                  }`}
                >
                  {tab === "overview"
                    ? "Overview"
                    : tab === "insights"
                      ? "AI Insights"
                      : tab === "graph"
                        ? "Knowledge Graph"
                        : tab === "gaps"
                          ? "Control Gaps"
                          : tab === "fudging"
                            ? "Integrity Signals"
                            : tab === "inconsistencies"
                              ? "Reconciliation"
                              : tab === "expenses"
                                ? "Cost Analysis"
                                : tab === "filings"
                                  ? "Regulatory Filings"
                                  : tab === "reports"
                                    ? "Reports"
                                    : tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card-glass border-white/10 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            Latest Revenue
          </p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-bold text-fg">
              ${activePoint.revenue}M
            </p>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${activePoint.trend ? (activePoint.trend > 0 ? "bg-green-500/20 text-green-600 dark:text-green-400" : "bg-red-500/20 text-red-600 dark:text-red-400") : ""}`}
            >
              {activePoint.trend
                ? (activePoint.trend > 0 ? "+" : "") + activePoint.trend + "%"
                : "—"}
            </span>
          </div>
        </div>

        <div className="card-glass border-white/10 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            Cash Flow Assertion
          </p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-bold text-fg">
              ${activePoint.operatingCash}M
            </p>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
              89%
            </span>
          </div>
        </div>

        <div className="card-glass border-white/10 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            Exceptions Logged
          </p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-bold text-flagged">
              {activePoint.flaggedTxns}
            </p>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
              ↑ 32%
            </span>
          </div>
        </div>

        <div className="card-glass border-white/10 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            Control Deviations
          </p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {anomalyCount}
            </p>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
              Identified
            </span>
          </div>
        </div>

        <div className="card-glass border-white/10 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
            Audit Procedures
          </p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {recommendationCount}
            </p>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
              Planned
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      {activeTab === "overview" && (
        <>
          {/* Charts Row */}
          <div className="grid gap-4 sm:gap-5 xl:grid-cols-[1.5fr_1fr]">
            {/* Revenue Trend */}
            <div className="card-glass border-white/10 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <p className="section-title">Revenue & Cash Trend</p>
                  <p className="mt-1 text-sm text-fg-subtle">
                    Trend analysis with AI forecast
                  </p>
                </div>
                <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Trending ↑
                </span>
              </div>

              <svg
                viewBox={`0 0 ${linePoints.width} ${linePoints.height}`}
                className="h-[240px] w-full rounded-lg border border-white/10 bg-white/5"
              >
                <defs>
                  <linearGradient
                    id="revGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--color-accent)"
                      stopOpacity="0.2"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-accent)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="cashGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <line
                  x1="24"
                  y1={linePoints.bottom}
                  x2={linePoints.width - 24}
                  y2={linePoints.bottom}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />

                <polyline
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="3"
                  points={linePoints.revenue
                    .map((p) => `${p.x},${p.y}`)
                    .join(" ")}
                />
                <polyline
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3"
                  points={linePoints.cash.map((p) => `${p.x},${p.y}`).join(" ")}
                />

                {linePoints.revenue.map((point, index) => (
                  <g
                    key={`rev-${point.label}`}
                    onMouseEnter={() => setChartHoverIndex(index)}
                    onMouseLeave={() => setChartHoverIndex(null)}
                  >
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={index === activeIndex ? 6 : 4}
                      fill="var(--color-accent)"
                      className="transition-all"
                    />
                  </g>
                ))}

                {linePoints.cash.map((point, index) => (
                  <g
                    key={`cash-${point.label}`}
                    onMouseEnter={() => setChartHoverIndex(index)}
                    onMouseLeave={() => setChartHoverIndex(null)}
                  >
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={index === activeIndex ? 6 : 4}
                      fill="#34d399"
                      className="transition-all"
                    />
                  </g>
                ))}
              </svg>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
                    Active Quarter
                  </p>
                  <p className="mt-1 font-semibold text-fg">
                    {activePoint.period}
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
                    Revenue
                  </p>
                  <p className="mt-1 font-semibold text-fg">
                    ${activePoint.revenue}M
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
                    Cash
                  </p>
                  <p className="mt-1 font-semibold text-fg">
                    ${activePoint.operatingCash}M
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
                    Flags
                  </p>
                  <p className="mt-1 font-semibold text-flagged">
                    {activePoint.flaggedTxns}
                  </p>
                </div>
              </div>
            </div>

            {/* Department Performance */}
            <div className="card-glass border-white/10 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="section-title">
                  Departmental Performance Summary
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setBarMode("actual")}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                      barMode === "actual"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-white/10 text-fg-subtle hover:border-white/20"
                    }`}
                  >
                    Actual
                  </button>
                  <button
                    type="button"
                    onClick={() => setBarMode("variance")}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                      barMode === "variance"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-white/10 text-fg-subtle hover:border-white/20"
                    }`}
                  >
                    Variance
                  </button>
                </div>
              </div>

              <ul className="space-y-3">
                {bars.map((item) => (
                  <li
                    key={item.name}
                    className="rounded-lg border border-border bg-surface p-3 hover:shadow-md hover:border-accent/40 transition-all duration-200"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-fg">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-accent">
                          {barMode === "actual"
                            ? `${item.actual}%`
                            : `${item.variance > 0 ? "+" : ""}${item.variance}%`}
                        </p>
                        {item.trend && (
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              item.trend > 0
                                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                : "bg-red-500/20 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {item.trend > 0 ? "+" : ""}
                            {item.trend}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.variance >= 0
                            ? "bg-gradient-to-r from-emerald-500 to-green-400"
                            : "bg-gradient-to-r from-amber-500 to-orange-400"
                        }`}
                        style={{
                          width: `${(item.displayValue / maxBar) * 100}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* AI Insights Tab */}
      {activeTab === "insights" && (
        <div className="grid gap-4 sm:gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          {/* AI Insights Panel */}
          <div className="card-glass border-white/10 p-4 sm:p-5">
            <div className="mb-4">
              <p className="section-title">
                AI-Driven Insights & Recommendations
              </p>
              <p className="mt-1 text-sm text-fg-subtle">
                Machine learning analysis of audit data, control gaps, and risk
                indicators
              </p>
            </div>

            <div className="space-y-3">
              {aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  onClick={() =>
                    setExpandedInsight(
                      expandedInsight === insight.id ? null : insight.id,
                    )
                  }
                  className="cursor-pointer"
                >
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition">
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">
                        {getCategoryIcon(insight.category)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-fg">
                              {insight.title}
                            </p>
                            {expandedInsight === insight.id && (
                              <p className="mt-2 text-sm text-fg-subtle">
                                {insight.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-xs font-bold text-accent">
                                {Math.round(insight.confidence * 100)}%
                              </p>
                              <p className="text-[10px] text-fg-subtle">
                                Confidence
                              </p>
                            </div>
                            {insight.actionable && (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-600 dark:text-green-400">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RAG Output */}
          <div className="card-glass border-white/10 p-4 sm:p-5">
            <div className="mb-4">
              <p className="section-title">AI Analysis Context</p>
              <p className="mt-1 text-sm text-fg-subtle">
                Retrieved documents & generated insights
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border-l-4 border-blue-500 bg-blue-500/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                  Analysis Prompt
                </p>
                <p className="mt-1 text-xs text-fg-subtle">
                  Identify high-risk control gaps and vendor relationships that
                  require immediate remediation.
                </p>
              </div>

              <div className="space-y-2">
                {ragChunks.map((chunk, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-white/10 bg-white/5 p-2"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                      {chunk.split(":")[0]}
                    </p>
                    <p className="mt-1 text-xs text-fg-subtle">
                      {chunk.split(":").slice(1).join(":")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border-l-4 border-accent bg-accent/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                  Generated Resolution
                </p>
                <p className="mt-1 text-xs text-fg">
                  Critical gaps identified in emergency vendor onboarding
                  process. SoD exceptions in Revenue Ops require control
                  enhancements. Recommend: Enhanced KYC protocols, dual-approver
                  requirement for high-value vendors, automated SoD monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Graph Tab */}
      {activeTab === "graph" && (
        <div className="grid gap-4 sm:gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="card-glass border-white/10 p-4 sm:p-5">
            <div className="mb-4">
              <p className="section-title">
                Entity Relationship Knowledge Graph
              </p>
              <p className="mt-1 text-sm text-fg-subtle">
                Network analysis with AI risk scoring
              </p>
            </div>

            <svg
              viewBox="0 0 580 360"
              className="h-[320px] w-full rounded-lg border border-white/10 bg-white/5"
            >
              {knowledgeEdges.map((edge) => {
                const from = knowledgeNodes.find((n) => n.id === edge.from);
                const to = knowledgeNodes.find((n) => n.id === edge.to);
                if (!from || !to) {
                  return null;
                }
                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="var(--color-border)"
                      strokeWidth="1.4"
                      opacity="0.5"
                    />
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 4}
                      fontSize="9"
                      fill="var(--color-fg-subtle)"
                      textAnchor="middle"
                    >
                      {edge.relation}
                    </text>
                  </g>
                );
              })}

              {knowledgeNodes.map((node) => (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.id === selectedNodeId ? 32 : 26}
                    fill={pointColor(node.risk)}
                    opacity={node.id === selectedNodeId ? 0.9 : 0.75}
                    className="transition-all"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#0b1220"
                    fontWeight={700}
                  >
                    {node.label.length > 14
                      ? `${node.label.slice(0, 12)}..`
                      : node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="card-glass border-white/10 p-4 sm:p-5 flex flex-col">
            <div className="mb-4">
              <p className="section-title">Entity Intelligence</p>
              <p className="mt-1 text-sm text-fg-subtle">
                AI-scored risk profile
              </p>
            </div>

            <div className="space-y-4 flex-1">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-sm font-bold text-fg">
                  {selectedNode.label}
                </p>
                <p className="mt-1 text-xs text-fg-subtle">
                  {selectedNode.type}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-fg-subtle">
                    Risk Level
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      selectedNode.risk === "High"
                        ? "bg-red-500/20 text-red-600 dark:text-red-400"
                        : selectedNode.risk === "Medium"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-green-500/20 text-green-600 dark:text-green-400"
                    }`}
                  >
                    {selectedNode.risk}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-fg-subtle">
                    AI Risk Score
                  </span>
                  <span className="text-sm font-bold text-accent">
                    {Math.round((selectedNode.aiScore || 0.5) * 100)}%
                  </span>
                </div>

                {selectedNode.aiScore && (
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-blue-400"
                      style={{
                        width: `${selectedNode.aiScore * 100}%`,
                      }}
                    />
                  </div>
                )}

                <div className="rounded-lg border border-white/10 bg-white/5 p-2 mt-3 transition-all duration-200 hover:bg-white/10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                    Connected Entities
                  </p>
                  <p className="mt-1 text-xs text-fg">
                    {
                      knowledgeEdges.filter(
                        (e) =>
                          e.from === selectedNode.id ||
                          e.to === selectedNode.id,
                      ).length
                    }{" "}
                    connections in network
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Gaps Tab */}
      {activeTab === "gaps" && (
        <div className="grid gap-4 sm:gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="card-glass border-white/10 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="section-title">Control Gap Analysis</p>
                <p className="mt-1 text-sm text-fg-subtle">
                  Internal control design and operating ineffectiveness
                </p>
              </div>
              <div className="flex gap-1">
                {["All", "Critical", "High", "Medium", "Low"].map(
                  (severity) => (
                    <button
                      key={severity}
                      type="button"
                      onClick={() =>
                        setFilterSeverity(
                          severity as
                            | "All"
                            | "Critical"
                            | "High"
                            | "Medium"
                            | "Low",
                        )
                      }
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                        filterSeverity === severity
                          ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                          : "border-white/10 text-fg-subtle hover:border-white/20"
                      }`}
                    >
                      {severity}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-3">
              {controlGaps
                .filter(
                  (gap) =>
                    filterSeverity === "All" || gap.severity === filterSeverity,
                )
                .map((gap) => (
                  <div
                    key={gap.id}
                    onClick={() =>
                      setExpandedGap(expandedGap === gap.id ? null : gap.id)
                    }
                    className="cursor-pointer"
                  >
                    <div
                      className={`rounded-lg border p-3 transition ${
                        expandedGap === gap.id
                          ? "border-white/20 bg-white/10"
                          : "border-white/10 bg-white/5 hover:bg-white/8"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            gap.severity === "Critical"
                              ? "bg-red-500/20 text-red-600 dark:text-red-400"
                              : gap.severity === "High"
                                ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                                : gap.severity === "Medium"
                                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                  : "bg-green-500/20 text-green-600 dark:text-green-400"
                          }`}
                        >
                          {gap.severity}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-fg">{gap.title}</p>
                          <p className="mt-0.5 text-xs text-fg-subtle">
                            {gap.process}
                          </p>
                          {expandedGap === gap.id && (
                            <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                              <div>
                                <p className="text-xs font-semibold text-fg-subtle uppercase">
                                  Type
                                </p>
                                <p className="mt-0.5 text-sm text-fg">
                                  {gap.category}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-fg-subtle uppercase">
                                  Remediation
                                </p>
                                <p className="mt-0.5 text-sm text-fg">
                                  {gap.remediation}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="card-glass border-white/10 p-4 sm:p-5 h-fit">
            <p className="section-title">Gap Summary</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-xs font-semibold uppercase text-fg-subtle">
                  Total Gaps
                </p>
                <p className="mt-1 text-3xl font-bold text-fg">
                  {controlGaps.length}
                </p>
              </div>
              {["Critical", "High", "Medium", "Low"].map((sev) => {
                const count = controlGaps.filter(
                  (g) => g.severity === sev,
                ).length;
                const colors = {
                  Critical: "bg-red-500/20 text-red-600 dark:text-red-400",
                  High: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
                  Medium: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
                  Low: "bg-green-500/20 text-green-600 dark:text-green-400",
                };
                return (
                  <div
                    key={sev}
                    className={`rounded-lg ${colors[sev as keyof typeof colors]} p-2`}
                  >
                    <p className="text-xs font-semibold">{sev}</p>
                    <p className="text-lg font-bold">{count}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Finance Fudging Tab */}
      {activeTab === "fudging" && (
        <div className="card-glass border-white/10 p-4 sm:p-5">
          <div className="mb-6">
            <p className="section-title">Finance Fudging Risk Assessment</p>
            <p className="mt-1 text-sm text-fg-subtle">
              AI detection of potential financial statement manipulation and
              anomalies
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[
              "Revenue Inflation",
              "Asset Misstatement",
              "Liability Coverage",
              "Expense Masking",
            ].map((category, i) => {
              const counts = [1, 1, 1, 1];
              return (
                <div
                  key={category}
                  className="rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">
                    {category}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-orange-500">
                    {counts[i]}
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            {financeIndicators.map((indicator) => (
              <div
                key={indicator.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-fg">
                        {indicator.indicator}
                      </p>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          indicator.status === "flagged"
                            ? "bg-red-500/20 text-red-600 dark:text-red-400"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {indicator.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-fg-subtle">
                      {indicator.type.replace(/_/g, " ")}
                    </p>
                    <p className="mt-2 text-sm text-fg">{indicator.evidence}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase text-fg-subtle">
                      Risk Score
                    </p>
                    <p className="mt-1 text-2xl font-bold text-orange-500">
                      {Math.round(indicator.riskScore * 100)}%
                    </p>
                    <div className="mt-2 h-1 w-16 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                        style={{ width: `${indicator.riskScore * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inconsistencies Tab */}
      {activeTab === "inconsistencies" && (
        <div className="card-glass border-white/10 p-4 sm:p-5">
          <div className="mb-6">
            <p className="section-title">
              Financial Inconsistencies & Reconciliation Exceptions
            </p>
            <p className="mt-1 text-sm text-fg-subtle">
              Data quality issues, valuation discrepancies, and cutoff
              exceptions
            </p>
          </div>

          <div className="space-y-3">
            {inconsistencies.map((inc) => (
              <div
                key={inc.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-fg">{inc.title}</p>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          inc.impact === "High"
                            ? "bg-red-500/20 text-red-600 dark:text-red-400"
                            : inc.impact === "Medium"
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                              : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {inc.impact} Impact
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-fg-subtle">
                      {inc.category}
                    </p>
                    <p className="mt-2 text-sm text-fg">{inc.notes}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {inc.accounts.map((acc) => (
                        <span
                          key={acc}
                          className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400"
                        >
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase text-fg-subtle">
                      Variance
                    </p>
                    <p className="mt-1 text-xl font-bold text-orange-500">
                      ${(inc.variance / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses & Costs Tab */}
      {activeTab === "expenses" && (
        <div className="card-glass border-white/10 p-4 sm:p-5">
          <div className="mb-6">
            <p className="section-title">Detailed Cost & Expense Analysis</p>
            <p className="mt-1 text-sm text-fg-subtle">
              Departmental spending, variances, and trend analysis
            </p>
          </div>

          <div className="space-y-4">
            {expenseCategories.map((expense) => {
              const variance = expense.actual - expense.budget;
              const variancePercent = (
                (variance / expense.budget) *
                100
              ).toFixed(1);
              const actualText = expense.actual.toLocaleString("en-US");
              const budgetText = expense.budget.toLocaleString("en-US");
              const ytdText = expense.ytd.toLocaleString("en-US");
              return (
                <div
                  key={expense.name}
                  className="rounded-lg border border-border bg-surface p-4 transition-all duration-200 hover:shadow-lg hover:border-accent/40 transition-all duration-200 hover:shadow-lg hover:bg-white/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-fg">{expense.name}</p>
                      <p className="mt-1 text-xs text-fg-subtle">
                        Budget vs Actual
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-fg">${actualText}</p>
                      <p
                        className={`text-xs font-semibold ${variance > 0 ? "text-orange-500" : "text-green-500"}`}
                      >
                        {variance > 0 ? "+" : ""}
                        {variancePercent}%
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-fg-subtle">
                      <span>Budget: ${budgetText}</span>
                      <span>Actual: ${actualText}</span>
                    </div>
                    <div className="flex gap-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="bg-blue-500"
                        style={{
                          width: `${(expense.budget / (expense.budget + expense.actual)) * 100}%`,
                        }}
                      />
                      <div
                        className={
                          variance > 0 ? "bg-orange-500" : "bg-green-500"
                        }
                        style={{
                          width: `${(expense.actual / (expense.budget + expense.actual)) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-fg-subtle">YTD: ${ytdText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Filings Tab */}
      {activeTab === "filings" && (
        <div className="card-glass border-white/10 p-4 sm:p-5">
          <div className="mb-6">
            <p className="section-title">Regulatory & Form Filings Tracker</p>
            <p className="mt-1 text-sm text-fg-subtle">
              SEC filings, tax returns, and regulatory compliance status
            </p>
          </div>

          <div className="space-y-3">
            {filings.map((filing) => (
              <div
                key={filing.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-fg">{filing.type}</p>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          filing.submitted
                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {filing.submitted ? "✓ Submitted" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-fg-subtle">
                      {filing.company}
                    </p>
                    <p className="mt-1 text-xs text-fg-subtle">
                      Due: {filing.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase text-fg-subtle">
                      Completeness
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-500">
                      {filing.completeness}%
                    </p>
                    <div className="mt-2 h-1.5 w-24 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                        style={{ width: `${filing.completeness}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Generation Tab */}
      {activeTab === "reports" && (
        <div className="card-glass border-white/10 p-4 sm:p-5">
          <div className="mb-6">
            <p className="section-title">Automated Report Generator</p>
            <p className="mt-1 text-sm text-fg-subtle">
              Generate and manage audit reports with AI-powered insights
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_300px]">
            <div className="space-y-3">
              {reportTemplates.map((report) => (
                <div
                  key={report.id}
                  onClick={() =>
                    setSelectedReport(
                      selectedReport === report.id ? null : report.id,
                    )
                  }
                  className="cursor-pointer"
                >
                  <div
                    className={`rounded-lg border p-4 transition ${
                      selectedReport === report.id
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/8"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-fg">{report.name}</p>
                        <p className="mt-1 text-xs text-fg-subtle">
                          {report.pages} pages
                        </p>
                        {report.generatedDate && (
                          <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                            Generated: {report.generatedDate}
                          </p>
                        )}
                        {selectedReport === report.id && (
                          <div className="mt-3 border-t border-white/10 pt-3">
                            <p className="text-xs font-semibold uppercase text-fg-subtle mb-2">
                              Sections
                            </p>
                            <ul className="space-y-1">
                              {report.sections.map((section) => (
                                <li
                                  key={section}
                                  className="text-xs text-fg flex items-center gap-2"
                                >
                                  <span className="text-blue-500">✓</span>{" "}
                                  {section}
                                </li>
                              ))}
                            </ul>
                            <button className="report-btn report-btn-primary mt-3">
                              Download PDF
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {report.generatedDate ? "✓" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-glass border-white/10 p-4 h-fit">
              <p className="section-title">Generate New Report</p>
              <div className="mt-4 space-y-3">
                <button className="report-btn report-btn-primary">
                  + Control Testing Report
                </button>
                <button className="report-btn report-btn-success">
                  + Risk Summary
                </button>
                <button className="report-btn report-btn-warning">
                  + Fraud Analysis
                </button>
                <button className="report-btn report-btn-purple">
                  + Remediation Tracker
                </button>
              </div>

              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] font-bold uppercase text-fg-subtle">
                  Quick Stats
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-fg">
                    Reports:{" "}
                    <span className="font-bold">{reportTemplates.length}</span>
                  </p>
                  <p className="text-sm text-fg">
                    Generated:{" "}
                    <span className="font-bold">
                      {reportTemplates.filter((r) => r.generatedDate).length}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Assistant - Floating Widget */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          data-press
          className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-gradient-to-br from-accent via-blue-500 to-purple-600 shadow-2xl hover:shadow-accent/50 flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Open Audit AI Assistant"
        >
          🤖
        </button>
      )}

      {/* Chat Panel - Opens on tap */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col bg-surface border border-border animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Chat Header */}
          <div className="border-b border-border bg-gradient-to-r from-accent/10 to-purple-500/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="font-bold text-fg">Audit Intelligence AI</p>
                <p className="text-xs text-fg-subtle">
                  Context-aware assistant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="rounded-lg p-2 bg-white/5 hover:bg-white/10 text-fg transition-all duration-200"
              title="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-surface/50">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-fg-subtle">
                  Ask me anything about this audit section...
                </p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-xl px-3 py-2 max-w-xs text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-white shadow-md"
                        : "bg-white/10 text-fg border border-border shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-border bg-surface p-3 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about any section..."
              className="form-input flex-1 text-xs py-2"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className="btn-primary px-3 py-2"
              title="Send message"
            >
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
