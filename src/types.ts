export interface Deal {
  id: string;
  title: string;
  client: string;
  repId: string;
  repName: string;
  amount: number;
  stage: 'discovery' | 'qualification' | 'demo' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number; // 0-100%
  expectedCloseDate: string;
  closedDate?: string;
  region: 'North America' | 'Europe' | 'APAC' | 'LATAM';
  segment: 'Enterprise' | 'Mid-Market' | 'SMB';
  product: 'Core Platform' | 'Enterprise Suite' | 'Add-on Modules' | 'Managed Services';
}

export interface SalesRep {
  id: string;
  name: string;
  role: string;
  avatar: string;
  team: 'Enterprise' | 'Mid-Market' | 'SMB';
  region: string;
  quota: number; // monthly quota
  revenueClosed: number; // current month
  dealsWonCount: number;
  dealsLostCount: number;
  totalPipelineValue: number;
  winRate: number; // percentage
  avgDealSize: number;
  avgSalesCycleDays: number;
  activities: {
    callsCount: number;
    callsTarget: number;
    demosHeld: number;
    demosTarget: number;
    proposalsSent: number;
    proposalsTarget: number;
  };
  quarterlyHistory: {
    quarter: string;
    target: number;
    achieved: number;
  }[];
}

export interface MonthlyRevenueRecord {
  month: string;
  monthShort: string;
  year: number;
  actualRevenue: number;
  targetRevenue: number;
  newBusinessRevenue: number;
  expansionRevenue: number;
  churnAmount: number;
  dealsClosed: number;
  avgDealSize: number;
  isCurrent?: boolean;
}

export interface ForecastMonth {
  month: string;
  monthShort: string;
  year: number;
  expectedRevenue: number;
  conservativeRevenue: number;
  optimisticRevenue: number;
  targetRevenue: number;
  weightedPipeline: number;
  confidenceScore: number; // 0-100%
}

export interface ForecastControls {
  scenario: 'conservative' | 'baseline' | 'optimistic';
  growthRatePct: number; // monthly growth increment e.g. +3%
  churnRatePct: number; // e.g. 1.8%
  winRateAdjustmentPct: number; // e.g. +0% to +15%
  pipelineVelocityDays: number; // e.g. 42 days
}

export interface ReportFilterConfig {
  dateRange: 'this_month' | 'last_month' | 'this_quarter' | 'ytd' | 'last_12_months' | 'custom';
  segment: string; // 'all' or specific
  region: string; // 'all' or specific
  team: string; // 'all' or specific
  selectedMetrics: string[];
}
