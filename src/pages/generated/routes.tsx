import React from 'react';
import trackerPage from './tracker';
import labourCalculatorPage from './labour-calculator';
import boqPage from './boq';
import retainingWallPage from './retaining-wall';
import mixDesignPage from './mix-design';
import isolatedFootingPage from './isolated-footing';

export const seoRoutes = [
  { path: '/tools/tracker', element: <trackerPage /> },
  { path: '/tools/labour-calculator', element: <labourCalculatorPage /> },
  { path: '/tools/boq', element: <boqPage /> },
  { path: '/tools/retaining-wall', element: <retainingWallPage /> },
  { path: '/tools/mix-design', element: <mixDesignPage /> },
  { path: '/tools/isolated-footing', element: <isolatedFootingPage /> },
];
