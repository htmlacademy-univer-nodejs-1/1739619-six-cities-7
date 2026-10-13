import chalk from 'chalk';
import {Command} from './command.interface.js';
import {TSVFileReader} from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage } from "../../shared/helpers/index.js";
import {Offer} from '../../shared/types/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    this.printOffer(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine.bind(this));
    fileReader.on('end', this.onCompleteImport.bind(this));

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
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
