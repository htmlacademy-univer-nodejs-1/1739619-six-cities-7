import dayjs from 'dayjs';
import {OfferGenerator} from './offer-generator.interface.js';
import {MockServerData, City, CITY_COORDINATES, HousingType, Amenity, UserType} from '../../types/index.js';
import {generateRandomValue, getRandomItems, getRandomItem} from '../../helpers/index.js';

const MIN_PRICE = 500;
const MAX_PRICE = 2000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_RATING = 1;
const MAX_RATING = 5;
const RATING_NUM_AFTER_DIGIT = 1;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_ADULTS = 1;
const MAX_ADULTS = 10;

const MIN_COMMENTS = 0;
const MAX_COMMENTS = 20;

const TRUE_FALSE = [true, false];

export class TsvOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const publicationDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem(Object.values(City));
    const previewImage = getRandomItem(this.mockData.offerImages);
    const images = getRandomItems(this.mockData.offerImages);
    const isPremium = getRandomItem(TRUE_FALSE);
    const isFavorite = getRandomItem(TRUE_FALSE);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, RATING_NUM_AFTER_DIGIT);
    const housingType = getRandomItem(Object.values(HousingType));
    const roomsCount = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const guestsCount = generateRandomValue(MIN_ADULTS, MAX_ADULTS);
    const rentPrice = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const amenities = getRandomItems(Object.values(Amenity));
    const userName = getRandomItem(this.mockData.users);
    const userEmail = getRandomItem(this.mockData.emails);
    const userAvatar = getRandomItem(this.mockData.avatars);
    const userType = getRandomItem(Object.values(UserType));
    const commentsCount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS);
    const { latitude, longitude } = CITY_COORDINATES[city];

    return [
      title,
      description,
      publicationDate,
      city,
      previewImage,
      images.join(';'),
      isPremium,
      isFavorite,
      rating,
      housingType,
      roomsCount,
      guestsCount,
      rentPrice,
      amenities.join(';'),
      userName,
      userEmail,
      userAvatar,
      'password',
      userType,
      commentsCount,
      `${latitude};${longitude}`,
    ].join('\t');
  }
}
