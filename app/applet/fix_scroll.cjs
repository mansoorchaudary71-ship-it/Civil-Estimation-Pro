const fs = require('fs');
let c = fs.readFileSync('src/components/LandingSections.tsx', 'utf8');

if (!c.includes('useScroll')) {
  c = c.replace('import { motion } from "motion/react";', 'import { motion, useScroll, useTransform } from "motion/react";\nimport { useRef } from "react";');
}

c = c.replace(/const \{ ref, inView \} = useInView\(\{ triggerOnce: true, threshold: 0\.1 \}\);/, `const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "center center"]
  });`);

c = c.replace(/<div className="w-full py-12 md:py-16" ref=\{ref\}>/, `<div className="w-full py-12 md:py-16" ref={(node) => { ref(node); if(containerRef) containerRef.current = node; }}>`);

const svgLineCode = `        {/* Animated Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-[2px] -z-10">
          <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
            <line x1="0" y1="1" x2="100%" y2="1" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="8 8" />
            <motion.line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
        </div>`;

c = c.replace(/\{\/\* Animated Connecting Line \(Desktop\) \*\/\}[\s\S]*?<\/svg>\n\s*<\/div>/, svgLineCode);

fs.writeFileSync('src/components/LandingSections.tsx', c);
