import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    state: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Plan', planSchema);
