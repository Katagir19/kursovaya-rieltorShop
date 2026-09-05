export const theme = {
  colors: {
    ink: '#1C2430', 
    inkSoft: '#8D96A6', 
    paper: '#F1EFE8', 
    surface: '#FBFAF6', 
    textPrimary: '#1C2430',
    textSecondary: '#6B7280',
    accent: '#B08A3E', 
    accentSoft: 'rgba(176, 138, 62, 0.12)',
    hairline: '#DEDACD', 
    hairlineDark: '#313B49', 
    statusGood: '#3F7D58', 
    statusWarn: '#B08A3E', 
    statusBad: '#B14A3C', 
  },
  font: {
    sans: `'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
    mono: `'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace`,
  },
  radius: {
    sm: '4px',
    md: '6px',
  },
  layout: {
    sidebarWidth: '260px',
    headerHeight: '64px',
  },
} as const;

export type Theme = typeof theme;
