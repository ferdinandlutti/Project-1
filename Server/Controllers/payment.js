const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const create_checkout_session = async (req, res) => {
  try {
    // Extract class details from the request body
    const { classId, title, description, price } = req.body;

    // Validate input
    if (!classId || !title || !price) {
      return res.status(400).send({
        ok: false,
        message: "Missing required class booking details",
      });
    }

    // Prepare the line item for Stripe
    const lineItem = {
      price_data: {
        currency: process.env.CURRENCY,
        unit_amount: price * 100, // Convert price to cents
        product_data: {
          name: title,
          description: description,
          // Optionally include an image: images: [imageUrl]
        },
      },
      quantity: 1, // Booking one class at a time
    };

    // Create a checkout session in Stripe
    debugger;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: process.env.PAYMENT_METHODS.split(", "),
      line_items: [lineItem],
      mode: "payment",
      success_url: `${process.env.DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/booking/cancel`,
    });

    // Respond with session ID
    return res.send({ ok: true, sessionId: session.id });
  } catch (error) {
    console.error("ERROR =====>", error.message);
    return res.status(500).send({ ok: false, message: error.message });
  }
};
const checkout_session = async (req, res) => {
  try {
    debugger;
    const { sessionId } = req.query;
    // 15. We execute request to Stripe to get data for the specific session ID
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });
    console.log(session);
    // 16. From the session received above we get customer info
    const customer = await stripe.customers.retrieve(session.customer.id);
    // 17. And sending both session and customer to the client
    return res.send({ ok: true, session, customer });
  } catch (error) {
    console.log("ERROR =====>", error);
    return res.send({ ok: false, message: error });
  }
};
module.exports = {
  create_checkout_session,
  checkout_session,
};
