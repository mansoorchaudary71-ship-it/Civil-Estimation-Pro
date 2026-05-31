const fs = require('fs');
let c = fs.readFileSync('src/components/ToolCard.tsx', 'utf8');

c = c.replace(
  /return \(\s*<motion\.button[\s\S]*?className={`group relative flex flex-col h-full w-full text-left bg-white rounded-\[24px\] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 overflow-hidden transition-all duration-300 md:hover:-translate-y-2 md:hover:shadow-\[0_20px_40px_-12px_rgba\(0,0,0,0\.1\)\] border \$\{[\s\S]*?`\}/,
  `return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: (idx || 0) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full w-full rounded-[24px]"
    >
      <Tilt
        tiltMaxAngleX={4}
        tiltMaxAngleY={4}
        perspective={1000}
        scale={1.02}
        transitionSpeed={400}
        glareEnable={true}
        glareMaxOpacity={0.12}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="24px"
        className="h-full w-full rounded-[24px]"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={() => onSelect(mod.id)}
          className={\`group relative flex flex-col h-full w-full text-left bg-white rounded-[24px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 overflow-hidden transition-shadow duration-300 md:hover:shadow-[0_20px_40px_-12px_rgba(99,102,241,0.25)] border \${
            mod.premium
              ? "border-amber-300/60 shadow-[0_4px_12px_rgba(245,158,11,0.05)] md:hover:shadow-[0_20px_40px_-12px_rgba(245,158,11,0.3)]"
              : \`\${theme.border} shadow-sm\`
          }\`}`
);

// We need to add </Tilt> and </motion.div> to the end instead of </motion.button>
c = c.replace(/<\/motion\.button>\n\s*\);\n\}/, `</motion.button>\n      </Tilt>\n    </motion.div>\n  );\n}`);

if (!c.includes('import Tilt')) {
  c = c.replace('import { motion, AnimatePresence } from "motion/react";', 'import { motion, AnimatePresence } from "motion/react";\nimport Tilt from "react-parallax-tilt";');
}

fs.writeFileSync('src/components/ToolCard.tsx', c);
