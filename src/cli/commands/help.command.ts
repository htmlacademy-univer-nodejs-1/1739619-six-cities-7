import chalk from 'chalk';
import {Command} from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(): Promise<void> {
    console.info(`
  ${chalk.bold.cyan('Программа для подготовки данных для REST API сервера.')}

  ${chalk.yellow('Пример:')}
      ${chalk.white('cli.js --<command> [--arguments]')}

  ${chalk.yellow('Команды:')}
      ${chalk.green('--help')}:            # печатает этот текст
      ${chalk.green('--version')}:         # выводит номер версии
      ${chalk.green('--import')} ${chalk.gray('<path>')}:  # импортирует данные из TSV
`);
  }
}
