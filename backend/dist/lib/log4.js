"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.log = exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const allColors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey', 'blackBright', 'redBright', 'greenBright', 'yellowBright', 'blueBright', 'magentaBright', 'cyanBright', 'whiteBright', 'reset', 'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough', 'visible'];
const backgroundColors = ["bgBlack", "bgRed", "bgGreen", "bgYellow", "bgBlue", "bgMagenta", "bgCyan", "bgWhite", "bgGray", "bgGrey", "bgBlackBright", "bgRedBright", "bgGreenBright", "bgYellowBright", "bgBlueBright", "bgMagentaBright", "bgCyanBright", "bgWhiteBright"];
class Logger {
    constructor(name) {
        this.name = name;
    }
    get date() {
        const now = new Date();
        let min = now.getMinutes();
        let sec = now.getSeconds();
        min = String(min < 10 ? "0" + min : min);
        sec = String(sec < 10 ? "0" + sec : sec);
        return [String(now.getHours()), min, sec];
    }
    get stack() {
        const basePath = process.cwd() + "/";
        const baseModule = path_1.default.resolve(__dirname, __filename).replace(basePath, "");
        let stack;
        try {
            throw new Error('');
        }
        catch (error) {
            stack = error.stack;
        }
        stack = stack.split('\n').map((line) => line.trim());
        for (const i of stack) {
            const Path = i.split('(').length > 1
                ?
                    i.split('(')[1].replace(basePath, "").split(":")[0]
                :
                    i.split('(')[0].replace("at ", "").replace(basePath, "").split(":")[0];
            if (Path === baseModule || Path === "Error" || Path === "<anonymous>)" || Path.includes("node"))
                continue;
            return Path;
        }
        return "Anonymous";
    }
    get logInfo() {
        if (this.name)
            return chalk_1.default.white(`[${this.date.join(':')}] [${this.stack}|${this.name}|INFO]: `);
        else
            return chalk_1.default.white(`[${this.date.join(':')}] [${this.stack}|INFO]: `);
    }
    get warnInfo() {
        if (this.name)
            return chalk_1.default.yellow(`[${this.date.join(':')}] [${this.stack}|${this.name}|WARN]: `);
        else
            return chalk_1.default.yellow(`[${this.date.join(':')}] [${this.stack}|WARN]: `);
    }
    get errorInfo() {
        if (this.name)
            return chalk_1.default.red(`[${this.date.join(':')}] [${this.stack}|${this.name}|ERROR]: `);
        return chalk_1.default.red(`[${this.date.join(':')}] [${this.stack}|ERROR]: `);
    }
    messageHandler(message) {
        if (message === null)
            return "NULL";
        if (message instanceof Array)
            return "[" + message.map(this.messageHandler).join(", ") + "]";
        if (message instanceof Error)
            return String(message);
        if (message instanceof Date)
            return message.toString();
        if (message instanceof Map)
            return "[" + Array.from(message.entries()).map(this.messageHandler).join(", ") + "]";
        if (message instanceof Set)
            return "[" + Array.from(message.values()).map(this.messageHandler).join(", ") + "]";
        if (message instanceof Function)
            return `[Function ${message.name}]`;
        message = typeof message !== "string" ? JSON.stringify(message) : message;
        try {
            message = JSON.parse(message);
        }
        catch (e) {
            void 0;
        }
        switch (typeof message) {
            case "string": return String(message);
            case "number": return String(message);
            case "boolean": return String(message);
            case "undefined": return "undefined";
            case "object": return JSON.stringify(message);
            default: return "unknown";
        }
    }
    isValidColor(color, set) {
        return set.includes(color);
    }
    parseColors(msg) {
        let result = msg;
        msg.forEach((arg, index) => {
            do {
                arg = arg.replace(/\$c([^\$c\$\$]*)\$\$/g, (a) => {
                    const parsed = a.replace(/\$c (\w+) (.+?)\$\$/g, (str, color, content) => {
                        if (this.isValidColor(color, allColors))
                            return chalk_1.default[color](content);
                        else
                            return chalk_1.default["reset"](content);
                    });
                    return parsed;
                });
                do {
                    arg = arg.replace(/\$c (\w+) (.+?)\$\$/g, (str, color, content) => {
                        if (this.isValidColor(color, allColors))
                            return chalk_1.default[color](content);
                        else
                            return chalk_1.default["reset"](content);
                    });
                } while (arg.match(/\$c (\w+) (.+?)\$\$/g));
                result[index] = arg;
            } while (arg.match(/\$c([^\$c\$\$]*)\$\$/g));
            do {
                arg = arg.replace(/\#c([^\#c\#\#]*)\#\#/g, (a) => {
                    const parsed = a.replace(/\#c (\w+) (.+?)\#\#/g, (str, color, content) => {
                        color = 'bg' + color.charAt(0).toUpperCase() + color.slice(1);
                        if (this.isValidColor(color, backgroundColors))
                            return chalk_1.default[color](content);
                        else
                            return chalk_1.default["reset"](content);
                    });
                    return parsed;
                });
                do {
                    arg = arg.replace(/\#c (\w+) (.+?)\#\#/g, (str, color, content) => {
                        color = 'bg' + color.charAt(0).toUpperCase() + color.slice(1);
                        if (this.isValidColor(color, backgroundColors))
                            return chalk_1.default[color](content);
                        else
                            return chalk_1.default["reset"](content);
                    });
                } while (arg.match(/\#c (\w+) (.+?)\#\#/g));
                result[index] = arg;
            } while (arg.match(/\#c([^\#c\#\#]*)\#\#/g));
        });
        return result;
    }
    log(...args) {
        const message = this.parseColors(args.map(a => this.messageHandler(a))).join('; ');
        process.stdout.write(this.logInfo + message + "\n");
    }
    warn(...args) {
        const message = this.parseColors(args.map(a => this.messageHandler(a))).join('; ');
        process.stdout.write(this.warnInfo + chalk_1.default.yellow(message) + "\n");
    }
    error(...args) {
        const message = this.parseColors(args.map(a => this.messageHandler(a))).join('; ');
        process.stdout.write(this.errorInfo + chalk_1.default.red(message) + "\n");
    }
}
exports.Logger = Logger;
const log = (...args) => Logger.prototype.log(...args);
exports.log = log;
const warn = (...args) => Logger.prototype.warn(...args);
exports.warn = warn;
const error = (...args) => Logger.prototype.error(...args);
exports.error = error;
