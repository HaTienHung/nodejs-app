import User from "../../models/User.js";

class UserController {
  // // [GET]  api/users
  // async index(req, res) {
  //   try {
  //     const users = await User.find({});
  //     res.json(users);
  //   } catch (err) {
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }
  // [GET]  api/users/me
  //   async show(req, res) {
  //     try {
  //       const users = await User.find({});
  //       res.json(users);
  //     } catch (err) {
  //       res.status(500).json({ error: "Internal server error" });
  //     }
  //   }
  //   // [POST]  api/users/store
  //   async store(req, res) {
  //     console.log("[Validated]", req.validated);
  //     const { name, email, phone_number, password, age, address } = req.validated;
  //
  //     console.log(name);
  //
  //     // Field "is_admin", "role_id", ... sẽ không bao giờ lọt vào đây
  //     const user = await User.create(req.validated);
  //
  //     res.status(201).json(user);
  //   }
  // [PUT]  api/users/update/:id
  async update(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      // It's not neccessary because we validated in middleware so the id field must be exisist in our users table
      if (!user) {
        return res.status(404).send("User not found");
      }

      user.set(req.body); // cập nhật các trường, kể cả name

      await user.save(); // trigger hook

      // res.redirect("/me/stored/user");
      res.json("Successfully");
    } catch (error) {
      console.error("Update failed", error);
      res.status(500).send("Internal server error");
    }
  }
  // [DELETE]  api/users/delete/:id
  async delete(req, res) {
    try {
      await User.delete({ _id: req.params.id });
      res.json("Successfully");
      // res.redirect("/me/stored/courses");
    } catch (error) {
      console.error("Failed");
    }
    // res.json(req.body);
  }
  // [POST]  api/users/restore/:id
  async restore(req, res) {
    try {
      await User.restore({ _id: req.params.id });
      res.json("Successfully");
      // res.redirect("/me/stored/courses");
    } catch (error) {
      console.error("Failed");
    }
    // res.json(req.body);
  }
}

export default new UserController();
