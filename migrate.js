import path from 'path';
import { migrate, MigrateConfig } from 'ts-migrate-server';

// get input files folder
const inputDir = path.resolve("/Users/aida/Projects/ibs-tracker-api");

// create new migration config. You can add your plugins there
const config = new MigrateConfig();

// run migration
const exitCode = await migrate({ rootDir: inputDir, config });

process.exit(exitCode);