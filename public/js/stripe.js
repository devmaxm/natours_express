/* eslint-disable */
import axios from 'axios';
import {showAlert} from './alerts';

const stripe = Stripe(process.env.STRIPE_PUBLISH_KEY);

export const bookTour = async tourId => {
    try {
        const session = await axios(`/api/bookings/checkout-session/${tourId}`);

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
