import { config } from 'dotenv';
config({ path: process.env.NODE_ENV == 'production' ? '.env' : `.env.${process.env.NODE_ENV || 'development'}` });
export const ROOT_PATH = process.cwd()//__dirname
export const PACKAGE = require('../../package.json')
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
export const { BASE_URL, PUBLIC_PATH, STATIC_PATH, UPLOAD_PATH } = process.env;
export const UPLOAD_MAX_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE);
