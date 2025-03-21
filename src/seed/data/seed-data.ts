interface SeedUser {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  isActive?: boolean;
  roles?: string[];
}

interface SeedData {
  users: SeedUser[];
}

export const InitialData: SeedData = {
  users: [
    {
      userName: 'john_doe',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      isActive: true,
      roles: ['admin', 'user'],
    },
    {
      userName: 'jane_smith',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'Password123',
      isActive: false,
      roles: ['user'],
    },
    {
      userName: 'alice_jones',
      fullName: 'Alice Jones',
      email: 'alice.jones@example.com',
      password: 'Password123',
      isActive: true,
      roles: ['user'],
    },
    {
      userName: 'bob_brown',
      fullName: 'Bob Brown',
      email: 'bob.brown@example.com',
      password: 'Password123',
      isActive: false,
      roles: ['admin'],
    },
  ],
};
