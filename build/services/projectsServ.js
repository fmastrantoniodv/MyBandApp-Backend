"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProject = exports.getProjects = void 0;
const dataMock_json_1 = __importDefault(require("./dataMock.json"));
const project = dataMock_json_1.default;
console.log(dataMock_json_1.default);
const getProjects = () => project;
exports.getProjects = getProjects;
const addProject = () => undefined;
exports.addProject = addProject;
