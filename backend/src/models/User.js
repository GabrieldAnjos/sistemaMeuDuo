const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    summonerName: {
        type: String,
        required: true,
    },
    profileIcon: Number,
    summonerLevel: Number,
    league: [
        {
            queueType: String,
            tier: String,
            rank: String,
        }
    ],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps:true,
});

module.exports = model('User', UserSchema);