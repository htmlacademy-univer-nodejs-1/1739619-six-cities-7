import { Amenity } from './amenity.enum.js';
import { City } from './city.enum.js';
import { HousingType } from './housing-type.enum.js';
import { User } from './user.type.js';

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
