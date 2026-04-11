#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

try {
	fs.mkdirSync('dist', { recursive: true });
	fs.copyFileSync('src/index.css', 'dist/index.css');
	fs.copyFileSync('src/theme.css', 'dist/theme.css');
	fs.copyFileSync('src/fonts.css', 'dist/fonts.css');
	console.log('CSS files copied successfully');
	process.exit(0);
} catch (err) {
	console.error('Failed to copy CSS files:', err.message);
	process.exit(1);
}
