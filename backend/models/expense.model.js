import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    description: {
        type: String
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    paid_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    split_among: [ // Usuarios entre los que se divide el gasto
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    state: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    }
}, {
    timestamps: true
});

export default mongoose.model('Expense', expenseSchema);
