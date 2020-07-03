const axios = require('axios');
const User = require('../models/User');
const kayn = require('../kayn_api')

module.exports = {
    async index(req, res){
        const { userid } = req.headers;

        const user_obj = await User.findById(userid);
        
        if(!user_obj)
            return res.status(404).json({error: 'User not exist '})

        const users = await User.find({
            $and: [
                { _id: { $ne: user_obj } },
                { _id: { $nin: user_obj.likes } },
                { _id: { $nin: user_obj.dislikes } }, 
            ],
        })
        return res.json(users);
    },


    async store(req, res) {
        const { username, summonerName } = req.body;

        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.json(userExists);
        }

        //--------------------------------------
        //Riot API
        const { id, name, profileIconId, summonerLevel } = await kayn.Summoner.by.name(summonerName)
        const league = await kayn.League.Entries.by.summonerID(id)

        league.map(({queueType,tier,rank}) => ({queueType,tier,rank}))

        //const response = await axios.get(`https://api.github.com/users/${username}`);
        //const { name, bio, avatar_url: avatar } = response.data;

        const user = await User.create({
            username,
            summonerName: name,
            profileIconId,
            summonerLevel,
            league
        })

        console.log(user)

        return res.json(user);
    }
};