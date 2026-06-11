/**
 * Development launcher — starts Expo bundler on :8081 and Express on :5000.
 * Express proxies non-/api traffic to Expo, so only port 5000 is needed.
 */
const { spawn } = require('child_process');

function start(name, cmd, args, env = {}) {
  const prefix = name === 'API' ? '\x1b[36m[API]\x1b[0m' : '\x1b[32m[Expo]\x1b[0m';
  const proc = spawn(cmd, args, {
    stdio: 'pipe',
    env: { ...process.env, ...env },
    shell: false,
  });
  proc.stdout.on('data', d => process.stdout.write(prefix + ' ' + d));
  proc.stderr.on('data', d => process.stderr.write(prefix + ' ' + d));
  proc.on('error', err => console.error(prefix, 'Process error:', err.message));
  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) console.log(prefix, `Exited with code ${code}`);
  });
  return proc;
}

const expo = start('Expo', 'npx', ['expo', 'start', '--web', '--port', '8081'], {
  NODE_ENV: 'development',
  EXPO_PUBLIC_API_URL: '/api',
});

// Give Expo 2 seconds head start before starting Express (avoids port race)
setTimeout(() => {
  start('API', 'node', ['server/index.js'], {
    NODE_ENV: 'development',
    PORT: '5000',
  });
}, 2000);

process.on('SIGTERM', () => { expo.kill('SIGTERM'); process.exit(0); });
process.on('SIGINT',  () => { expo.kill('SIGTERM'); process.exit(0); });
