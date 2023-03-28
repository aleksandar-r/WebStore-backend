import bcrypt from 'bcrypt'

const users = [
  {
    name: 'Mile Admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Mile Lugonja',
    email: 'mile@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Mila Lugonja',
    email: 'mila@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users
