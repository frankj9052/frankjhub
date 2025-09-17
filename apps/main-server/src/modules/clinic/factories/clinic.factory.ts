import { setSeederFactory } from 'typeorm-extension';
import { Clinic } from '../entities/Clinic';
import {
  AMENITIES,
  AmenityItem,
  CLINIC_SERVICES,
  CLINIC_SPECIALTIES,
  CLINIC_STATUS,
  DATA_SOURCE,
  EMAIL_TYPE,
  HEALTH_INSURANCES,
  LANGUAGES,
  PHONE_TYPE,
} from '@frankjhub/shared-schema';
import { capitalize } from '@frankjhub/shared-utils';
import { faker } from '@faker-js/faker';
import { northYorkPostalCodes } from './northYorkPostalCode';
import { CLINIC_TAGS } from './clinic_tags';
import { accreditations } from './accreditations';

/**
 * North York（Toronto）大致边界框
 * lat:  43.730000 ~ 43.820000
 * lng: -79.510000 ~ -79.320000
 */
function randomNorthYorkLat() {
  return 43.73 + Math.random() * (43.82 - 43.73);
}
function randomNorthYorkLng() {
  return -79.51 + Math.random() * (-79.32 + 79.51);
}

const serviceBuckets = Object.values(CLINIC_SERVICES).map(service => [service]);

const languagesBuckets = Object.values(LANGUAGES).map(lang => {
  if (lang === 'english') {
    return [lang];
  } else {
    return ['english', lang];
  }
});

const insuranceBuckets = Object.values(HEALTH_INSURANCES).map(i => {
  if (i === 'ohip') {
    return [i];
  } else {
    return ['ohip', i];
  }
});

const specialtiesBuckets = Object.values(CLINIC_SPECIALTIES).map(spec => [spec]);

const amenityPool: AmenityItem[] = Object.values(AMENITIES).map(a => ({
  key: a,
  label: capitalize(a),
  value: true,
}));

export default setSeederFactory(Clinic, () => {
  const clinic = new Clinic();

  // 在seeder层用factory.override传入真实orgId
  clinic.orgId = faker.string.uuid();

  // 名称 / slug
  const nameSeed = faker.company.name();
  const userName = faker.internet.username();
  clinic.displayName = `${nameSeed} Clinic`;
  clinic.legalName = faker.datatype.boolean() ? `${nameSeed} Health Services Inc.` : null;
  clinic.slug = faker.helpers.slugify(clinic.displayName + ' ' + faker.word.sample()).toLowerCase();
  clinic.status = CLINIC_STATUS.ACTIVE;

  // 联系方式
  clinic.phones = [
    {
      type: faker.helpers.arrayElement(Object.values(PHONE_TYPE)),
      number: '+1-647-' + faker.helpers.replaceSymbols('###-####'),
      ext: faker.datatype.boolean() ? String(faker.number.int({ min: 100, max: 999 })) : undefined,
      country_code: '1',
      is_public: true,
    },
  ];
  clinic.emails = [
    {
      type: faker.helpers.arrayElement(Object.values(EMAIL_TYPE)),
      email: faker.internet.email(),
      is_public: true,
    },
  ];
  clinic.websiteUrl = faker.internet.url();
  clinic.bookingUrl = faker.datatype.boolean() ? faker.internet.url() : null;
  clinic.socialLinks = faker.datatype.boolean()
    ? {
        facebook: `https://facebook.com/${userName}`,
        instagram: `https://instagram.com/${userName}`,
      }
    : null;

  // 地址 North York / Toronto / ON / CA
  const lat = randomNorthYorkLat();
  const lng = randomNorthYorkLng();

  clinic.addressLine1 = `${faker.location.buildingNumber()} ${faker.location.street()}`;
  clinic.addressLine2 = faker.datatype.boolean()
    ? `Suite ${faker.number.int({ min: 101, max: 999 })}`
    : null;
  clinic.unit = faker.datatype.boolean() ? `Unit ${faker.number.int({ min: 1, max: 50 })}` : null;

  clinic.city = 'North York';
  clinic.province = 'ON';
  clinic.postalCode = faker.helpers.arrayElement(northYorkPostalCodes);
  clinic.countryCode = 'CA';

  clinic.formattedAddress = `${clinic.addressLine1} ${clinic.unit ? `${clinic.unit}` : ''}, ${
    clinic.city
  }, ${clinic.province} ${clinic.postalCode}, Canada`;

  clinic.placeId = null;
  clinic.timezone = 'America/Toronto';

  //   地理
  clinic.lat = lat.toFixed(6);
  clinic.lng = lng.toFixed(6);
  clinic.location = {
    type: 'Point',
    coordinates: [lng, lat],
  };

  // 营业时间
  clinic.openHours = {
    weekly: {
      Monday: [{ open: '09:00', close: '17:00' }],
      Tuesday: [{ open: '09:00', close: '17:00' }],
      Wednesday: [{ open: '09:00', close: '17:00' }],
      Thursday: [{ open: '09:00', close: '17:00' }],
      Friday: [{ open: '09:00', close: '17:00' }],
      Saturday: [{ open: '10:00', close: '14:00' }],
      Sunday: [], // 休息
    },
    exceptions: [],
  };

  // 服务 / 语言 / 保险
  clinic.services = faker.helpers.arrayElement(serviceBuckets);
  clinic.insurances = faker.helpers.arrayElement(insuranceBuckets);
  clinic.languages = faker.helpers.arrayElement(languagesBuckets);

  clinic.amenities = faker.helpers.arrayElements(amenityPool, {
    min: 2,
    max: amenityPool.length,
  });

  clinic.wheelchairAccessible = clinic.amenities.some(a => a.key === AMENITIES.WHEELCHAIR_ACCESS);
  clinic.acceptsNewPatients = true;
  clinic.walkIn = faker.datatype.boolean();
  clinic.telehealth = faker.datatype.boolean();
  clinic.emergency = faker.datatype.boolean();

  clinic.avgWaitMinutes = faker.datatype.boolean() ? faker.number.int({ min: 5, max: 60 }) : null;

  clinic.specialties = faker.helpers.arrayElement(specialtiesBuckets);

  // 评分与口碑
  const rating = faker.number.float({ min: 3.2, max: 4.9, multipleOf: 0.01 });
  clinic.ratingAvg = rating.toFixed(2);
  clinic.reviewCount = faker.number.int({ min: 0, max: 1200 });

  // 媒体与内容
  clinic.logoUrl = faker.image.urlPicsumPhotos({ width: 256, height: 256 });
  clinic.photoUrls = [
    faker.image.urlPicsumPhotos({ width: 1024, height: 768 }),
    faker.image.urlPicsumPhotos({ width: 1024, height: 768 }),
  ];
  clinic.shortDescription = faker.lorem.sentence({ min: 8, max: 16 });

  const num = faker.number.int({ min: 2, max: 4 });
  clinic.description = faker.lorem.paragraphs(num, '\n\n');

  clinic.tags = faker.helpers.arrayElements(CLINIC_TAGS, { min: 2, max: 5 });

  // 合规/备案
  clinic.licenseNumber = faker.datatype.boolean()
    ? `LIC-${faker.string.alphanumeric(8).toUpperCase()}`
    : null;
  clinic.accreditations = faker.helpers.arrayElements(accreditations, { min: 0, max: 2 });
  clinic.establishedYear = faker.datatype.boolean()
    ? faker.number.int({ min: 1960, max: new Date().getFullYear() })
    : null;
  clinic.taxNumber = faker.datatype.boolean() ? `BN${faker.string.numeric(9)}` : null;

  // 向量检索
  clinic.embedding = null; // 在后续嵌入流程中填充

  // 数据治理
  clinic.dataSource = DATA_SOURCE.MANUAL;
  clinic.sourceUpdatedAt = faker.datatype.boolean() ? faker.date.recent({ days: 90 }) : null;
  clinic.lastSyncedAt = faker.datatype.boolean() ? faker.date.recent({ days: 30 }) : null;
  clinic.dataVersion = 1;

  // 审计
  clinic.createdBy = 'Seeder';
  return clinic;
});
