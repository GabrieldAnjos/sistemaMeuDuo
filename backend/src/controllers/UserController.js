const User = require('../models/User');
const kayn = require('../services/kayn_api')
const bcrypt= require('bcryptjs');

module.exports = {
    async index(req, res){
        const user  = req.userId;   

        const user_obj = await User.findById(user);
        
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
        const { username, summonerName, password } = req.body;

        const userExists = await User.findOne({ username });

        if (userExists) {
            console.log('User already exists');
            return res.json(userExists);
        }

        //--------------------------------------
        //Riot API
        const { id, name, profileIconId, summonerLevel } = await kayn.Summoner.by.name(summonerName)
        const league = await kayn.League.Entries.by.summonerID(id)

        league.map(({queueType,tier,rank}) => ({queueType,tier,rank}))

        //const response = await axios.get(`https://api.github.com/users/${username}`);
        //const { name, bio, avatar_url: avatar } = response.data;

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hash,
            summonerName: name,
            profileIconId,
            summonerLevel,
            league
        })


        return res.json(user);
    }
};