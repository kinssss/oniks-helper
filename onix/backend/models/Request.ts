import { Schema, model, Document } from 'mongoose';

export interface IRequest extends Document {
  studentName: string;
  phone: string;
  group: string;
  district: string;
  birthDate: Date;
  requestType: string;
  status: 'pending' | 'completed';
  createdAt: Date;
}

const RequestSchema = new Schema<IRequest>({
  studentName: { type: String, required: true },
  phone: { type: String, required: true },
  group: { type: String, required: true },
  district: { type: String, required: true },
  birthDate: { type: Date, required: true },
  requestType: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default model<IRequest>('Request', RequestSchema);