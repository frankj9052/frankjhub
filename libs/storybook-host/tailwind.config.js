const adminPortalConfig = require('../../apps/admin-portal/tailwind.config');
/** @type {import('tailwindcss').Config} */
module.exports = {
  ...adminPortalConfig,
  content: [
    ...adminPortalConfig.content,
    '../shared-ui/src/lib/**/*!(*.stories|*.spec).{ts,tsx,html}',
  ],
};
