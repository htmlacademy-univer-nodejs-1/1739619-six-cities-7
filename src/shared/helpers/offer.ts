import {Amenity, City, HousingType, Offer, UserType} from '../types/index.js';

export function createOffer(offerData: string): Offer {
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
    userAvatar,
    , // password column — пропускаем, не хранится в Offer
    userType,
    commentsCount,
    coordinates,
  ] = offerData.replace('\n', '').split('\t');

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
      avatarPath: userAvatar || undefined,
      type: userType as UserType,
    },
    commentsCount: Number.parseInt(commentsCount, 10),
    coordinates: { latitude, longitude },
  };
}
