import { MeasurementSystem } from '../context/SettingsContext';

export function getSuggestedUnitByLocale(): MeasurementSystem {
  try {
    const lang = navigator.language || (navigator.languages && navigator.languages[0]);
    if (!lang) return 'SI';
    
    // US, Liberia, Myanmar are the primary countries not using the metric system
    const imperialRegions = ['US', 'LR', 'MM'];
    
    // Check if the locale contains any of the imperial regions (e.g. "en-US")
    for (const region of imperialRegions) {
      if (lang.includes(`-${region}`) || lang.toUpperCase() === region) {
        return 'FPS';
      }
    }
  } catch (e) {
    console.error("Error detecting locale", e);
  }
  
  // Default to Metric (SI) for the rest of the world
  return 'SI';
}
