const { execSync } = require('child_process');
const fs = require('fs');

const files = fs.readdirSync('src/components/modules').filter(f => f.endsWith('.tsx'));
for (const f of files) {
  try {
    execSync(`npx esbuild src/components/modules/${f}`);
  } catch (e) {
    const err = e.stderr.toString();
    const match = err.match(/Expected (.*?) but found "(.*?)"[\s\S]*?src\/components\/modules\/([^:]+):(\d+):(\d+):[\s\S]*?(\d+ │)(.*)/);
    if(match) {
        console.log(`\n==== ${f} ====`);
        console.log(match[7]);
    } else {
        const mix = err.match(/Unexpected (.*?)[\s\S]*?src\/components\/modules\/([^:]+):(\d+):(\d+):[\s\S]*?(\d+ │)(.*)/);
        if(mix) {
            console.log(`\n==== ${f} ====`);
            console.log(mix[6].trim());
        }
    }
  }
}
