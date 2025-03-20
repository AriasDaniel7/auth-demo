export default () => ({
  port: +(process.env.PORT ?? 3000),
  database: {
    host: process.env.POSTGRES_HOST,
    port: +(process.env.POSTGRES_PORT ?? 5432),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});
