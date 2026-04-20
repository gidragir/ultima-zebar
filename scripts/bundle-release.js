const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const version = pkg.version;

console.log(`🚀 Starting release bundle for version ${version}...`);

// 1. Update zpack.json version
const zpackPath = path.join(rootDir, 'zpack.json');
if (fs.existsSync(zpackPath)) {
    console.log('📝 Updating zpack.json version...');
    const zpack = JSON.parse(fs.readFileSync(zpackPath, 'utf-8'));
    zpack.version = version;
    fs.writeFileSync(zpackPath, JSON.stringify(zpack, null, 4) + '\n');
}

// 2. Prepare release_build directory
const releaseBuildDir = path.join(rootDir, 'release_build');
if (fs.existsSync(releaseBuildDir)) {
    console.log('🧹 Cleaning existing release_build directory...');
    fs.rmSync(releaseBuildDir, { recursive: true, force: true });
}
fs.mkdirSync(path.join(releaseBuildDir, 'widgets'), { recursive: true });

// 3. Copy zpack.json
console.log('📂 Copying zpack.json...');
fs.copyFileSync(zpackPath, path.join(releaseBuildDir, 'zpack.json'));

// 4. Copy widget dist folders
console.log('📦 Copying widget dist folders...');
const widgetsDir = path.join(rootDir, 'widgets');
const entries = fs.readdirSync(widgetsDir, { withFileTypes: true });

for (const entry of entries) {
    if (entry.isDirectory()) {
        const widgetDist = path.join(widgetsDir, entry.name, 'dist');
        if (fs.existsSync(widgetDist)) {
            const targetDir = path.join(releaseBuildDir, 'widgets', entry.name, 'dist');
            fs.mkdirSync(path.dirname(targetDir), { recursive: true });
            fs.cpSync(widgetDist, targetDir, { recursive: true });
            console.log(`   ✅ Copied ${entry.name}/dist`);
        }
    }
}

// 5. Create ZIP archive
console.log('🤐 Creating ZIP archive...');
const zipName = 'ultima-zebar.zip';
const zipPath = path.join(rootDir, zipName);

if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
}

try {
    if (process.platform === 'win32') {
        // Use PowerShell on Windows
        execSync(`powershell -Command "Compress-Archive -Path '${releaseBuildDir}/*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });
    } else {
        // Use zip on Unix-like systems
        execSync(`cd release_build && zip -r ../${zipName} *`, { stdio: 'inherit' });
    }
    console.log(`✨ Successfully created ${zipName}`);
} catch (error) {
    console.error('❌ Failed to create ZIP archive:', error.message);
    process.exit(1);
}
