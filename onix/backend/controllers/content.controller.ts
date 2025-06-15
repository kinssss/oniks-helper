import { Request, Response } from 'express';
import ContentModel from '../models/Content';
import path from 'path';
import fs from 'fs';

export const getContent = async (_req: Request, res: Response) => {
  try {
    const content = await ContentModel
      .findOne()
      .sort({ updatedAt: -1 })
      .lean();

    res.json(content || { 
      initialMessage: '',
      keywordGroups: [], 
      responses: {},
      ticketForm: {},
      buttons: {},
      images: [] 
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      message: 'Error loading content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const { initialMessage, keywordGroups, responses, ticketForm, buttons } = req.body;

    if (typeof initialMessage !== 'string') {
      return res.status(400).json({ 
        message: 'Initial message is required and must be a string'
      });
    }

    const newContent = new ContentModel({ 
      initialMessage,
      keywordGroups: keywordGroups || [],
      responses: responses || {},
      ticketForm: ticketForm || {},
      buttons: buttons || {}
    });
    await newContent.save();

    res.json({ 
      success: true,
      message: 'Content saved successfully',
      updatedAt: newContent.updatedAt
    });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ 
      message: 'Error saving content',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Используем абсолютный URL для изображения
    const imageUrl = `${process.env.BASE_URL || 'http://localhost:5001'}/uploads/${req.file.filename}`;
    
    res.json({ 
      success: true,
      imageUrl, // Возвращаем полный URL
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Image upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const filename = path.basename(imageUrl.split('?')[0]); 
    const filePath = path.join(__dirname, '../../public/uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await ContentModel.updateOne(
      {},
      { $pull: { images: imageUrl } }
    );

    res.json({ 
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ 
      error: 'Failed to delete image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};