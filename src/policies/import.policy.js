import { ROLE_NAME } from "../constants/role.js";

function canActOnBook(user, book) {
  console.log(user.role?.name);

  if (user.role?.name === ROLE_NAME.ADMIN) return true;

  return (
    user.role?.name === ROLE_NAME.PUBLISHER &&
    book.publisher_id.equals(user.publisher?._id)
  );
}
export const ImportPolicy = {
  canImport(user, book) {
    return canActOnBook(user, book);
  },
  canExport(user, book) {
    return canActOnBook(user, book);
  },
};
