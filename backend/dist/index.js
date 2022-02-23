"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const log4_1 = require("./lib/log4");
const fs_1 = require("fs");
const path_1 = require("path");
const app = (0, express_1.default)();
const routes = getRoutes('./routes').map(parseFile);
function getRoutes(dirPath, arrayOfFiles = []) {
    const files = (0, fs_1.readdirSync)(dirPath);
    files.forEach(function (file) {
        if ((0, fs_1.statSync)((0, path_1.join)(dirPath, file)).isDirectory()) {
            arrayOfFiles = getRoutes((0, path_1.join)(dirPath, file), arrayOfFiles);
        }
        else {
            arrayOfFiles.push((0, path_1.join)(__dirname, dirPath, file));
        }
    });
    return arrayOfFiles;
}
function parseFile(filePath) {
    const parsed = (0, path_1.parse)(filePath);
    const file = {
        path: (0, path_1.normalize)(parsed.dir.replace((0, path_1.join)(process.cwd(), 'routes'), '/')),
        name: parsed.name,
        run: require(filePath).default
    };
    file.path = file.path.replace(/\[(\w*)\]/, (_, name) => `:${name}`);
    file.name = file.name.replace(/\[(\w*)\]/, (_, name) => `:${name}`);
    return file;
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    let color;
    switch (req.method) {
        case 'GET':
            color = 'greenBright';
            break;
        case 'POST':
            color = 'yellow';
            break;
        case 'PUT':
            color = 'blueBright';
            break;
        case 'DELETE':
            color = 'red';
            break;
        default:
            color = 'white';
    }
    (0, log4_1.log)(`#c ${color}  $c black ${req.method}$$ ## ${req.path}`);
    next();
});
routes.forEach(route => {
    const path = route.name === 'index' ? route.path : (0, path_1.join)(route.path, route.name);
    if (route.run)
        try {
            app.all(path, route.run);
        }
        catch (e) {
            (0, log4_1.error)(e.message);
        }
    return (0, log4_1.log)(`#c whiteBright  $c black ${path}$$ ## Added`);
});
const server = app.listen(3333, () => (0, log4_1.log)('$c green Listening on port 3333$$'));
process.on('exit', server.close);
