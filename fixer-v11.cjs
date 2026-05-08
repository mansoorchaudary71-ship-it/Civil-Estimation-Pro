const fs = require('fs');

// Fix Takeoff.tsx
let f1 = fs.readFileSync('src/components/modules/Takeoff.tsx', 'utf8');
f1 = f1.replace(/offsetX=\{20 \/ stageScale\} \/\*\s*approximate centering \/>/g, 'offsetX={20 / stageScale} /* approximate centering */ />');
// Wait, I also need to revert the hack I did where I replaced '})}' with ')}' earlier!
// Because if that actually was correct, I shouldn't have changed it. 
// But earlier ESBuild errored on ')}' because of the unclosed <KonvaText>. Let's see if we need to revert it.
// Wait, '})}' wasn't in my original dump... oh wait, if there's no error anymore, let's just do a normal build!
fs.writeFileSync('src/components/modules/Takeoff.tsx', f1, 'utf8');

// Fix SlabSteelModule.tsx
let f2 = fs.readFileSync('src/components/modules/SlabSteelModule.tsx', 'utf8');
f2 = f2.replace(/\/\*\s*mm useEffect\(\(\) => \{\s*\*\/\s*const parse/g, '/* mm */ useEffect(() => { const parse');
f2 = f2.replace(/\/\*\s*adding hook length \(e\.g\. 2 \* 9d\) or we can just use straight bar cutting length \*\/\s*for simple slab \/\*\s*we'll keep it simple: straight length \*\/\s*const mainWt/g, 
"/* adding hook length (e.g. 2 * 9d) or we can just use straight bar cutting length for simple slab we'll keep it simple: straight length */ const mainWt");
fs.writeFileSync('src/components/modules/SlabSteelModule.tsx', f2, 'utf8');

console.log("Applied further fixes.");
