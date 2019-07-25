const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const _user = await User.findOne({ email: args.userInput.email });
            if (_user) {
                throw new Error('User exists already')
            }
            const hashedpassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedpassword
            })
            const result = await user.save();
            return { ...result._doc, _id: result.id }
        } catch (err) {
            throw err;
        }
    },
    login: async ({email, password}) => {
        const _user = await User.findOne({email: email});
        if (!_user) {
            throw new Error('User does not exits!');
        }

        const isEqual = await bcrypt.compare(password, _user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!')
        }
        
        const token = jwt.sign({userId: _user.id, email: _user.email}, 'sometokenkey',{
            expiresIn: '1h'
        });
        return { userId: _user.id, token: token, tokenExpiration: 1};
    }
}
