// Centralized Design Tokens for UptoSkills Admin Portal
// This file contains all colors, spacing, typography, and shadows to maintain consistency across the platform.

export const designTokens = {
  colors: {
    // Brand Colors
    primary: "#FF6B35", // UptoSkills Orange
    secondary: "#00B5A5", // UptoSkills Teal
    
    // Status Colors
    status: {
      success: "#10b981", // Green
      warning: "#f59e0b", // Amber
      error: "#ef4444",   // Red
      info: "#3b82f6"     // Blue
    },
    
    // Backgrounds & Neutrals
    background: "#0f172a",
    surface: "#1e293b",
    text: {
      primary: "#ffffff",
      secondary: "#94a3b8"
    }
  },
  
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px"
  },
  
  typography: {
    headings: {
      fontSize: "24px",
      fontWeight: "500"
    },
    body: {
      fontSize: "14px",
      fontWeight: "400"
    },
    small: {
      fontSize: "12px",
      fontWeight: "400"
    }
  },
  
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
  }
};

export default designTokens;
