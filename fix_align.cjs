const fs = require('fs');
const dir = 'src/components/modules/';
const files = fs.readdirSync(dir);
files.forEach(file => {
  if (!file.endsWith('.tsx')) return;
  const filePath = dir + file;
  let code = fs.readFileSync(filePath, 'utf-8');
  if (code.includes('<GlobalSettingsToggle />')) {
      code = code.replace(/<GlobalSettingsToggle \/>/g, '<GlobalSettingsToggle align="left" />');
      fs.writeFileSync(filePath, code);
      console.log('Fixed', file);
  }
});
