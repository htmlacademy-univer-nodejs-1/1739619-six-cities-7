import chalk from 'chalk';
import {Command} from './command.interface.js';
import {TSVFileReader} from '../../shared/libs/file-reader/index.js';
import {Offer} from '../../shared/types/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      const offers = fileReader.toArray();
      offers.forEach((offer) => this.printOffer(offer));
      console.info(chalk.green(`\nImported records: ${chalk.bold(offers.length)}`));
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(`Can't import data from file: ${chalk.bold(filename)}`));
      console.error(chalk.red(`Details: ${error.message}`));
    }
  }

  private printOffer(offer: Offer): void {
    console.info(`
${chalk.bold.hex('#9B59B6')('─────────────────────────────────────────')}
${chalk.bold.white(offer.title)}  ${offer.isPremium ? chalk.yellow('★ Premium') : ''}
${chalk.gray(offer.description)}

${chalk.bold('Город:')}        ${chalk.cyan(offer.city)}
${chalk.bold('Тип жилья:')}    ${chalk.magenta(offer.housingType)}
${chalk.bold('Цена:')}         ${chalk.green(`${offer.rentPrice} €/ночь`)}
${chalk.bold('Рейтинг:')}      ${chalk.yellow('★'.repeat(Math.round(offer.rating)))} ${chalk.gray(`(${offer.rating})`)}
${chalk.bold('Комнаты:')}      ${offer.roomsCount}  ${chalk.bold('Гости:')} ${offer.guestsCount}
${chalk.bold('Удобства:')}     ${offer.amenities.map((a) => chalk.blue(a)).join(', ')}
${chalk.bold('Автор:')}        ${offer.author.name} ${chalk.gray(`<${offer.author.email}>`)} ${chalk.magenta(`[${offer.author.type}]`)}
${chalk.bold('Координаты:')}   ${chalk.gray(`${offer.coordinates.latitude}, ${offer.coordinates.longitude}`)}`);
  }
}
