import fs from 'fs';

const data: any[] = [];

const lengths = [50, 100, 150, 200, 250, 300, 400, 500];
const widths = [2, 3, 4, 5, 8];
const depths = [3, 5, 8, 10, 12];
const swellFactors = [1.10, 1.15, 1.20, 1.25]; // 10%, 15%, 20%, 25% swell
const truckCapacities = [300, 400, 500];
const methods = ["Average End Area", "Prismoidal Formula"];

let count = 0;

outer: for (const length of lengths) {
  for (const width of widths) {
    for (const depth of depths) {
      for (const swell of swellFactors) {
        for (const truck of truckCapacities) {
          for (const method of methods) {
            if (count >= 150) break outer;

            const bankVolumeCft = length * width * depth;
            const looseVolumeCft = bankVolumeCft * swell;
            const totalTrips = Math.ceil(looseVolumeCft / truck);
            
            const swellPercent = Math.round((swell - 1) * 100);

            const slug = `excavation-volume-and-hauling-trips-for-${length}ft-trench-${width}ft-wide-${depth}ft-deep`;
            
            data.push({
              slug,
              length_ft: length,
              width_ft: width,
              depth_ft: depth,
              calculation_method: method,
              swell_factor: swell,
              bank_volume_cft: bankVolumeCft,
              loose_volume_cft: looseVolumeCft,
              truck_capacity_cft: truck,
              total_hauling_trips: totalTrips,
              target_keyword: `excavation volume and hauling trips for ${length}ft trench`,
              related_keywords: [
                `trench excavation calculator`,
                `how many trucks for ${length}ft excavation`,
                `${swellPercent}% swell factor earthworks`,
                `${method} earthwork calculation`,
                `soil mechanics hauling estimation`
              ]
            });
            count++;
          }
        }
      }
    }
  }
}

fs.mkdirSync('./src/data', { recursive: true });
fs.writeFileSync('./src/data/earthworkData.json', JSON.stringify(data, null, 2));
console.log('Generated ' + data.length + ' earthwork items.');
