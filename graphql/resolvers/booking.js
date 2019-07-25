const Event = require('../../models/events')
const Booking = require('../../models/booking');
const { transformBooking , transformEvent } = require('./merge')


module.exports = {

    bookings: async (req) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated')
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },

    bookEvent: async (args , req) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated')
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },

    cancelBooking: async (args , req) => {
        if (!req.isAuth){
            throw new Error('Unauthenticated')
        }
        try {
            const _booking = await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(_booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (error) {
            throw error;
        }
    }
}
