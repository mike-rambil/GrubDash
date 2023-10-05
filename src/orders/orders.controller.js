const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass


function bodyHasDeliverToProperty(req, res, next) {
  const { data = {} } = req.body;

  if (!data.deliverTo) {
    next({
      status: 400,
      message: "Order must include a deliverTo property.",
    });
  }
  res.locals.myData = data;
  return next();
}


function bodyHasMobileNumProperty(req, res, next) {
  const myData = res.locals.myData;

  if (!myData.mobileNumber) {
    next({
      status: 400,
      message: "Order must include a mobileNumber property.",
    });
  }

  return next();
}


function bodyHasDishesProperty(req, res, next) {
  const myData = res.locals.myData;

  if (!myData.dishes || !myData.dishes.length || !Array.isArray(myData.dishes)) {
    next({
      status: 400,
      message: "Order must include at least one dish.",
    });
  }

  return next();
}


function bodyHasDishQuantityProperty(req, res, next) {
  const dishes = res.locals.myData.dishes;

  const invalidDishIndexes = [];
  
  dishes.forEach((dish, index) => {
    if (!dish.quantity || dish.quantity <= 0 || typeof dish.quantity !== "number") {
      invalidDishIndexes.push(index);
    }
  });
  
  if (invalidDishIndexes.length === 0) {
    return next();
  }

  const message =
    invalidDishIndexes.length > 1
      ? `Dishes ${invalidDishIndexes.join(", ")} must have a quantity that is an integer greater than 0.`
      : `Dish ${invalidDishIndexes[0]} must have a quantity that is an integer greater than 0.`;

  next({
    status: 400,
    message,
  });
}


function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    res.locals.orderId = orderId;
    return next();
  }
  next({
    status: 404,
    message: `No matching order is found for orderId ${orderId}.`,
  });
}

function bodyIdMatchesRouteId(req, res, next) {
  const orderId = res.locals.orderId;
  const myData = res.locals.myData;

  if (myData.id) {
    if (myData.id === orderId) {
      return next();
    }
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${myData.id}, Route: ${orderId}`,
    });
  }

  return next();
}

function bodyHasStatusProperty(req, res, next) {
  const myData = res.locals.myData;

  if (!myData.status || myData.status === "invalid") {
    next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, or delivered.",
    });
  }

  if (myData.status === "delivered") {
    next({
      status: 400,
      message: "A delivered order cannot be changed.",
    });
  }

  return next();
}

function orderStatusIsPending(req, res, next) {
  const order = res.locals.order;

  if (order.status !== "pending") {
    next({
      status: 400,
      message: "An order cannot be deleted unless it is pending.",
    });
  }

  return next();
}

function destroy(req, res) {
  const orderId = res.locals.orderId;
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  orders.splice(orderIndex, 1);
  res.sendStatus(204);
}

function update(req, res) {
  const myData = res.locals.myData;
  const order = res.locals.order;

  for (const propName in order) {
    if (propName !== "id" && order[propName] !== myData[propName]) {
      order[propName] = myData[propName];
    }
  }

  res.json({ data: order });
}


function read(req, res) {
  res.json({ data: res.locals.order });
}

function create(req, res) {
  const myData = res.locals.myData;
  const newOrder = {
    ...myData,
    id: nextId(),
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function list(req, res) {
  res.json({ data: orders });
}

module.exports = {
  create: [
    bodyHasDeliverToProperty,
    bodyHasMobileNumProperty,
    bodyHasDishesProperty,
    bodyHasDishQuantityProperty,
    create,
  ],
  read: [orderExists, read],
  update: [
    orderExists,
    bodyHasDeliverToProperty,
    bodyHasMobileNumProperty,
    bodyHasDishesProperty,
    bodyHasDishQuantityProperty,
    bodyIdMatchesRouteId,
    bodyHasStatusProperty,
    update,
  ],
  delete: [orderExists, orderStatusIsPending, destroy],
  list,
};


