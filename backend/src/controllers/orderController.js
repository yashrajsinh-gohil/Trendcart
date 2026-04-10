import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one product',
      });
    }

    const orderProducts = [];
    const decrementedProducts = [];
    let calculatedTotal = 0;

    // Validate stock and atomically decrement for each ordered product.
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        for (const decremented of decrementedProducts) {
          await Product.findByIdAndUpdate(decremented.productId, {
            $inc: { stock: decremented.quantity },
          });
        }

        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        for (const decremented of decrementedProducts) {
          await Product.findByIdAndUpdate(decremented.productId, {
            $inc: { stock: decremented.quantity },
          });
        }

        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product: ${product.name}`,
        });
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Roll back stock already decremented in this request.
        for (const decremented of decrementedProducts) {
          await Product.findByIdAndUpdate(decremented.productId, {
            $inc: { stock: decremented.quantity },
          });
        }

        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`,
        });
      }

      decrementedProducts.push({ productId: product._id, quantity });

      const itemPrice = product.price;
      calculatedTotal += itemPrice * quantity;
      orderProducts.push({
        product: product._id,
        quantity,
        price: itemPrice,
      });
    }

    let order;
    try {
      order = await Order.create({
        user: req.user.id,
        products: orderProducts,
        total: calculatedTotal,
        status: 'pending',
      });
    } catch (createError) {
      for (const decremented of decrementedProducts) {
        await Product.findByIdAndUpdate(decremented.productId, {
          $inc: { stock: decremented.quantity },
        });
      }
      throw createError;
    }

    await order.populate('user', 'name email role');
    await order.populate('products.product', 'name price image');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email role')
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/user/my-orders
// @access  Private
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email role phone address city state postalCode')
      .populate('products.product', 'name price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order or is admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (status) order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Allow admins to cancel any order; regular users can cancel only their own.
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (order.status === 'cancelled' || order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending or confirmed orders',
      });
    }

    // Restore product stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
