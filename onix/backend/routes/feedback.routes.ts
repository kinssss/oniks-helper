import express from 'express';
import Feedback from '../models/Feedback';

const router = express.Router();

// Открытый доступ для отправки отзывов
router.post('/', async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    // Простая валидация (можно убрать, если не нужна)
    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Заполните все поля'
      });
    }

    const feedback = new Feedback({ name, phone, message });
    await feedback.save();

    res.status(201).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Ошибка при сохранении отзыва:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Открытый доступ для получения отзывов (если нужно)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Для пометки важным
router.patch('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isImportant: req.body.isImportant },
      { new: true }
    );
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Для массового удаления
router.delete('/', async (req, res) => {
  try {
    await Feedback.deleteMany({ _id: { $in: req.body.ids } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

export default router;