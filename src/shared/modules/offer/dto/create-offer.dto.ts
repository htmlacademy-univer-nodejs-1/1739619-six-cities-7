import { Amenity, City, Coordinates, HousingType } from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public publicationDate?: Date;
  public city: City;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public housingType: HousingType;
  public roomsCount: number;
  public guestsCount: number;
  public rentPrice: number;
  public amenities: Amenity[];
  public coordinates: Coordinates;
  public author: string;
}
