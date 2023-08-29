import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileImage = (req, res) => {
  const { folder, file } = req.params;
  const allowedFolders = ['cursos', 'usuarios', 'recursos'];

  if(!allowedFolders.includes(folder)) {
    return res.status(400).json({ error: 'Ruta de imagen no encontrada' });
  }

  const filePath = path.join(__dirname, `../../../src/infraestructure/storage/local/${folder}/${file}`);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'No se encontró el archivo' });
  } else {
    if (folder == 'recursos') {
      res.setHeader('Content-Type', 'application/pdf');      
    }

    res.sendFile(filePath);
  }
};

export { fileImage };
