const { execSync } = require('child_process');
try {
  execSync('git checkout -- src/components/modules src/components/ui', { stdio: 'inherit' });
  console.log('Restored files from git');
} catch (e) {
  console.error('Failed', e);
}
