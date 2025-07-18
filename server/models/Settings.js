import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const SettingsSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    queryInterval: {
        type: Number,
        default: 60,
    },
    port: {
        type: Number,
        default: 5000,
    },
    workingHoursFrom: {
        type: String,
        default: '09:00',
    },
    workingHoursTo: {
        type: String,
        default: '17:00',
    },
});

export default mongoose.model('Settings', SettingsSchema);
