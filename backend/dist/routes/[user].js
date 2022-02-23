"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res) {
    res.status(200).json({
        message: req.params.user
    });
}
exports.default = default_1;
