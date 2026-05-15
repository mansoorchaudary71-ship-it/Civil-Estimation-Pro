import fs from 'fs';

const data: any[] = [];
const dryVolumeMultiplier = 1.54;
const cementBagVolCft = 1.226; // 1 bag of 50kg cement = 1.226 cft

const mixDetails = [
  { grade: "M15", c: 1, s: 2, a: 4 },
  { grade: "M20", c: 1, s: 1.5, a: 3 },
  { grade: "M25", c: 1, s: 1, a: 2 }
];

let count = 0;

for (let v = 10; v <= 1340 && count < 400; v += 10) {
  mixDetails.forEach(mix => {
    if (count >= 400) return;

    const wetVolumeCft = v;
    const dryVolumeCft = wetVolumeCft * dryVolumeMultiplier;
    const sumRatio = mix.c + mix.s + mix.a;

    const cementVolCft = dryVolumeCft * (mix.c / sumRatio);
    const sandVolCft = dryVolumeCft * (mix.s / sumRatio);
    const aggVolCft = dryVolumeCft * (mix.a / sumRatio);

    const cementBags = Math.ceil(cementVolCft / cementBagVolCft);

    data.push({
      slug: `cement-sand-aggregate-for-${wetVolumeCft}-cft-${mix.grade.toLowerCase()}-concrete`,
      volume_cft: wetVolumeCft,
      mix_ratio: mix.grade,
      cement_bags_required: cementBags,
      sand_cft_required: parseFloat(sandVolCft.toFixed(2)),
      aggregate_cft_required: parseFloat(aggVolCft.toFixed(2)),
      target_keyword: `material required for ${wetVolumeCft} cft ${mix.grade} concrete`,
      related_keywords: [
        `${mix.grade} concrete material calculation`,
        `how much cement in ${wetVolumeCft} cft concrete`,
        `civil engineering material estimation`
      ]
    });
    count++;
  });
}

fs.mkdirSync('./src/data', { recursive: true });
fs.writeFileSync('./src/data/concreteData.json', JSON.stringify(data, null, 2));
console.log('Generated ' + data.length + ' concrete items.');
