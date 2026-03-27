/**
 * AEGIS Global App Store — Zustand
 * Single source of truth for idea, city, sector across ALL pages.
 * Persists to sessionStorage so navigation doesn't lose context.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Active Idea Context ──────────────────────────────────────────────────
      startupIdea: '',            // raw user input
      detectedCity: null,         // e.g., "Mumbai"
      detectedSector: null,       // e.g., "Fintech"
      fundingStage: 'Seed',
      teamSize: 4,

      // ── Full Report (from AdvisorPage analysis) ──────────────────────────────
      activeReport: null,         // full terrain report object

      // ── Dashboard city selector (can be different from detected city) ────────
      dashboardCity: 'Bangalore',

      // ── Settings ─────────────────────────────────────────────────────────────
      darkMode: true,

      // ── Actions ──────────────────────────────────────────────────────────────
      setStartupIdea: (idea) => set({ startupIdea: idea }),
      setDetectedCity: (city) => set({ detectedCity: city }),
      setDetectedSector: (sector) => set({ detectedSector: sector }),
      setFundingStage: (stage) => set({ fundingStage: stage }),
      setTeamSize: (size) => set({ teamSize: size }),
      setActiveReport: (report) => set({ activeReport: report }),
      setDashboardCity: (city) => set({ dashboardCity: city }),

      // Set all detection at once
      setIdeaContext: ({ idea, city, sector, fundingStage, teamSize }) => set({
        startupIdea: idea || get().startupIdea,
        detectedCity: city || get().detectedCity,
        detectedSector: sector || get().detectedSector,
        fundingStage: fundingStage || get().fundingStage,
        teamSize: teamSize || get().teamSize,
      }),

      // Clear everything (new analysis)
      clearReport: () => set({ activeReport: null }),
      clearAll: () => set({
        startupIdea: '', detectedCity: null, detectedSector: null,
        activeReport: null, fundingStage: 'Seed', teamSize: 4,
      }),

      // Helpers
      hasActiveIdea: () => {
        const s = get()
        return s.startupIdea.length > 10 && s.detectedCity && s.detectedSector
      },
      hasActiveReport: () => get().activeReport !== null,
      getEffectiveCity: () => get().detectedCity || get().dashboardCity,
      getEffectiveSector: () => get().detectedSector || 'SaaS',
    }),
    {
      name: 'aegis-store',
      storage: {
        getItem: (key) => {
          try { return JSON.parse(sessionStorage.getItem(key)) } catch { return null }
        },
        setItem: (key, val) => sessionStorage.setItem(key, JSON.stringify(val)),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    }
  )
)
