import express from 'express';
import { getContent, updateContent, uploadImage, deleteImage } from '../controllers/content.controller';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'public/uploads/' });

router.get('/', getContent);
router.post('/', updateContent);
router.post('/upload-image', upload.single('image'), uploadImage);
router.delete('/delete-image', deleteImage);

export default router;