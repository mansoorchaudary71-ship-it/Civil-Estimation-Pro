import fs from 'fs';

const data: any[] = [];
const plotSizes = [
  { text: "3 Marla", val: 3 },
  { text: "4 Marla", val: 4 },
  { text: "5 Marla", val: 5 },
  { text: "6 Marla", val: 6 },
  { text: "7 Marla", val: 7 },
  { text: "8 Marla", val: 8 },
  { text: "10 Marla", val: 10 },
  { text: "12 Marla", val: 12 },
  { text: "14 Marla", val: 14 },
  { text: "1 Kanal", val: 20 },
  { text: "2 Kanal", val: 40 }
];

const storiesArr = ["Single", "Double"];

// 1 Marla = 225 sq ft
const sqftPerMarla = 225;

let count = 0;

plotSizes.forEach(plot => {
  storiesArr.forEach(stories => {
    // let's generate multiple covered areas for each plot to reach 200 combinations
    const baseCovered = plot.val * sqftPerMarla * (stories === "Single" ? 0.75 : 1.4);
    
    // Generate 10 variations around the base
    for (let i = 0; i < 10; i++) {
      if (count >= 200) return;
      
      const multiplier = 0.85 + (i * 0.05); // 0.85 to 1.30
      const coveredArea = Math.round(baseCovered * multiplier);
      
      const slug = `grey-structure-cost-for-${plot.text.toLowerCase().replace(/ /g, '-')}-${stories.toLowerCase()}-story-house-${coveredArea}-sqft`;
      
      data.push({
        slug,
        plot_size_marla: plot.val,
        plot_designation: plot.text,
        covered_area_sqft: coveredArea,
        stories,
        baseline_multiplier_standard_finish: 1.0,
        baseline_multiplier_premium_finish: 1.3,
        grey_structure_rate_per_sqft: 1800, // example rate
        target_keyword: `${plot.text} ${stories.toLowerCase()} story house construction cost`,
        related_keywords: [
          `${plot.text} house construction cost`,
          `grey structure material calculation`,
          `cost to build ${coveredArea} sqft house in Pakistan`,
          `${plot.text} ${stories.toLowerCase()} story grey structure rate`
        ]
      });
      count++;
    }
  });
});

fs.mkdirSync('./src/data', { recursive: true });
fs.writeFileSync('./src/data/houseData.json', JSON.stringify(data.slice(0, 200), null, 2));
console.log('Generated ' + Math.min(data.length, 200) + ' house estimation items.');
