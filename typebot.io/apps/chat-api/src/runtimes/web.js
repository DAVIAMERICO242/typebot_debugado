"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webRuntime = void 0;
var startChat_1 = require("@typebot.io/bot-engine/apiHandlers/startChat");
var continueChat_1 = require("@typebot.io/bot-engine/apiHandlers/continueChat");
var startChatPreview_1 = require("@typebot.io/bot-engine/apiHandlers/startChatPreview");
var getMessageStream_1 = require("@typebot.io/bot-engine/apiHandlers/getMessageStream");
var hono_1 = require("hono");
var cors_1 = require("hono/cors");
var typebox_validator_1 = require("@hono/typebox-validator");
var typebox_1 = require("@sinclair/typebox");
var auth_1 = require("../auth");
exports.webRuntime = new hono_1.Hono();
exports.webRuntime.use('*', (0, cors_1.cors)());
exports.webRuntime.post('/api/v1/typebots/:publicId/startChat', (0, typebox_validator_1.tbValidator)('json', typebox_1.Type.Object({
    message: typebox_1.Type.Optional(typebox_1.Type.String()),
    isStreamEnabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    resultId: typebox_1.Type.Optional(typebox_1.Type.String()),
    isOnlyRegistering: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    prefilledVariables: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Unknown())),
}), function (result, c) {
    console.log('aaaaaa')
    if (!result.success)
        return c.json({ message: 'Invalid input' }, 400);
}), function (c) { return __awaiter(void 0, void 0, void 0, function () {
    console.log('cccc')
    var data, _a, corsOrigin, response;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                data = c.req.valid('json');
                return [4 /*yield*/, (0, startChat_1.startChat)(__assign(__assign({}, data), { publicId: c.req.param('publicId'), isStreamEnabled: (_b = data.isStreamEnabled) !== null && _b !== void 0 ? _b : true, isOnlyRegistering: (_c = data.isOnlyRegistering) !== null && _c !== void 0 ? _c : false, origin: c.req.header('origin') }))];
            case 1:
                _a = _d.sent(), corsOrigin = _a.corsOrigin, response = __rest(_a, ["corsOrigin"]);
                if (corsOrigin)
                    c.res.headers.set('Access-Control-Allow-Origin', corsOrigin);
                return [2 /*return*/, c.json(response)];
        }
    });
}); });
exports.webRuntime.post('/api/v1/typebots/:id/preview/startChat', (0, typebox_validator_1.tbValidator)('json', typebox_1.Type.Object({
    message: typebox_1.Type.Optional(typebox_1.Type.String()),
    isStreamEnabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    resultId: typebox_1.Type.Optional(typebox_1.Type.String()),
    isOnlyRegistering: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    prefilledVariables: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Unknown())),
    startFrom: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Object({
            type: typebox_1.Type.Literal('group'),
            groupId: typebox_1.Type.String(),
        }),
        typebox_1.Type.Object({
            type: typebox_1.Type.Literal('event'),
            eventId: typebox_1.Type.String(),
        }),
    ])),
    typebot: typebox_1.Type.Optional(typebox_1.Type.Any()),
}), function (result, c) {
    if (!result.success)
        return c.json({ message: 'Invalid input' }, 400);
}), function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var data, userId, _a, _b, _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                data = c.req.valid('json');
                if (!!data.typebot) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, auth_1.getAuthenticatedUserId)(c.req.header('Authorization'))];
            case 1:
                _a = _f.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = undefined;
                _f.label = 3;
            case 3:
                userId = _a;
                _c = (_b = c).json;
                return [4 /*yield*/, (0, startChatPreview_1.startChatPreview)(__assign(__assign({}, data), { typebotId: c.req.param('id'), userId: userId, isStreamEnabled: (_d = data.isStreamEnabled) !== null && _d !== void 0 ? _d : true, isOnlyRegistering: (_e = data.isOnlyRegistering) !== null && _e !== void 0 ? _e : false }))];
            case 4: return [2 /*return*/, _c.apply(_b, [_f.sent()])];
        }
    });
}); });
exports.webRuntime.post('/api/v1/sessions/:sessionId/continueChat', (0, typebox_validator_1.tbValidator)('json', typebox_1.Type.Object({
    message: typebox_1.Type.Optional(typebox_1.Type.String()),
}), function (result, c) {
    if (!result.success)
        return c.json({ message: 'Invalid input' }, 400);
}), function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, corsOrigin, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = c.req.valid('json');
                return [4 /*yield*/, (0, continueChat_1.continueChat)(__assign(__assign({}, data), { sessionId: c.req.param('sessionId'), origin: c.req.header('origin') }))];
            case 1:
                _a = _b.sent(), corsOrigin = _a.corsOrigin, response = __rest(_a, ["corsOrigin"]);
                if (corsOrigin)
                    c.res.headers.set('Access-Control-Allow-Origin', corsOrigin);
                return [2 /*return*/, c.json(response)];
        }
    });
}); });
exports.webRuntime.post('/api/v1/sessions/:sessionId/streamMessage', (0, typebox_validator_1.tbValidator)('json', typebox_1.Type.Object({
    messages: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Any())),
}), function (result, c) {
    if (!result.success)
        return c.json({ message: 'Invalid input' }, 400);
}), function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, stream, status, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = c.req.valid('json');
                return [4 /*yield*/, (0, getMessageStream_1.getMessageStream)({
                        sessionId: c.req.param('sessionId'),
                        messages: data.messages,
                    })];
            case 1:
                _a = _b.sent(), stream = _a.stream, status = _a.status, message = _a.message;
                if (!stream)
                    return [2 /*return*/, c.json({ message: message }, (status !== null && status !== void 0 ? status : 400))];
                return [2 /*return*/, new Response(stream)];
        }
    });
}); });
