import mongoose from 'mongoose';

const groupMemberSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    joined_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('GroupMember', groupMemberSchema);
