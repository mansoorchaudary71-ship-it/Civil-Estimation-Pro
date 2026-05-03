import React from 'react';

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="logo-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      
      {/* Building Base / Columns */}
      <path d="M20 85 L20 45 L35 45 L35 85 Z" fill="url(#logo-primary)" opacity="0.8" />
      <path d="M42.5 85 L42.5 30 L57.5 30 L57.5 85 Z" fill="url(#logo-primary)" />
      <path d="M65 85 L65 55 L80 55 L80 85 Z" fill="url(#logo-primary)" opacity="0.6" />
      
      {/* Roof / Foundation */}
      <path d="M 15 90 L 85 90 L 85 85 L 15 85 Z" fill="url(#logo-primary)" opacity="0.9" />
      
      {/* Estimator Line Graph / Scale moving upwards */}
      <path 
        d="M 10 70 L 30 40 L 50 50 L 85 15" 
        stroke="url(#logo-accent)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
        style={{ filter: "drop-shadow(0px 3px 5px rgba(249, 115, 22, 0.4))" }}
      />
      <circle cx="85" cy="15" r="6" fill="url(#logo-accent)" />
    </svg>
  );
}
