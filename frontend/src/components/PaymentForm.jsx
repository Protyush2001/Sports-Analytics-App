import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = ({ role, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    const { data } = await axios.post('http://localhost:3026/api/payment/create-payment-intent', { role });
    const clientSecret = data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.paymentIntent.status === 'succeeded') {
      onPaymentSuccess(); // Trigger signup
    } else {
      alert('Payment failed');
    }
  };

  return (
    <div>
      <CardElement />
      <button onClick={handlePayment}>Pay & Register</button>
    </div>
  );
};

export default PaymentForm;