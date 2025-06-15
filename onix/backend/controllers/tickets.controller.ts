import { Request, Response } from 'express';
import TicketModel from '../models/Ticket';

export const getTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await TicketModel
      .find()
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(tickets);
  } catch (error) {
    console.error('Ошибка при получении тикетов:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { teacherName, cabinet, problem } = req.body;

    if (!teacherName || !cabinet || !problem) {
      return res.status(400).json({ 
        error: 'Все поля обязательны для заполнения'
      });
    }

    const newTicket = new TicketModel({ 
      teacherName,
      cabinet,
      problem,
      status: 'active'
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error('Ошибка создания тикета:', error);
    res.status(500).json({ 
      error: 'Не удалось создать тикет',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID тикета обязателен' });
    }

    if (!['active', 'in_progress', 'pending', 'completed'].includes(status)) {
      return res.status(400).json({ 
        error: 'Недопустимый статус',
        allowed: ['active', 'in_progress', 'pending', 'completed']
      });
    }

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ error: 'Тикет не найден' });
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error('Ошибка обновления тикета:', error);
    res.status(500).json({ 
      error: 'Не удалось обновить тикет',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Тикет не найден' });
    }
    res.json(ticket);
  } catch (error) {
    console.error('Ошибка при получении тикета:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
};