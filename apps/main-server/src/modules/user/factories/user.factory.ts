import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entities/User';
import { faker } from '@faker-js/faker';
import { Gender } from '../../common/enums/gender.enum';
import { Honorific } from '../../common/enums/honorific.enum';

export default setSeederFactory(User, () => {
  const user = new User();

  user.userName = faker.internet.username();
  user.email = faker.internet.email();
  user.password = 'password';
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.middleName = faker.datatype.boolean() ? faker.person.middleName() : undefined;
  user.gender = faker.helpers.arrayElement(Object.values(Gender));
  user.dateOfBirth = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  user.honorific = faker.helpers.arrayElement(Object.values(Honorific));
  user.avatarImage = faker.image.avatar();
  user.emailVerified = true;
  user.profileCompleted = true;
  user.isActive = true;

  return user;
});
