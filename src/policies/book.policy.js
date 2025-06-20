import { ROLE_NAME } from "../constants/role.js";

function canActOnBook(user, book) {
  if (user.role?.name === ROLE_NAME.ADMIN) return true;

  return (
    user.role?.name === ROLE_NAME.PUBLISHER &&
    book.publisher_id.equals(user.publisher?._id)
  );
}
export const BookPolicy = {
  canUpdate(user, book) {
    return canActOnBook(user, book);
  },

  canDelete(user, books) {
    return books.every((book) => canActOnBook(user, book));
  },

  canRestore(user, books) {
    return books.every((book) => canActOnBook(user, book));
  },
};
