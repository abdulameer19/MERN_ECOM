"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserErrors = exports.ProductErrors = void 0;
var ProductErrors;
(function (ProductErrors) {
    ProductErrors["NO_USERS_FOUND"] = "no-users-found";
    ProductErrors["NO_PRODUCT_FOUND"] = "no-product-found";
    ProductErrors["NO_AVAILABLE_MONEY"] = "no-available-money";
    ProductErrors["NOT_ENOUGH_STOCK"] = "not-enough-stock";
})(ProductErrors || (exports.ProductErrors = ProductErrors = {}));
var UserErrors;
(function (UserErrors) {
    UserErrors["NO_USER_FOUND"] = "no-user-found";
    UserErrors["WRONG_CREDENTIALS"] = "wrong-credentials";
    UserErrors["USERNAME_ALREADY_EXISTS"] = "username-already-exists";
})(UserErrors || (exports.UserErrors = UserErrors = {}));
