export class ConcreteMortarCalculator {
  length: number;
  width: number;
  depth: number;
  mixRatio: number[];

  constructor(length: number, width: number, depth: number, mixRatio: string) {
    this.length = length;
    this.width = width;
    this.depth = depth;
    this.mixRatio = mixRatio.split(':').map(Number);
  }

  getWetVolumeCft() {
    return this.length * this.width * this.depth;
  }

  getDryVolumeCft() {
    return this.getWetVolumeCft() * 1.54;
  }

  calculate() {
    const sumRatio = this.mixRatio.reduce((a, b) => a + b, 0);
    if (sumRatio === 0) return { cementBags: 0, sandCft: 0, aggregateCft: 0 };

    const dryVol = this.getDryVolumeCft();
    
    // Cement calculation
    const cementRatio = this.mixRatio[0] || 0;
    const cementVolCft = (cementRatio / sumRatio) * dryVol;
    // 1 bag of 50kg cement = 1.226 cft (approx)
    const cementBags = cementVolCft / 1.226;

    // Sand calculation
    const sandRatio = this.mixRatio[1] || 0;
    const sandCft = (sandRatio / sumRatio) * dryVol;

    // Aggregate calculation
    const aggRatio = this.mixRatio[2] || 0;
    const aggregateCft = (aggRatio / sumRatio) * dryVol;

    return {
      cementBags,
      sandCft,
      aggregateCft
    };
  }
}

export class BrickworkCalculator {
  wallLengthFt: number;
  wallHeightFt: number;
  wallThicknessIn: number;
  deductionsSqFt: number;
  
  brickLengthIn: number;
  brickWidthIn: number;
  brickHeightIn: number;
  
  mortarThicknessIn: number;
  mixRatio: number[];

  constructor(
    wallLengthFt: number,
    wallHeightFt: number,
    wallThicknessIn: number,
    deductionsSqFt: number,
    brickLengthIn: number,
    brickWidthIn: number,
    brickHeightIn: number,
    mortarThicknessIn: number,
    mixRatio: string
  ) {
    this.wallLengthFt = wallLengthFt;
    this.wallHeightFt = wallHeightFt;
    this.wallThicknessIn = wallThicknessIn;
    this.deductionsSqFt = deductionsSqFt;
    
    this.brickLengthIn = brickLengthIn;
    this.brickWidthIn = brickWidthIn;
    this.brickHeightIn = brickHeightIn;
    
    this.mortarThicknessIn = mortarThicknessIn;
    this.mixRatio = mixRatio.split(':').map(Number);
  }

  getNetWallVolumeCft() {
    const wallVolCft = this.wallLengthFt * this.wallHeightFt * (this.wallThicknessIn / 12);
    const deductionVolCft = this.deductionsSqFt * (this.wallThicknessIn / 12);
    return Math.max(0, wallVolCft - deductionVolCft);
  }

  calculate() {
    const netWallVolCft = this.getNetWallVolumeCft();

    // Convert brick dims to ft
    const bL = this.brickLengthIn / 12;
    const bW = this.brickWidthIn / 12;
    const bH = this.brickHeightIn / 12;
    
    const mT = this.mortarThicknessIn / 12;

    // Brick volume with mortar
    const volBrickWithMortar = (bL + mT) * (bW + mT) * (bH + mT);
    
    // Number of bricks
    const numBricks = volBrickWithMortar > 0 ? Math.ceil(netWallVolCft / volBrickWithMortar) : 0;

    // Actual volume of bricks without mortar
    const volOneBrick = bL * bW * bH;
    const totalBrickVolCft = numBricks * volOneBrick;

    // Mortar volume (wet)
    const mortarWetVolCft = Math.max(0, netWallVolCft - totalBrickVolCft);
    // For mortar, dry volume factor is typically 1.33
    const mortarDryVolCft = mortarWetVolCft * 1.33;

    const sumRatio = this.mixRatio.reduce((a, b) => a + b, 0);
    let cementBags = 0;
    let sandCft = 0;

    if (sumRatio > 0 && this.mixRatio.length >= 2) {
      const cementVolCft = (this.mixRatio[0] / sumRatio) * mortarDryVolCft;
      cementBags = cementVolCft / 1.226; // 1 bag = 1.226 cft
      sandCft = (this.mixRatio[1] / sumRatio) * mortarDryVolCft;
    }

    return {
      netWallVolCft,
      numBricks,
      mortarWetVolCft,
      cementBags,
      sandCft
    };
  }
}

export class SteelCalculator {
  barDiameterMm: number;
  spanLengthM: number;
  spacingMm: number;
  barLengthM: number;
  overlapFactor: number;
  overlapsPerBar: number;

  constructor(
    barDiameterMm: number,
    spanLengthM: number,
    spacingMm: number,
    barLengthM: number,
    overlapFactor: number,
    overlapsPerBar: number
  ) {
    this.barDiameterMm = barDiameterMm;
    this.spanLengthM = spanLengthM;
    this.spacingMm = spacingMm;
    this.barLengthM = barLengthM;
    this.overlapFactor = overlapFactor;
    this.overlapsPerBar = overlapsPerBar;
  }

  calculate() {
    const numBars = this.spacingMm > 0 ? Math.ceil(this.spanLengthM / (this.spacingMm / 1000)) + 1 : 1;
    
    // Overlap length in meters: (factor * diameter in mm) / 1000
    const overlapLengthM = (this.overlapFactor * this.barDiameterMm) / 1000;
    
    // Total length for a single bar including overlaps
    const singleBarTotalLengthM = this.barLengthM + (overlapLengthM * this.overlapsPerBar);
    
    // Total length for all bars combined
    const totalLengthAllBarsM = numBars * singleBarTotalLengthM;
    
    // Weight per meter formula: D^2 / 162
    const weightPerMeter = Math.pow(this.barDiameterMm, 2) / 162;
    
    // Total weights
    const totalWeightKg = totalLengthAllBarsM * weightPerMeter;
    const totalWeightMT = totalWeightKg / 1000;

    return {
      numBars,
      singleBarTotalLengthM,
      totalLengthAllBarsM,
      weightPerMeter,
      totalWeightKg,
      totalWeightMT
    };
  }
}
