// scripts/add-shadcn-component.ts
import { execSync } from 'child_process';

// Grab arguments passed to the script (after "node script.ts ...")
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Please provide at least one component name, e.g., `button`, `card`, etc.');
  process.exit(1);
}

for (const component of args) {
  const command = `npx shadcn@canary add ${component}`;
  console.log(`🚀 Running: ${command}`);
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: 'libs/shared-ui-shadcn',
    });
  } catch {
    console.error(`❌ Failed to add component "${component}"`);
    process.exit(1);
  }
}
