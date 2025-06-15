import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  login: string;
  password: string;
  role: string;
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'teacher' }
});

export default model<IUser>('User', UserSchema);