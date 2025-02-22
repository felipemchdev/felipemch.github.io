import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = {
    description: "My octo projects",
    githubUsername: "octocat",
    avatarUrl: "",
    displayName: "",
    email: "",
    socials: {}
};

(async () => {
    dotenv.config({ path: path.join(process.cwd(), '.env') });
    dotenv.config({ path: path.join(process.cwd(), '.env.local') });

    if (!process.env.GH_TOKEN) {
        throw new Error('Please set GH_TOKEN in .env or .env.local');
    }
    if (process.env.IS_TEMPLATE === 'false') {
        // Se não for o template, interrompe o processo.
        return;
    }

    // Carregar o data.json de forma segura
    const dataPath = path.join(process.cwd(), 'data.json');
    let dataJson = {};

    try {
        const dataFile = await fs.readFile(dataPath, 'utf-8');
        dataJson = JSON.parse(dataFile);
    } catch (error) {
        console.error('Erro ao carregar data.json:', error);
        return;
    }

    if (dataJson.githubUsername !== 'jirihofman') {
        // Se não for o template, interrompe o processo.
        return;
    }

    console.log('⚠️  Este ainda é um template. Por favor, atualize o arquivo data.json e defina IS_TEMPLATE como false no .env.local para usar este template.');
    console.log('⚙️  Revertendo dados pessoais para dados do template...');

    // Remover favicon.ico
    const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');
    try {
        await fs.unlink(faviconPath);
        console.log('⚙️  Favicon.ico removido');
    } catch (error) {
        console.warn('⚠️  Não foi possível remover favicon.ico:', error.message);
    }

    // Mescla os dados e grava no data.json
    const newData = { ...dataJson, ...data };
    await fs.writeFile(dataPath, JSON.stringify(newData, null, 4));

    console.log('⚙️  Revertido para dados do template (usando octocat).');
})();
