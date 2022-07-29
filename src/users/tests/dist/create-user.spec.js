"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var testing_1 = require("@nestjs/testing");
var auth_module_1 = require("../../auth/auth.module");
var request = require("supertest");
var mongoose_1 = require("@nestjs/mongoose");
var MongooseTestModule_1 = require("../../test-utils/mongo/MongooseTestModule");
var user_entity_1 = require("../../users/entities/user.entity");
var app;
var server;
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var module;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, testing_1.Test.createTestingModule({
                    imports: [
                        MongooseTestModule_1.rootMongooseTestModule(),
                        mongoose_1.MongooseModule.forFeature([{ name: user_entity_1.User.name, schema: user_entity_1.UserSchema }]),
                        auth_module_1.AuthModule,
                    ]
                }).compile()];
            case 1:
                module = _a.sent();
                app = module.createNestApplication();
                return [4 /*yield*/, app.init()];
            case 2:
                _a.sent();
                server = app.getHttpServer();
                return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, MongooseTestModule_1.closeInMongodConnection()];
            case 1:
                _a.sent();
                return [4 /*yield*/, app.close()];
            case 2:
                _a.sent();
                server.close();
                return [2 /*return*/];
        }
    });
}); });
describe('Create User', function () {
    //it('Não deve ser possivel criar um usuario sem o campo email', async () => {});
    //it('Não deve ser possivel criar um usuario com um email invalido', async () => {});
    //it('Não deve ser possivel criar um usuario sem o campo senha', async () => {});
    it('Deve ser possivel criar um usuário passando os campos obrigatorios', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request(server)
                        .post('/users')
                        .send({
                        email: 'test1@test.com',
                        password: '12345678'
                    })
                        .expect(201)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
});
