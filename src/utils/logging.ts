import chalk from 'chalk';

function createLogFunction(formatter: (msg: string) => string) {
  return (msg: string) => console.log(formatter(msg));
}

export const log = {
  error: createLogFunction(chalk.red),
  warn: createLogFunction(chalk.yellow),
  info: createLogFunction(chalk.blue),
  infoSuccess: createLogFunction(chalk.green),
  debug: createLogFunction(chalk.gray)
};
