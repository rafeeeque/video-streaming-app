import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    filename: String,
    path: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Video', videoSchema);
