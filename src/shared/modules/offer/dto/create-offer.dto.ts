import { Amenity, City, HousingType } from '../../../types/index.js';

type Coordinates = {
  latitude: number;
  longitude: number;
};

export class CreateOfferDto {
  public title: string;
  public description: string;
  public publicationDate: Date;
  public city: City;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public housingType: HousingType;
  public roomsCount: number;
  public guestsCount: number;
  public rentPrice: number;
  public amenities: Amenity[];
  public coordinates: Coordinates;
}
