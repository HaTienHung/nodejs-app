import Book from "../../models/Book.js";
import Rating from "../../models/Rating.js";
import mongoose from "mongoose";

class RatingController {
  // [POST] api/app/rating
  async addOrUpdateRating(req, res) {
    const { book_id, rating } = req.validated;
    await Rating.findOneAndUpdate(
      { book_id, user_id: req.user.id },
      { rating, createdAt: new Date() },
      { upsert: true }
    );

    // Tính lại average cho book

    await recalculateBookRating(book_id);

    return res.status(200).json({ message: "Đánh giá thành công" });
  }
  catch(err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi đánh giá sách" });
  }
}

async function recalculateBookRating(book_id) {
  const stats = await Rating.aggregate([
    { $match: { book_id: new mongoose.Types.ObjectId(book_id) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const { averageRating = 0, count = 0 } = stats[0] || {};
  console.log(stats);

  await Book.findByIdAndUpdate(book_id, {
    averageRating: Math.round(averageRating * 10) / 10,
    ratingCount: count,
  });
}
export default new RatingController();
