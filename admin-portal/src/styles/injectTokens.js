import { designTokens } from './designTokens';

export const injectTokens = () => {
  const root = document.documentElement;

  // Colors
  root.style.setProperty('--color-primary', designTokens.colors.primary);
  root.style.setProperty('--color-secondary', designTokens.colors.secondary);
  
  root.style.setProperty('--color-success', designTokens.colors.status.success);
  root.style.setProperty('--color-warning', designTokens.colors.status.warning);
  root.style.setProperty('--color-error', designTokens.colors.status.error);
  root.style.setProperty('--color-info', designTokens.colors.status.info);
  
  root.style.setProperty('--color-background', designTokens.colors.background);
  root.style.setProperty('--color-surface', designTokens.colors.surface);
  root.style.setProperty('--text-primary', designTokens.colors.text.primary);
  root.style.setProperty('--text-secondary', designTokens.colors.text.secondary);

  // Spacing
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Typography
  Object.entries(designTokens.typography).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value.fontSize);
    root.style.setProperty(`--font-weight-${key}`, value.fontWeight);
  });

  // Shadows
  Object.entries(designTokens.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
};
