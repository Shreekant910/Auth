import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './db/schema.js',
    dialect: 'mysql',
    dbCredentials:{
        url: 'mysql://root:Test_12345678@localhost:3306/AUTHE',
    }
})