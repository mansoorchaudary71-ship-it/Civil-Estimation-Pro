const specs = {
  // GSB
  gsb1: { sizes: [75, 53, 26.5, 9.5, 4.75, 2.36, 0.425, 0.075], min: [100, 80, 55, 35, 25, 20, 10, 3], max: [100, 100, 90, 65, 55, 40, 25, 10] },
  gsb2: { sizes: [53, 26.5, 9.5, 4.75, 2.36, 0.425, 0.075], min: [100, 70, 40, 30, 20, 10, 3], max: [100, 100, 65, 50, 40, 25, 10] },
  gsb3: { sizes: [26.5, 9.5, 4.75, 2.36, 0.425, 0.075], min: [100, 65, 50, 40, 15, 3], max: [100, 95, 80, 65, 30, 10] },
  gsb4: { sizes: [26.5, 9.5, 4.75, 2.36, 0.425, 0.075], min: [100, 50, 35, 25, 10, 3], max: [100, 80, 65, 50, 20, 10] },
  gsb5: { sizes: [9.5, 4.75, 2.36, 0.425, 0.075], min: [100, 80, 55, 25, 3], max: [100, 100, 90, 50, 10] },
  gsb6: { sizes: [9.5, 4.75, 2.36, 0.425, 0.075], min: [100, 65, 50, 15, 3], max: [100, 100, 80, 30, 10] },

  // WBM
  wbm63_42: { sizes: [90, 63, 53, 45, 22.4], min: [100, 90, 25, 0, 0], max: [100, 100, 75, 15, 5] },
  wbm53_224: { sizes: [63, 53, 45, 22.4, 11.2], min: [100, 95, 65, 0, 0], max: [100, 100, 90, 10, 5] },
  wbm_screenings_a: { sizes: [13.2, 11.2, 5.6, 0.09], min: [100, 95, 15, 0], max: [100, 100, 35, 10] },
  wbm_screenings_b: { sizes: [11.2, 9.5, 5.6, 0.09], min: [100, 80, 10, 0], max: [100, 100, 30, 10] },

  // WMM
  wmm: { sizes: [53, 45, 22.4, 11.2, 4.75, 2.36, 0.6, 0.075], min: [100, 95, 60, 40, 25, 15, 8, 0], max: [100, 100, 80, 60, 40, 30, 22, 8] },

  // BM
  bm40: { sizes: [45, 37.5, 26.5, 19, 13.2, 4.75, 2.36, 0.3, 0.075], min: [100, 90, 75, 71, 35, 10, 4, 0, 0], max: [100, 100, 100, 95, 61, 22, 14, 5, 2] },
  bm19: { sizes: [26.5, 19, 13.2, 4.75, 2.36, 0.3, 0.075], min: [100, 90, 56, 16, 4, 0, 0], max: [100, 100, 88, 36, 19, 8, 2] },

  // DBM
  dbm1: { sizes: [45, 37.5, 26.5, 19, 13.2, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075], min: [100, 95, 63, 71, 56, 38, 28, 20, 15, 10, 5, 2], max: [100, 100, 93, 95, 80, 54, 42, 32, 26, 21, 14, 8] },
  dbm2: { sizes: [37.5, 26.5, 19, 13.2, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075], min: [100, 90, 71, 56, 38, 28, 20, 15, 10, 5, 2], max: [100, 100, 95, 80, 54, 42, 32, 26, 21, 14, 8] },
  
  // Sand Asphalt Base Course
  sand_asphalt: { sizes: [9.5, 4.75, 2.36, 0.6, 0.075], min: [100, 85, 80, 20, 2], max: [100, 100, 100, 65, 8] },

  // BC
  bc1: { sizes: [26.5, 19, 13.2, 9.5, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075], min: [100, 90, 59, 52, 35, 28, 21, 15, 11, 7, 2], max: [100, 100, 79, 72, 55, 44, 34, 27, 21, 15, 8] },
  bc2: { sizes: [19, 13.2, 9.5, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075], min: [100, 90, 70, 53, 42, 34, 26, 18, 12, 4], max: [100, 100, 88, 71, 58, 48, 38, 28, 20, 10] },

  // MSS
  mss_type_a: { sizes: [11.2, 9.5, 2.36, 0.6, 0.075], min: [100, 95, 30, 20, 2], max: [100, 100, 60, 45, 9] },
  mss_type_b: { sizes: [13.2, 11.2, 4.75, 2.36, 0.6, 0.075], min: [100, 95, 30, 20, 15, 2], max: [100, 100, 60, 45, 35, 9] },

  // Surface Dressing
  sd_19: { sizes: [26.5, 19, 13.2, 9.5, 4.75], min: [100, 85, 0, 0, 0], max: [100, 100, 25, 7, 2] },
  sd_13: { sizes: [19, 13.2, 9.5, 4.75, 2.36], min: [100, 85, 0, 0, 0], max: [100, 100, 30, 10, 2] },
  sd_10: { sizes: [13.2, 9.5, 6.3, 4.75, 2.36], min: [100, 85, 0, 0, 0], max: [100, 100, 35, 10, 2] },
  sd_6: { sizes: [9.5, 6.3, 4.75, 3.35, 0.075], min: [100, 85, 0, 0, 0], max: [100, 100, 30, 10, 2] },

  // Slurry Seal
  slurry_1: { sizes: [9.5, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075], min: [100, 100, 90, 65, 40, 25, 15, 10], max: [100, 100, 100, 90, 65, 42, 30, 20] },
  slurry_2: { sizes: [9.5, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075], min: [100, 90, 65, 45, 30, 18, 10, 5], max: [100, 100, 90, 70, 50, 30, 21, 15] },
  slurry_3: { sizes: [9.5, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075], min: [100, 70, 45, 28, 19, 12, 7, 5], max: [100, 90, 70, 50, 34, 25, 18, 15] },

  // SMA
  sma_13: { sizes: [19, 13.2, 9.5, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075], min: [100, 90, 50, 20, 16, 13, 10, 10, 8, 8], max: [100, 100, 75, 28, 24, 21, 18, 20, 13, 12] },
  sma_19: { sizes: [26.5, 19, 13.2, 9.5, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075], min: [100, 90, 45, 28, 22, 18, 15, 12, 10, 9, 8], max: [100, 100, 70, 60, 30, 25, 22, 20, 18, 13, 12] },
  
  // Mastic Asphalt
  mastic_coarse: { sizes: [19, 13.2, 2.36, 0.075], min: [100, 88, 0, 0], max: [100, 100, 5, 2] },
  mastic_fine: { sizes: [2.36, 0.6, 0.212, 0.075], min: [100, 30, 10, 0], max: [100, 100, 40, 25] }
};

const mapSpec = (name, obj) => {
  return {
    name,
    sieves: obj.sizes.map((size, idx) => ({
      size,
      minPassing: obj.min[idx],
      maxPassing: obj.max[idx]
    }))
  };
};

const finalStructure = {
  categories: [
    {
      name: "Granular Sub-base (GSB)",
      gradings: [
        mapSpec("Grading for Granular Sub-base Materials (GSB) (Grading - I)", specs.gsb1),
        mapSpec("Grading for Granular Sub-base Materials (GSB) (Grading - II)", specs.gsb2),
        mapSpec("Grading for Granular Sub-base Materials (GSB) (Grading - III)", specs.gsb3),
        mapSpec("Grading for Granular Sub-base Materials (GSB) (Grading - IV)", specs.gsb4),
        mapSpec("Grading for Granular Sub-base Materials (GSB) (Grading - V)", specs.gsb5),
        mapSpec("Grading for Granular Sub-base Materials (GSB) (Grading - VI)", specs.gsb6)
      ]
    },
    {
      name: "Water Bound Macadam (WBM) & Wet Mix Macadam (WMM)",
      gradings: [
        mapSpec("Water Bound Macadam Sub-Base / Base (WBM) (Coarse Aggregates (63 mm to 42 mm))", specs.wbm63_42),
        mapSpec("Water Bound Macadam Sub-Base / Base (WBM) (Coarse Aggregates (53 mm to 22.4 mm))", specs.wbm53_224),
        mapSpec("Water Bound Macadam Sub-Base / Base (WBM) (Grading For Screenings - Grade A (13.2 mm))", specs.wbm_screenings_a),
        mapSpec("Water Bound Macadam Sub-Base / Base (WBM) (Grading For Screenings - Grade B (11.2 mm))", specs.wbm_screenings_b),
        mapSpec("Wet Mix Macadam (WMM)", specs.wmm)
      ]
    },
    {
      name: "Bituminous Base Courses",
      gradings: [
        mapSpec("Bituminous Macadam (Grading - I (Nominal maximum aggregate size (40 mm)))", specs.bm40),
        mapSpec("Bituminous Macadam (Grading-II (Nominal maximum aggregate size (19 mm)))", specs.bm19),
        mapSpec("Dense Bituminous Macadam (DBM) (Grading - I (Nominal maximum aggregate size (37.5 mm)))", specs.dbm1),
        mapSpec("Dense Bituminous Macadam (DBM) (Grading - II (Nominal maximum aggregate size (26.5 mm)))", specs.dbm2),
        mapSpec("Sand Asphalt Base Course", specs.sand_asphalt)
      ]
    },
    {
      name: "Bituminous Surfacing Courses",
      gradings: [
        mapSpec("Bituminous Concrete (Grading - I (Nominal maximum aggregate size (19 mm)))", specs.bc1),
        mapSpec("Bituminous Concrete (Grading - II (Nominal maximum aggregate size (13.2 mm)))", specs.bc2),
        mapSpec("Close-Graded Premix Surfacing / Mixed Seal Surfacing (MSS) (Type A)", specs.mss_type_a),
        mapSpec("Close-Graded Premix Surfacing / Mixed Seal Surfacing (MSS) (Type B)", specs.mss_type_b),
        mapSpec("Surfacing Dressing (Nominal size - 19 mm)", specs.sd_19),
        mapSpec("Surfacing Dressing (Nominal size - 13 mm)", specs.sd_13),
        mapSpec("Surfacing Dressing (Nominal size - 10 mm)", specs.sd_10),
        mapSpec("Surfacing Dressing (Nominal size - 6 mm)", specs.sd_6),
        mapSpec("Slury Seal (Type - I (Minimum Layer Thickness - 2-3 mm))", specs.slurry_1),
        mapSpec("Slury Seal (Type II (Minimum Layer Thickness - 4-6 mm))", specs.slurry_2),
        mapSpec("Slury Seal (Type III (Minimum Layer Thickness - 6-8 mm))", specs.slurry_3),
        mapSpec("Stone Matrix Asphalt (SMA) (13-mm SMA (Wearing course))", specs.sma_13),
        mapSpec("Stone Matrix Asphalt (SMA) (19-mm SMA (Binder (intermediate) course))", specs.sma_19),
        mapSpec("Mastic Asphalt (Coarse Aggregate)", specs.mastic_coarse),
        mapSpec("Mastic Asphalt (Fine Aggregate)", specs.mastic_fine)
      ]
    }
  ]
};

const fs = require('fs');
let serverCode = fs.readFileSync('server.ts', 'utf8');

const startMarker = '      const specifications = {';
const startIndex = serverCode.indexOf(startMarker);

const endMarker = '      res.json(specifications);';
const endIndex = serverCode.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newCode = serverCode.substring(0, startIndex) + 
      '      const specifications = ' + JSON.stringify(finalStructure, null, 8) + ';\n' + 
      serverCode.substring(endIndex);
    fs.writeFileSync('server.ts', newCode);
    console.log('Successfully updated server.ts');
} else {
    console.error('Markers not found');
}
