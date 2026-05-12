import React from 'react';

type SVGShapeVisualizerProps = {
  shape: string;
  dimensions: Record<string, number>;
};

export const SVGShapeVisualizer: React.FC<SVGShapeVisualizerProps> = ({ shape, dimensions }) => {
  const containerSize = 250;
  const cx = containerSize / 2;
  const cy = containerSize / 2;
  
  const generateShapePath = () => {
    switch (shape) {
      case 'Trapezoid': {
        const { base1 = 0, base2 = 0, height = 0 } = dimensions;
        if (base1 === 0 || base2 === 0 || height === 0) return null;
        
        // Scale dimensions to fit box
        const maxW = Math.max(base1, base2);
        const maxH = height;
        const scale = (containerSize * 0.8) / Math.max(maxW, maxH);
        
        const scaledBase1 = base1 * scale;
        const scaledBase2 = base2 * scale;
        const scaledHeight = height * scale;
        
        // Center trapezoid
        // Assuming isosceles for visualization if sides not provided
        const yTop = cy - scaledHeight / 2;
        const yBot = cy + scaledHeight / 2;
        
        const xTL = cx - scaledBase2 / 2;
        const xTR = cx + scaledBase2 / 2;
        
        const xBL = cx - scaledBase1 / 2;
        const xBR = cx + scaledBase1 / 2;
        
        return (
          <path 
            d={`M ${xBL} ${yBot} L ${xBR} ${yBot} L ${xTR} ${yTop} L ${xTL} ${yTop} Z`}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        );
      }
      case 'Trapezoidal Dumper': {
        const { topWidth = 0, bottomWidth = 0, depth = 0 } = dimensions;
        if (topWidth === 0 || bottomWidth === 0 || depth === 0) return null;
        
        const scale = (containerSize * 0.8) / Math.max(topWidth, depth);
        
        const sTW = topWidth * scale;
        const sBW = bottomWidth * scale;
        const sD = depth * scale;
        
        const yTop = cy - sD / 2;
        const yBot = cy + sD / 2;
        
        const xTL = cx - sTW / 2;
        const xTR = cx + sTW / 2;
        const xBL = cx - sBW / 2;
        const xBR = cx + sBW / 2;

        return (
          <g>
            <path 
              d={`M ${xBL} ${yBot} L ${xBR} ${yBot} L ${xTR} ${yTop} L ${xTL} ${yTop} Z`}
              fill="rgba(59, 130, 246, 0.2)"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            {/* Optional 3D lines */}
            <path d={`M ${xTR} ${yTop} L ${xTR + 20} ${yTop - 20} L ${xBR + 20} ${yBot - 20} L ${xBR} ${yBot}`} fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="1" />
            <path d={`M ${xTL} ${yTop} L ${xTL + 20} ${yTop - 20} L ${xTR + 20} ${yTop - 20} L ${xTR} ${yTop}`} fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth="1" />
          </g>
        );
      }
      case 'Cylinder': {
        const { radius = 0, height = 0 } = dimensions;
        if (radius === 0 || height === 0) return null;
        
        const scale = (containerSize * 0.7) / Math.max(radius * 2, height);
        const sR = radius * scale;
        const sH = height * scale;
        
        const ellipseHeight = sR * 0.3; // Perspective
        
        return (
          <g>
            <path 
              d={`M ${cx - sR} ${cy - sH/2} L ${cx - sR} ${cy + sH/2} A ${sR} ${ellipseHeight} 0 0 0 ${cx + sR} ${cy + sH/2} L ${cx + sR} ${cy - sH/2}`}
              fill="rgba(16, 185, 129, 0.2)"
              stroke="#10b981"
              strokeWidth="2"
            />
            <ellipse cx={cx} cy={cy - sH/2} rx={sR} ry={ellipseHeight} fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="2" />
          </g>
        );
      }
      case 'Rectangle Tank': {
        const { length = 0, width = 0, height = 0 } = dimensions;
        if (length === 0 || width === 0 || height === 0) return null;
        
        // Draw as 3D box
        const scale = (containerSize * 0.5) / Math.max(length, width, height);
        const sL = length * scale;
        const sW = width * scale * 0.5; // perspective depth
        const sH = height * scale;
        
        const xOffset = sW * 0.7;
        const yOffset = sW * 0.5;
        
        const frontTopLeft = { x: cx - sL / 2 - xOffset/2, y: cy - sH / 2 + yOffset/2 };
        const frontTopRight = { x: frontTopLeft.x + sL, y: frontTopLeft.y };
        const frontBotLeft = { x: frontTopLeft.x, y: frontTopLeft.y + sH };
        const frontBotRight = { x: frontTopRight.x, y: frontTopRight.y + sH };
        
        const backTopLeft = { x: frontTopLeft.x + xOffset, y: frontTopLeft.y - yOffset };
        const backTopRight = { x: backTopLeft.x + sL, y: backTopLeft.y };
        const backBotRight = { x: backTopRight.x, y: backTopRight.y + sH };
        
        return (
          <g>
            {/* Back lines (dashed) */}
            <path d={`M ${frontBotLeft.x} ${frontBotLeft.y} L ${frontBotLeft.x + xOffset} ${frontBotLeft.y - yOffset} L ${backBotRight.x} ${backBotRight.y}`} fill="none" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
            <path d={`M ${frontBotLeft.x + xOffset} ${frontBotLeft.y - yOffset} L ${backTopLeft.x} ${backTopLeft.y}`} fill="none" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
            
            {/* Faces */}
            <path d={`M ${backTopLeft.x} ${backTopLeft.y} L ${backTopRight.x} ${backTopRight.y} L ${frontTopRight.x} ${frontTopRight.y} L ${frontTopLeft.x} ${frontTopLeft.y} Z`} fill="rgba(45, 212, 191, 0.4)" stroke="#2dd4bf" strokeWidth="2" />
            <path d={`M ${frontTopRight.x} ${frontTopRight.y} L ${backTopRight.x} ${backTopRight.y} L ${backBotRight.x} ${backBotRight.y} L ${frontBotRight.x} ${frontBotRight.y} Z`} fill="rgba(45, 212, 191, 0.2)" stroke="#2dd4bf" strokeWidth="2" />
            <path d={`M ${frontTopLeft.x} ${frontTopLeft.y} L ${frontTopRight.x} ${frontTopRight.y} L ${frontBotRight.x} ${frontBotRight.y} L ${frontBotLeft.x} ${frontBotLeft.y} Z`} fill="rgba(45, 212, 191, 0.3)" stroke="#2dd4bf" strokeWidth="2" />
          </g>
        );
      }
      default:
        return null;
    }
  };

  const svgContent = generateShapePath();
  
  if (!svgContent) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/5 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 w-full mb-6">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Dynamic Preview</h4>
      <svg width="100%" height={containerSize} viewBox={`0 0 ${containerSize} ${containerSize}`}>
        {svgContent}
      </svg>
    </div>
  );
};
