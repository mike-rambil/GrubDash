const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function bodyHasNameProperty(req, res, next) {
  const { data = {} } = req.body;

  if (!data.name) {
    next({
      status: 400,
      message: "Dish must include a name.",
    });
  }
  res.locals.myData = data;
  return next();
}

function bodyHasDescriptionProperty(req, res, next) {
  const myData = res.locals.myData;

  if (!myData.description) {
    next({
      status: 400,
      message: "Dish must include a description.",
    });
  }

  return next();
}

function bodyHasPriceProperty(req, res, next) {
  const myData = res.locals.myData;

  if (!myData.price || myData.price < 0 || typeof myData.price !== "number") {
    next({
      status: 400,
      message:
        "Dish must include a price and it must be an integer greater than 0.",
    });
  }

  return next();
}

function bodyHasImageUrlProperty(req, res, next) {
  const myData = res.locals.myData;

  if (!myData["image_url"]) {
    next({
      status: 400,
      message: "Dish must include a image_url",
    });
  }

  return next();
}

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (foundDish) {
    res.locals.foundDish = foundDish;
    res.locals.dishId = dishId;
    return next();
  }

  next({
    status: 404,
    message: `Dish does not exist: ${dishId}.`,
  });
}

function bodyIdMatchesRouteId(req, res, next) {
  const dishId = res.locals.dishId;
  const myData = res.locals.myData;

  if (myData.id) {
    if (myData.id === dishId) {
      return next();
    }

    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${myData.id}, Route: ${dishId}`,
    });
  }

  return next();
}

function update(req, res) {
  const foundDish = res.locals.foundDish;
  const myData = res.locals.myData;

  const Properties = Object.getOwnPropertyNames(foundDish);

  for (let i = 0; i < Properties.length; i++) {
    let propName = Properties[i];
    if (foundDish[propName] !== myData[propName]) {
      foundDish[propName] = myData[propName];
    }
  }
  res.json({ data: foundDish });
}

function create(req, res) {
  const myData = res.locals.myData;
  const newDish = {
    ...myData,
    id: nextId(),
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res) {
  res.json({ data: res.locals.foundDish });
}

function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
  create: [
    bodyHasNameProperty,
    bodyHasDescriptionProperty,
    bodyHasPriceProperty,
    bodyHasImageUrlProperty,
    create,
  ],
  read: [dishExists, read],
  update: [
    dishExists,
    bodyHasNameProperty,
    bodyHasDescriptionProperty,
    bodyHasPriceProperty,
    bodyHasImageUrlProperty,
    bodyIdMatchesRouteId,
    update,
  ],
  list,
};