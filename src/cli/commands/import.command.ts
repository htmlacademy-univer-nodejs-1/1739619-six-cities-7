import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { Offer } from '../../shared/types/index.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { PinoLogger } from '../../shared/libs/logger/index.js';
import { DatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { DefaultUserService } from '../../shared/modules/user/index.js';
import { UserModel } from '../../shared/modules/user/index.js';
import { UserService } from '../../shared/modules/user/index.js';
import { OfferService } from '../../shared/modules/offer/index.js';
import { OfferModel } from '../../shared/modules/offer/index.js';
import { OfferServiceInterface } from '../../shared/modules/offer/index.js';

const DEFAULT_DB_PORT = '27017';

export class ImportCommand implements Command {
  private userService!: UserService;
  private offerService!: OfferServiceInterface;
  private readonly databaseClient: DatabaseClient;
  private readonly logger: Logger;
  private salt!: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new PinoLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async saveOffer(offer: Offer): Promise<void> {
    const user = await this.userService.findOrCreate({
      name: offer.author.name,
      email: offer.author.email,
      avatarPath: offer.author.avatarPath,
      type: offer.author.type,
      password: offer.author.email,
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      publicationDate: offer.publicationDate,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      housingType: offer.housingType,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      rentPrice: offer.rentPrice,
      amenities: offer.amenities,
      coordinates: offer.coordinates,
      author: user.id,
    });
  }

  private async onImportedLine(line: string, resolve: () => void): Promise<void> {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number): void {
    this.logger.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, login, password, host, dbname, salt] = parameters;
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);

    this.salt = salt;
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new OfferService(this.logger, OfferModel);

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      this.logger.error(`Can't import data from file: ${filename}`, error as Error);
      getErrorMessage(error);
    }
  }
}