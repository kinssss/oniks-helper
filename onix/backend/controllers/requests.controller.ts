import { Request, Response } from 'express';
import RequestModel from '../models/Request';
import { Types } from 'mongoose';

interface IRequest {
  studentName: string;
  phone: string;
  group?: string;
  district?: string;
  birthDate?: Date;
  requestType: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: any;
  missingFields?: string[];
  details?: string;
}

export const getRequests = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { status } = req.query;
    
    const filter: any = {};
    if (status) filter.status = status;

    const requests = await RequestModel
      .find(filter)
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    res.json({
      success: true,
      data: requests
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching requests:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

export const getRequestById = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid request ID format'
      });
    }

    const request = await RequestModel.findById(id).select('-__v').lean();

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Request not found'
      });
    }

    res.json({ 
      success: true, 
      data: request 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching request:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

export const createRequest = async (req: Request<{}, {}, IRequest>, res: Response<ApiResponse>) => {
  try {
    const { studentName, phone, group, district, birthDate, requestType } = req.body;

    // Валидация обязательных полей
    const requiredFields: (keyof IRequest)[] = ['studentName', 'phone', 'requestType'];
    const missingFields = requiredFields.filter(field => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'Missing required fields',
        missingFields
      });
    }

    // Преобразование даты (если передана)
    let parsedBirthDate: Date | undefined;
    if (birthDate) {
      parsedBirthDate = new Date(birthDate);
      if (isNaN(parsedBirthDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_DATE',
          message: 'Invalid birth date format'
        });
      }
    }

    const newRequest = new RequestModel({
      studentName,
      phone,
      group,
      district,
      birthDate: parsedBirthDate,
      requestType,
      status: 'pending'
    });

    console.log('Saving request:', newRequest); // Логирование перед сохранением

    const savedRequest = await newRequest.save();
    const responseData = savedRequest.toObject();
    delete (responseData as Partial<typeof responseData>).__v;

    res.status(201).json({
      success: true,
      data: responseData
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating request:', error);
    
    // Добавим больше информации об ошибке
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to create request',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

export const updateRequest = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid request ID format'
      });
    }

    // Запрещаем обновление некоторых полей
    if (updateData._id || updateData.createdAt) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_UPDATE',
        message: 'Cannot update protected fields'
      });
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      data: updatedRequest
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating request:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to update request',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

export const deleteRequest = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_ID',
        message: 'Invalid request ID format'
      });
    }

    const deletedRequest = await RequestModel.findByIdAndDelete(id).select('-__v');

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request deleted successfully',
      data: deletedRequest
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting request:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to delete request',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};