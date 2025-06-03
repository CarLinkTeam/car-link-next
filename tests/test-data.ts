// Datos de usuarios
export const USERS = {
  admin: {
    email: 'admin@carlink.com',
    password: 'admin123',
    fullName: 'Administrador',
    location: 'Cali, Colombia',
    phone: '+57123456789',
    roles: ['ADMIN'],
  },
  owner1: {
    email: 'propietario1@carlink.com',
    password: 'propietario',
    fullName: 'Ana López',
    location: 'Palmira, Colombia',
    phone: '+57987654321',
    roles: ['OWNER'],
  },
  owner2: {
    email: 'propietario2@carlink.com',
    password: 'propietario',
    fullName: 'Juan García',
    location: 'Cali, Colombia',
    phone: '+57654321098',
    roles: ['OWNER'],
  },
  tenant1: {
    email: 'cliente1@carlink.com',
    password: 'cliente',
    fullName: 'María Rodríguez',
    location: 'Cali, Colombia',
    phone: '+57789123456',
    roles: ['TENANT'],
  },
  tenant2: {
    email: 'cliente2@carlink.com',
    password: 'cliente',
    fullName: 'David Sánchez',
    location: 'Palmira, Colombia',
    phone: '+57678901234',
    roles: ['TENANT'],
  },
}

// Datos para prueba
export const REGISTER_DATA = {
  newUser: {
    fullName: 'Usuario Nuevo',
    email: 'nuevo.usuario@carlink.com',
    password: 'Password123',
    location: 'Medellín, Colombia',
    phone: '+573015557890',
  },
}
