import { Request, Response } from 'express';
import UserModel from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    const user = await UserModel.findOne({ 
      login: login.trim(),
      password: password.trim() 
    }).select('-password -__v');

    if (!user) {
      return res.status(401)
        .header('Cache-Control', 'no-store, must-revalidate')
        .json({ message: 'Неверный логин или пароль' });
    }

    res.status(200)
      .header('Cache-Control', 'no-store, no-cache, must-revalidate')
      .header('Pragma', 'no-cache')
      .json({
        role: user.role,
        userId: user._id,
        message: 'Авторизация успешна'
      });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500)
      .header('Cache-Control', 'no-store')
      .json({ message: 'Ошибка сервера' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { login, password, role } = req.body;

    const existingUser = await UserModel.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    const newUser = new UserModel({ login, password, role });
    await newUser.save();

    res.status(201).json({ 
      message: 'Пользователь создан',
      userId: newUser._id
    });

  } catch (error) {
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
};