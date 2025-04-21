#!/usr/bin/env node

import { Command } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'vite';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name('pebbles')
  .description('A Vite-powered static site generator')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new Pebbles project')
  .action(async () => {
    const templatesDir = join(__dirname, '../templates');
    const targetDir = join(process.cwd(), '.pebble');

    // Create .pebble directory
    await fs.ensureDir(targetDir);

    // Copy template files
    await fs.copy(templatesDir, targetDir);
    
    console.log('Initialized new Pebbles project in .pebble directory');
  });

// Default command (no arguments)
program
  .action(async () => {
    const pebbleDir = join(process.cwd(), '.pebble');
    
    if (!fs.existsSync(pebbleDir)) {
      console.error('No .pebble directory found. Run `npx pebbles init` first.');
      process.exit(1);
    }

    const server = await createServer({
      configFile: join(pebbleDir, 'vite.pebbles.ts'),
      root: pebbleDir,
      server: {
        port: 1977
      }
    });

    await server.listen();
    console.log('Development server running at http://localhost:1977');
  });

program.parse(); 