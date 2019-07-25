const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const User = await User.findOne({ email: args.userInput.email });
            if (user) {
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
}
