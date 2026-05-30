const fs = require('fs');
let str = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// I need to pull Landing Sections out of the max-w-7xl wrapper to sit edge-to-edge
// Wait! Let's check the exact structure.

// Currently:
// <div className="w-full max-w-7xl mx-auto px-4 z-10 w-full overflow-visible flex flex-col">
//   {user ? (
//       <WorkspaceSection onSelect={handleSelect} />
//   ) : (
//      <> <HeroSection ... /> ... </>
//   )}
//   {/* MAIN GRID */}

str = str.replace(
  '{user ? (\n            <WorkspaceSection onSelect={handleSelect} />\n          ) : (\n            <>\n              {/* HERO SECTION */}\n              <HeroSection onStart={() => handleSelect("house")} />\n\n              {/* SOCIAL PROOF SECTION */}\n              <SocialProofSection />\n\n              <HowItWorksSection />\n              <ProjectTypesSection onSelect={handleSelect} />\n              <FeatureComparisonSection />\n            </>\n          )}',
  ''
);

// Now I will inject it above the <div className="w-full max-w-7xl ...">
str = str.replace(
  '<div className="w-full max-w-7xl mx-auto px-4 z-10 w-full overflow-visible flex flex-col">',
  '{user ? (\n            <div className="w-full max-w-7xl mx-auto px-4 z-10 overflow-visible flex flex-col"><WorkspaceSection onSelect={handleSelect} /></div>\n          ) : (\n            <>\n              {/* HERO SECTION */}\n              <HeroSection onStart={() => handleSelect("house")} />\n              {/* SOCIAL PROOF SECTION */}\n              <SocialProofSection />\n              <HowItWorksSection />\n              <ProjectTypesSection onSelect={handleSelect} />\n              <FeatureComparisonSection />\n            </>\n          )}\n\n<div className="w-full max-w-7xl mx-auto px-4 z-10 w-full overflow-visible flex flex-col mt-12">'
);

fs.writeFileSync('src/components/Dashboard.tsx', str);
