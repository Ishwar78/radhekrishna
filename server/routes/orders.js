import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import { isValidObjectId } from '../utils/validation.js';
import { sendEmail, getOrderPlacedEmailTemplate, getOrderConfirmedEmailTemplate, getOrderShippedEmailTemplate, getOrderDeliveredEmailTemplate } from '../utils/emailService.js';

const router = express.Router();

// Create new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    // Fetch user data for email
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = new Order({
      userId: req.user._id,
      items: items.map(item => ({
        productId: item.productId || null,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size,
        color: item.color,
        sku: item.sku
      })),
      totalAmount,
      shippingAddress: {
        name: shippingAddress?.name || '',
        street: shippingAddress?.street || shippingAddress?.address || '',
        city: shippingAddress?.city || '',
        state: shippingAddress?.state || '',
        zipCode: shippingAddress?.zipCode || shippingAddress?.pincode || '',
        country: shippingAddress?.country || 'India',
        phone: shippingAddress?.phone || ''
      },
      paymentMethod,
      paymentDetails: paymentDetails || undefined,
      notes,
      status: 'confirmed'
    });

    await order.save();

    // Send order placed email
    try {
      const emailTemplate = getOrderPlacedEmailTemplate(user.name, order._id, totalAmount, order.items);
      const emailResult = await sendEmail(user.email, '🎉 Order Placed Successfully - ShreeradheKrishnacollection', emailTemplate);
      if (emailResult.success) {
        console.log('✅ Order placed email sent to:', user.email);
      } else {
        console.warn('⚠️ Failed to send order email:', emailResult.error);
      }
    } catch (emailError) {
      console.warn('⚠️ Error sending order email:', emailError.message);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders for the current user
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      total: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by tracking ID (public endpoint)
router.get('/track/:trackingId', async (req, res) => {
  try {
    const order = await Order.findOne({ trackingId: req.params.trackingId })
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name price image');

    if (!order) {
      return res.status(404).json({ error: 'Order not found with this tracking ID' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order by tracking ID:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name price image');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is the owner of the order or an admin
    if (order.userId._id.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - Admin only' });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Send status update email
    try {
      const userData = order.userId;
      if (userData && userData.email) {
        let emailTemplate;
        let emailSubject;

        if (status === 'confirmed') {
          emailTemplate = getOrderConfirmedEmailTemplate(userData.name, order._id, order.totalAmount);
          emailSubject = '✓ Order Confirmed - ShreeradheKrishnacollection';
        } else if (status === 'shipped') {
          emailTemplate = getOrderShippedEmailTemplate(userData.name, order._id, order.trackingId || order._id, 'Standard Shipping');
          emailSubject = '🚚 Your Order Has Shipped - ShreeradheKrishnacollection';
        } else if (status === 'delivered') {
          emailTemplate = getOrderDeliveredEmailTemplate(userData.name, order._id);
          emailSubject = '✓ Your Order Has Been Delivered - ShreeradheKrishnacollection';
        }

        if (emailTemplate) {
          await sendEmail(userData.email, emailSubject, emailTemplate);
          console.log(`✅ Order ${status} email sent to:`, userData.email);
        }
      }
    } catch (emailError) {
      console.warn('⚠️ Failed to send status update email:', emailError.message);
      // Don't fail the order update if email fails
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order (user can only delete their own orders, admin can delete any)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is the owner or admin
    if (order.userId.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
