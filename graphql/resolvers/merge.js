const Event = require('../../models/events')
const User = require('../../models/user')
const { dateToString } = require('../../helper/date');

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createAt: dateToString(booking._doc.createAt),
        updateAt: dateToString(booking._doc.updateAt)
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({
            _id: {
                $in: eventIds
            }
        });
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: dateToString(event._doc.date),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const _event = await Event.findById(eventId);
        return transformEvent(_event);
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            createEvents: events.bind(this, user._doc.createEvents)
        };
    } catch (err) {
        throw err;
    }

}



exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;