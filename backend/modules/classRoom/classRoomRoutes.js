const Router = require("express-promise-router");
const { createClass } = require("./classRoomController")

const routes = () => {
    const router = Router({ mergeParams: true });
    router.route("/class").post(createClass);
    return router;
}

module.exports = routes;