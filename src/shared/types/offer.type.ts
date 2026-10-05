import { Amenity } from './amenity.enum';
import { City } from './city.enum';
import { HousingType } from './housing-type.enum';
import { User } from './user.type';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Offer = {
  title: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  rentPrice: number;
  amenities: Amenity[];
  author: User;
  commentsCount: number;
  coordinates: Coordinates;
};
