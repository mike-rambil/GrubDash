# Restaurant Management API

This project implements a Restaurant Management API with features for managing dishes and orders. It allows you to create, read, update, and list dishes, as well as create, read, update, delete, and list orders.

## Features

### Dishes Management

1. **Create Dishes**
   - In the `src/dishes/dishes.controller.js` file, handlers and middleware functions are added to create dishes.
   - The `POST` request to `/dishes` is used to create new dishes.

2. **Read Dishes**
   - In the `src/dishes/dishes.controller.js` file, handlers and middleware functions are added to read dishes.
   - The `GET` request to `/dishes` is used to list all dishes.
   - The `GET` request to `/dishes/:dishId` is used to read a specific dish.

3. **Update Dishes**
   - In the `src/dishes/dishes.controller.js` file, handlers and middleware functions are added to update dishes.
   - The `PUT` request to `/dishes/:dishId` is used to update a specific dish.

### Orders Management

1. **Create Orders**
   - In the `src/orders/orders.controller.js` file, handlers and middleware functions are added to create orders.
   - The `POST` request to `/orders` is used to create new orders.

2. **Read Orders**
   - In the `src/orders/orders.controller.js` file, handlers and middleware functions are added to read orders.
   - The `GET` request to `/orders` is used to list all orders.
   - The `GET` request to `/orders/:orderId` is used to read a specific order.

3. **Update Orders**
   - In the `src/orders/orders.controller.js` file, handlers and middleware functions are added to update orders.
   - The `PUT` request to `/orders/:orderId` is used to update a specific order.

4. **Delete Orders**
   - In the `src/orders/orders.controller.js` file, handlers and middleware functions are added to delete orders.
   - The `DELETE` request to `/orders/:orderId` is used to delete a specific order.
