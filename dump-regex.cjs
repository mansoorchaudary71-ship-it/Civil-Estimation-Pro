const fs = require('fs');

const files = [
  'AreaCalculator.tsx',
  'FormworkEstimator.tsx',
  'GlobalSettingsModal.tsx',
  'HouseEstimator.tsx',
  'ManholeModule.tsx',
  'MasterQuantityEstimator.tsx',
  'RateAnalysis.tsx',
  'RccStructureCalculator.tsx',
  'RigidPavementEstimator.tsx',
  'RoadEstimator.tsx',
  'ShareMenu.tsx',
  'SlabSteelModule.tsx',
  'StaircaseCalculator.tsx',
  'Takeoff.tsx',
  'UnitConverter.tsx'
];

for(const f of files) {
  try {
    const code = fs.readFileSync('src/components/modules/' + f, 'utf8');
    
    // just looking for some known problematic lines that are failing parsing:
    
    // AreaCalculator
    if(f === 'AreaCalculator.tsx') {
      let m = code.match(/meters to \*\/  input unit/);
      if(m) console.log(f, m[0]);
    }

    // Formwork
    if(f === 'FormworkEstimator.tsx') {
      let m = code.match(/wastagePct/);
      if(m) console.log('Formwork', code.slice(m.index - 30, m.index+30));
    }

    // Global
    if(f === 'GlobalSettingsModal.tsx') {
      let m = code.match(/defaultPrefs:/);
      if(m) console.log('Global', code.slice(m.index - 50, m.index+50));
    }

    // HouseEstimator
    if(f === 'HouseEstimator.tsx') {
      let m = code.match(/setCustomRate/g);
      if(m) console.log('House setCustomRate count:', m.length);
      let breakmatch = code.match(/inputs setCustomRate/);
      if(breakmatch) console.log('House', breakmatch[0]);
    }
    
    // ManholeModule
    if(f === 'ManholeModule.tsx') {
      let m = code.match(/let\'s assume/);
      if(m) console.log('Manhole', code.slice(m.index - 30, m.index+80));
    }

    // Master
    if(f === 'MasterQuantityEstimator.tsx') {
      let m = code.match(/id: "concrete",/);
      if(m) console.log('Master', code.slice(m.index - 40, m.index+30));
    }

    // Rate
    if(f === 'RateAnalysis.tsx') {
      let m = code.match(/Rate Inputs \*\/\}/);
      if(m) console.log('Rate', code.slice(m.index - 30, m.index+30));
    }

    // Rigid
    if(f === 'RigidPavementEstimator.tsx') {
      let m = code.match(/Wait, \*\/\s+if w=/);
      if(m) console.log('Rigid', code.slice(m.index - 40, m.index+40));
    }
    
    // Road
    if(f === 'RoadEstimator.tsx') {
      let m = code.match(/L const/);
      if(m) console.log('Road', code.slice(m.index - 40, m.index+40));
    }
    
    // Share
    if(f === 'ShareMenu.tsx') {
      let m = code.match(/Add date/);
      if(m) console.log('Share', code.slice(m.index - 40, m.index+40));
    }
    
    // Slab
    if(f === 'SlabSteelModule.tsx') {
      let m = code.match(/const \[mainSpacing/);
      if(m) console.log('Slab', code.slice(m.index - 40, m.index+40));
    }
    
    // Staircase
    if(f === 'StaircaseCalculator.tsx') {
      let m = code.match(/stairShape/);
      if(m) console.log('Staircase', code.slice(m.index - 40, m.index+40));
    }

    // Takeoff
    if(f === 'Takeoff.tsx') {
      let m = code.match(/Vertex circles/);
      if(m) console.log('Takeoff', code.slice(m.index - 40, m.index+40));
    }

    // Unit
    if(f === 'UnitConverter.tsx') {
      let m = code.match(/\* factor/);
      if(m) console.log('Unit', code.slice(m.index - 40, m.index+40));
    }

  } catch(e) {}
}
