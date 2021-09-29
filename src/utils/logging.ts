import chalk from 'chalk';

function createLogFunction(formatter: (msg: string) => string) {
  return (msg: string, e?: unknown) => console.log(formatter(msg), e);
}

const verboseOutputEnabled = process.argv.includes('-v') || process.argv.includes('--verbose');

export const log = {
  error: createLogFunction(chalk.red),
  warn: createLogFunction(chalk.yellow),
  info: createLogFunction(chalk.blue),
  infoSuccess: createLogFunction(chalk.green),
  debug: verboseOutputEnabled ? createLogFunction(chalk.gray) : () => {},
};
