export const theme = {
  colors: {
    primary: '#E8D5F2',      // Soft lavender
    secondary: '#F5E6D3',    // Warm cream
    accent: '#D4A5D4',       // Muted purple
    success: '#A8D8A8',      // Soft green
    warning: '#F4B183',      // Soft orange (quickening)
    danger: '#E89B9B',       // Soft coral (time to go)
    background: '#FEFDFB',   // Off-white
    text: '#5A5A5A',         // Soft gray
    lightText: '#8B8B8B',    // Light gray
    border: '#E0D5E8'        // Light purple
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  typography: {
    large: { fontSize: 32, fontWeight: 'bold' as const },
    medium: { fontSize: 18, fontWeight: '600' as const },
    regular: { fontSize: 16, fontWeight: '400' as const },
    small: { fontSize: 14, fontWeight: '400' as const },
    tiny: { fontSize: 12, fontWeight: '400' as const }
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 999
  }
};
