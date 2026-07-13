import type { Plan } from '../types';

export interface ChartTheme {
  surface: string;
  grid: string;
  axis: string;
  tick: string;
  ink: string;
  ink2: string;
  accent: string;
  plans: Record<Plan, string>;
}

export const chartThemes: { light: ChartTheme; dark: ChartTheme } = {
  light: {
    surface: '#fcfcfb',
    grid: '#e1e0d9',
    axis: '#c3c2b7',
    tick: '#898781',
    ink: '#0b0b0b',
    ink2: '#52514e',
    accent: '#2a78d6',
    plans: { Starter: '#2a78d6', Growth: '#1baf7a', Scale: '#eda100' },
  },
  dark: {
    surface: '#1a1a19',
    grid: '#2c2c2a',
    axis: '#383835',
    tick: '#898781',
    ink: '#ffffff',
    ink2: '#c3c2b7',
    accent: '#3987e5',
    plans: { Starter: '#3987e5', Growth: '#199e70', Scale: '#c98500' },
  },
};
