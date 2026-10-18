import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const envFilePath = path.join(rootDir, '.env');
const envExampleFilePath = path.join(rootDir, '.env.example');
const targetDir = path.join(rootDir, 'src', 'environments');
const targetFileProd = path.join(targetDir, 'environment.ts');
const targetFileDev = path.join(targetDir, 'environment.development.ts');

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const fileEnv = parseEnv(envFilePath);
const fallbackEnv = parseEnv(envExampleFilePath);

let apiUrl = process.env.API_URL || fileEnv.API_URL || fallbackEnv.API_URL || 'http://localhost:8080/';

if (!apiUrl.endsWith('/')) {
  apiUrl += '/';
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const generateContent = (isProd) => `// Este arquivo é gerado automaticamente pelo scripts/set-env.mjs
// Não edite este arquivo diretamente. Altere o arquivo .env na raiz do projeto.

export const environment = {
  production: ${isProd},
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(targetFileProd, generateContent(true), 'utf-8');
fs.writeFileSync(targetFileDev, generateContent(false), 'utf-8');

console.log(`[set-env] Arquivos de ambiente sincronizados com sucesso.`);
console.log(`[set-env] apiUrl: ${apiUrl}`);
