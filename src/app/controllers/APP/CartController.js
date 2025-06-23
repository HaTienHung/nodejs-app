import Cart from "../../models/Cart.js";
import Book from "../../models/Book.js";
import Order from "../../models/Order.js";
import OrderItem from "../../models/OrderItem.js";
import Export from "../../models/Export.js";
import Inventory from "../../models/Inventory.js";
import checkAvailableStock from "../../../helpers/checkAvailableStock.helper.js";

class CartController {
  // [GET] /api/app/cart
  async show(req, res) {
    try {
      const cart = await Cart.find({ user_id: req.user.id });

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json("Lỗi từ sever");
    }
  }
  // [DELETE] /api/app/remove-items
  async removeCartItems(req, res) {
    try {
      const { ids } = req.body; // Array of book IDs từ request body
      const user_id = req.user.id;

      const cart = await Cart.findOne({ user_id });

      if (!cart || !cart.items || !Array.isArray(cart.items)) {
        return res.status(400).json({
          message: "Sản phẩm trong giỏ hàng trống hoặc không hợp lệ !!!",
        });
      }
      // Check items có trong cart không
      const cartBookIds = cart.items.map((item) => item.book_id.toString());
      const notInCart = ids.filter((id) => !cartBookIds.includes(id));

      if (notInCart.length > 0) {
        return res.status(400).json({
          message: "Một số sản phẩm không có trong giỏ hàng",
          notInCart,
        });
      }

      await Cart.findOneAndUpdate(
        { user_id },
        {
          $pull: {
            items: {
              book_id: { $in: ids }, // Xóa tất cả items có book_id trong array
            },
          },
          $set: { updatedAt: new Date() },
        },
        { new: true }
      );

      res.status(200).json({
        message: `Đã xóa ${ids.length} sản phẩm khỏi giỏ hàng`,
        removedIds: ids,
      });
    } catch (error) {
      console.error("Xoá sản phẩm khỏi giỏ hàng thất bại:", error);
      res.status(500).json({ message: "Lỗi từ server" });
    }
  }
  // [PUT] /api/app/cart/:id/update-item
  async updateCartItem(req, res) {
    try {
      const book_id = req.params.id; // Array of book IDs từ request body
      const user_id = req.user.id;

      await checkAvailableStock(book_id, req.body.quantity);

      const cart = await Cart.findOne({ user_id });

      if (!cart || !cart.items || !Array.isArray(cart.items)) {
        return res.status(400).json({
          message: "Sản phẩm trong giỏ hàng trống hoặc không hợp lệ !!!",
        });
      }
      // Check items có trong cart không
      const cartBookIds = cart.items.map((item) => item.book_id.toString());

      if (!cartBookIds.includes(book_id)) {
        return res.status(404).json({
          message: "Sản phẩm không có trong giỏ hàng",
        });
      }

      await Cart.findOneAndUpdate(
        {
          user_id,
          "items.book_id": book_id, // Tìm cart có item với book_id này
        },
        {
          $set: {
            "items.$.quantity": req.body.quantity, // Update quantity của item đó
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      res.status(200).json({
        message: `Cập nhật số lượng sản phẩm trong giỏ hàng thành công`,
      });
    } catch (err) {
      res.status(500).json({
        message: "Không thể cập nhật giỏ hàng",
        error: err.message,
      });
    }
  }
  // [POST] /api/app/add-to-cart
  async addToCart(req, res) {
    try {
      const { book_id, quantity } = req.body;
      const user_id = req.user.id;

      if (!book_id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ." });
      }

      // Kiểm tra tồn kho trước
      await checkAvailableStock(book_id, quantity);

      // Tìm giỏ hàng của user
      let cart = await Cart.findOne({ user_id });

      if (!cart) {
        cart = new Cart({ user_id, items: [] });
      }

      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existingItem = cart.items.find(
        (item) => item.book_id.toString() === book_id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const product = await Book.findById(book_id);
        if (!product) {
          return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
        }

        cart.items.push({
          book_id,
          quantity,
          price: product.price,
        });
      }

      cart.updatedAt = new Date();
      await cart.save();

      res.status(200).json({
        message: "Thêm vào giỏ hàng thành công",
        cart,
      });
    } catch (err) {
      res.status(500).json({
        message: "Không thể thêm vào giỏ hàng",
        error: err.message,
      });
    }
  }

  // [POST] /api/app/check-out
  async checkout(req, res) {
    try {
      const { ids, shippingAddress, paymentMethod } = req.body;
      const userId = req.user.id;

      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("Danh sách sản phẩm không được để trống");
      }

      const cart = await Cart.findOne({ user_id: userId });
      if (!cart) throw new Error("Không tìm thấy giỏ hàng");

      const selectedItems = cart.items.filter((item) =>
        ids.includes(item.book_id.toString())
      );

      if (selectedItems.length === 0) {
        throw new Error("Không tìm thấy sản phẩm phù hợp trong giỏ hàng");
      }

      let totalPrice = 0;
      const orderItems = [];

      for (const item of selectedItems) {
        const { book_id, quantity } = item;

        const book = await Book.findById(book_id);
        if (!book) throw new Error(`Không tìm thấy sách với ID ${book_id}`);

        // Kiểm tra tồn kho
        const isAvailable = await checkAvailabelStock(book_id, quantity);
        if (!isAvailable) {
          throw new Error(`Sách "${book.title}" không đủ tồn kho`);
        }

        // Ghi nhận export (xuất kho)
        await Export.create({ book_id, quantity });

        await Inventory.findOneAndUpdate(
          { book_id },
          { $inc: { currentStock: -quantity } },
          { new: true }
        );

        const subtotal = quantity * book.price;
        totalPrice += subtotal;

        orderItems.push({
          book_id: book._id,
          quantity,
          price: book.price,
          subtotal,
        });
      }

      // Tạo Order
      const order = await Order.create({
        user_id: userId,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      // Tạo các OrderItem
      for (const item of orderItems) {
        await OrderItem.create([
          {
            ...item,
            order_id: order._id,
          },
        ]);
      }

      // Xóa các item đã đặt khỏi giỏ hàng
      cart.items = cart.items.filter(
        (item) => !ids.includes(item.book_id.toString())
      );
      await cart.save();

      res.status(201).json({
        message: "Đặt hàng thành công",
        order,
        items: orderItems,
      });
    } catch (err) {
      res.status(500).json({
        message: "Đặt hàng thất bại",
        error: err.message,
      });
    }
  }
}

export default new CartController();
