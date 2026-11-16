export interface AnalyticsReport {
  total: number
  statuses: Record<string, number>
  resolved: number
  slaMeasured: number
  slaPercent: number | null
  averageResolutionMinutes: number | null
  agents: { id: string; name: string; count: number }[]
}
