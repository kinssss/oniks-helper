import { Request, Response } from 'express';
import UserModel from '../models/User';
import axios from 'axios';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select('-password -__v');
    res.status(200).json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Get users error:', error.message);
      res.status(500).json({ message: 'Ошибка при получении пользователей', error: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ message: 'Неизвестная ошибка при получении пользователей' });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, login, password } = req.body;
    const newUser = new UserModel({ fullName, login, password, role: 'teacher' });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Create user error:', error.message);
      res.status(500).json({ message: 'Ошибка при создании пользователя', error: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ message: 'Неизвестная ошибка при создании пользователя' });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, login, password } = req.body;
    
    const user = await UserModel.findByIdAndUpdate(
      id,
      { fullName, login, password },
      { new: true }
    ).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Update user error:', error.message);
      res.status(500).json({ message: 'Ошибка при обновлении пользователя', error: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ message: 'Неизвестная ошибка при обновлении пользователя' });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.status(200).json({ message: 'Пользователь удален' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Delete user error:', error.message);
      res.status(500).json({ message: 'Ошибка при удалении пользователя', error: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ message: 'Неизвестная ошибка при удалении пользователя' });
    }
  }
};

export const importUsersFromGoogleSheets = async (req: Request, res: Response) => {
  try {
    
    const { sheetId, gid } = req.body;
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    
    console.log('Fetching data from:', url); // Логирование для отладки
    
    const response = await axios.get(url);
    const rows = response.data.split('\n').map((row: string) => row.split(','));
    
    const results = [];
    for (const row of rows) {
      if (row.length < 3) continue;
      
      const [fullName, login, password] = row;
      if (!fullName || !login || !password) continue;
      
      try {
        const existingUser = await UserModel.findOne({ login });
        if (!existingUser) {
          const newUser = new UserModel({
            fullName,
            login,
            password,
            role: 'teacher'
          });
          await newUser.save();
          results.push(`Добавлен: ${fullName} (${login})`);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        results.push(`Ошибка: ${login} - ${errorMessage}`);
      }
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Импорт завершен',
      details: results 
    });
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Import error:', error.message);
      res.status(400).json({ 
        success: false,
        message: 'Ошибка при импорте из Google Sheets',
        error: error.message 
      });
    } else {
      console.error('Unknown import error:', error);
      res.status(400).json({ 
        success: false,
        message: 'Неизвестная ошибка при импорте из Google Sheets'
      });
    }
  }
};