#!/usr/bin/env node
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.resolve(__dirname, '../templates');

const args = process.argv.slice(2);
const flags = new Set(args.filter(arg => arg.startsWith('-')));
const positional = args.filter(arg => !arg.startsWith('-'));

const force = flags.has('--force') || flags.has('-f');
const quiet = flags.has('--quiet') || flags.has('-q');

const targetName = positional[0] && positional[0] !== '.' ? positional[0].trim() : '.';
const targetDir = path.resolve(process.cwd(), targetName);
const projectName = targetName === '.' ? path.basename(process.cwd()) || 'quickstart-project' : path.basename(targetDir);

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function isDirEmpty(dir) {
  try {
    const entries = await fs.readdir(dir);
    return entries.length === 0;
  } catch (error) {
    if (error.code === 'ENOENT') return true;
    throw error;
  }
}

async function readTemplate(name) {
  const templatePath = path.join(TEMPLATE_DIR, name);
  return fs.readFile(templatePath, 'utf8');
}

async function writeFileIfMissing(filePath, content) {
  const exists = existsSync(filePath);
  if (exists && !force) {
    console.log(`⚠️  Skipping existing file: ${path.relative(targetDir, filePath)}`);
    return false;
  }
  await fs.writeFile(filePath, content, 'utf8');
  return true;
}

function formatOutput(msg) {
  if (!quiet) {
    console.log(msg);
  }
}

async function main() {
  if (!force && existsSync(targetDir) && !(await isDirEmpty(targetDir)) && targetName !== '.') {
    console.error(`❌ Target directory "${targetName}" already exists and is not empty. Use --force to overwrite.`);
    process.exit(1);
  }

  await ensureDir(targetDir);

  const replacements = {
    '{{PROJECT_NAME}}': projectName || 'CrewX Quickstart Project',
  };

  const filesToGenerate = [
    { tpl: 'CREWX.md.tpl', out: 'CREWX.md' },
    { tpl: 'crewx.yaml.tpl', out: 'crewx.yaml' },
    { tpl: 'env.slack.tpl', out: '.env.slack' },
    { tpl: 'slack-app-manifest.yaml.tpl', out: 'slack-app-manifest.yaml' },
    { tpl: 'crewx-manual.md.tpl', out: 'crewx-manual.md' },
    { tpl: 'start-slack.sh.tpl', out: 'start-slack.sh', makeExecutable: true },
    // { tpl: 'README.md.tpl', out: 'README.md' },
    // { tpl: 'gitignore.tpl', out: '.gitignore' },
  ];

  let createdCount = 0;

  for (const file of filesToGenerate) {
    const raw = await readTemplate(file.tpl);
    const content = Object.entries(replacements).reduce(
      (acc, [token, value]) => acc.replaceAll(token, value),
      raw
    );
    const destination = path.join(targetDir, file.out);
    const wrote = await writeFileIfMissing(destination, content);
    if (wrote) {
      createdCount += 1;
      formatOutput(`✅ Created ${path.relative(targetDir, destination)}`);
    }
    if (file.makeExecutable && wrote) {
      await fs.chmod(destination, 0o755);
    }
  }

  if (createdCount === 0) {
    console.log('ℹ️  No files were created (all already existed). Use --force to overwrite.');
    process.exit(0);
  }

  formatOutput('');
  formatOutput('🎉 CrewX quickstart is ready!');

  if (targetName !== '.') {
    const relativePath = path.relative(process.cwd(), targetDir) || '.';
    formatOutput(`📂 Project location: ${relativePath}`);
    formatOutput(`➡️  Next steps:\n   cd ${relativePath}\n   crewx q "@quickstart hi"`);
  } else {
    formatOutput('➡️  Next steps:\n   crewx q "@quickstart hi"');
  }

  formatOutput('\n✨ Optional: To set up the Slack bot:');
  formatOutput('   1. Create your Slack app at https://api.slack.com/apps?new_app=1');
  formatOutput('   2. Click "From a manifest" then paste the slack-app-manifest.yaml content');
  formatOutput('   3. Copy the tokens to .env.slack');
  formatOutput('   4. Customize crewx.yaml if needed');
  formatOutput('   5. Run ./start-slack.sh to launch the Slack bot');
}

main().catch((error) => {
  console.error(`❌ Failed to create quickstart: ${error.message}`);
  process.exit(1);
});
