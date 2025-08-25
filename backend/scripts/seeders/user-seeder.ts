import { PoolClient } from 'pg';
import { createUser, findUserByUsername } from '../../src/models/user-model';

export const seedUsers = async (client: PoolClient) => {
  try {
    console.log('Seeding users...');

    const usersToSeed = [
      { username: 'adminuser1', password: 'password', name: 'Admin User 1', role: 'admin' },
      { username: 'adminuser2', password: 'password', name: 'Admin User 2', role: 'admin' },
      { username: 'securityuser1', password: 'password', name: 'Security User 1', role: 'security' },
      { username: 'securityuser2', password: 'password', name: 'Security User 2', role: 'security' },
    ];

    for (const user of usersToSeed) {
      const existingUser = await findUserByUsername(client, user.username);
      if (!existingUser) {
        await createUser(client, user.username, user.password, user.name, user.role);
      }
    }

    console.log('Users seeded successfully.');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};