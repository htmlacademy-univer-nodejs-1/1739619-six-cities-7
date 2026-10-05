import { readFileSync } from 'node:fs';
import { Amenity, City, HousingType, Offer, UserType } from '../../types';
import { FileReader } from './file-reader.interface';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string,
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLine(line));
  }

  private parseLine(line: string): Offer {
    const [
      title,
      description,
      publicationDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      housingType,
      roomsCount,
      guestsCount,
      rentPrice,
      amenities,
      userName,
      userEmail,
      userAvatarPath,
      userPassword,
      userType,
      commentsCount,
      coordinates,
    ] = line.split('\t');

    const [latitude, longitude] = coordinates.split(';').map(Number);

    return {
      title,
      description,
      publicationDate: new Date(publicationDate),
      city: city as City,
      previewImage,
      images: images.split(';'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number.parseFloat(rating),
      housingType: housingType as HousingType,
      roomsCount: Number.parseInt(roomsCount, 10),
      guestsCount: Number.parseInt(guestsCount, 10),
      rentPrice: Number.parseInt(rentPrice, 10),
      amenities: amenities.split(';') as Amenity[],
      author: {
        name: userName,
        email: userEmail,
        avatarPath: userAvatarPath || undefined,
        password: userPassword,
        type: userType as UserType,
      },
      commentsCount: Number.parseInt(commentsCount, 10),
      coordinates: { latitude, longitude },
    };
  }
}
