"use client";

import { create } from "zustand";

export type Status = "Completed" | "Pending" | "Flagged";

export type Task = {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: Status;
  priority: "High" | "Medium" | "Low";
};

export type RiskIndicator = {
  id: string;
  area: string;
  score: number;
  trend: "up" | "down" | "flat";
};

export type AuditEvent = {
  id: string;
  title: string;
  detail: string;
  date: string;
  status: Status;
};

export type Anomaly = {
  id: string;
  section: string;
  description: string;
  confidence: number;
  insight: string;
  status: Status;
};

export type Agent = {
  id: string;
  name: "Compliance Agent" | "Risk Agent" | "Fraud Detector";
  status: Status;
  lastRun: string;
  summary: string;
  findings: string[];
};

export type Report = {
  id: string;
  name: string;
  period: string;
  generatedAt: string;
  status: Status;
  pages: number;
};

type PanelState = {
  open: boolean;
  title: string;
  description: string;
  details: string[];
};

type AuditStore = {
  tasks: Task[];
  risks: RiskIndicator[];
  timeline: AuditEvent[];
  anomalies: Anomaly[];
  agents: Agent[];
  reports: Report[];
  panel: PanelState;
  openPanel: (panel: Omit<PanelState, "open">) => void;
  closePanel: () => void;
};

const defaultPanel: PanelState = {
  open: false,
  title: "",
  description: "",
  details: [],
};

export const useAuditStore = create<AuditStore>((set) => ({
  tasks: [
    {
      id: "t-1",
      title: "Review revenue recognition exceptions",
      owner: "A. Sharma",
      dueDate: "Mar 25",
      status: "Flagged",
      priority: "High",
    },
    {
      id: "t-2",
      title: "Validate accounts payable sample set",
      owner: "J. Mehra",
      dueDate: "Mar 27",
      status: "Pending",
      priority: "Medium",
    },
    {
      id: "t-3",
      title: "Finalize inventory aging reconciliation",
      owner: "R. Nair",
      dueDate: "Mar 29",
      status: "Completed",
      priority: "Low",
    },
  ],
  risks: [
    { id: "r-1", area: "Revenue", score: 82, trend: "up" },
    { id: "r-2", area: "Procurement", score: 61, trend: "flat" },
    { id: "r-3", area: "Payroll", score: 38, trend: "down" },
  ],
  timeline: [
    {
      id: "e-1",
      title: "Audit Initiated",
      detail: "Scope and materiality thresholds approved",
      date: "Mar 14",
      status: "Completed",
    },
    {
      id: "e-2",
      title: "Data Ingestion",
      detail: "Ledger, invoices, and trial balance uploaded",
      date: "Mar 17",
      status: "Completed",
    },
    {
      id: "e-3",
      title: "Anomaly Review",
      detail: "17 transactions escalated for review",
      date: "Mar 22",
      status: "Flagged",
    },
    {
      id: "e-4",
      title: "Report Draft",
      detail: "Narrative and issue matrix in progress",
      date: "Mar 26",
      status: "Pending",
    },
  ],
  anomalies: [
    {
      id: "a-1",
      section: "Revenue Journal - Q4",
      description: "Unusual round-figure postings after close date",
      confidence: 94,
      insight:
        "Pattern aligns with late manual adjustments in 3 prior quarters.",
      status: "Flagged",
    },
    {
      id: "a-2",
      section: "Vendor Ledger",
      description: "Duplicate invoice references across two suppliers",
      confidence: 87,
      insight: "Potential split invoicing across related entities.",
      status: "Pending",
    },
    {
      id: "a-3",
      section: "Expense Claims",
      description: "Policy-compliant but above peer average in one cost center",
      confidence: 71,
      insight: "Review travel approval chain for exception rationale.",
      status: "Completed",
    },
  ],
  agents: [
    {
      id: "g-1",
      name: "Compliance Agent",
      status: "Completed",
      lastRun: "Today, 09:10",
      summary:
        "Checked statutory disclosures against latest reporting framework.",
      findings: [
        "2 missing note references in related-party disclosures",
        "Schedule III mapping appears complete",
      ],
    },
    {
      id: "g-2",
      name: "Risk Agent",
      status: "Pending",
      lastRun: "Today, 09:18",
      summary: "Re-scoring inherent and control risk after latest samples.",
      findings: [
        "Revenue risk moved from 76 to 82",
        "Procurement risk unchanged at 61",
      ],
    },
    {
      id: "g-3",
      name: "Fraud Detector",
      status: "Flagged",
      lastRun: "Today, 09:32",
      summary: "Detected 5 suspicious posting clusters near quarter close.",
      findings: [
        "3 clusters tied to same approver ID",
        "1 cluster overlaps with dormant vendor account",
      ],
    },
  ],
  reports: [
    {
      id: "rp-1",
      name: "Internal Control Effectiveness",
      period: "FY 2025-26",
      generatedAt: "Mar 24, 10:03",
      status: "Completed",
      pages: 34,
    },
    {
      id: "rp-2",
      name: "High-Risk Transactions Summary",
      period: "Q4",
      generatedAt: "Mar 24, 10:18",
      status: "Pending",
      pages: 18,
    },
    {
      id: "rp-3",
      name: "Regulatory Compliance Readout",
      period: "FY 2025-26",
      generatedAt: "Mar 24, 09:49",
      status: "Completed",
      pages: 22,
    },
  ],
  panel: defaultPanel,
  openPanel: (panel) => set({ panel: { ...panel, open: true } }),
  closePanel: () => set({ panel: defaultPanel }),
}));
