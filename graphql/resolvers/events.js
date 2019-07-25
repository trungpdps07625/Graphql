const Event = require('../../models/events');
const { transformEvent } = require('./merge')

module.exports = {

    events: async () => {
        try {
            const _events = await Event.find()
            return _events
                .map(event => {
                    return transformEvent(event);
                })
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5d303110fabde701d5ba6fd5'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById('5d303110fabde701d5ba6fd5');

            if (!creator) {
                throw new Error('User exists already')
            }
            creator.createEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            throw err;
        }
    },
}
