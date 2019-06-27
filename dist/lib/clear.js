"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var firestore_helpers_1 = require("./firestore-helpers");
var SLEEP_TIME = 1000;
var clearData = function (startingRef) { return __awaiter(_this, void 0, void 0, function () {
    var promises;
    return __generator(this, function (_a) {
        if (firestore_helpers_1.isLikeDocument(startingRef)) {
            promises = [clearCollections(startingRef)];
            if (!firestore_helpers_1.isRootOfDatabase(startingRef)) {
                promises.push(startingRef.delete());
            }
            return [2 /*return*/, Promise.all(promises)];
        }
        else {
            return [2 /*return*/, clearDocuments(startingRef)];
        }
        return [2 /*return*/];
    });
}); };
var clearCollections = function (startingRef) { return __awaiter(_this, void 0, void 0, function () {
    var collectionsSnapshot, deadlineError, e_1, collectionPromises;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deadlineError = false;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 7]);
                return [4 /*yield*/, startingRef.listCollections()];
            case 2:
                collectionsSnapshot = _a.sent();
                deadlineError = false;
                return [3 /*break*/, 7];
            case 3:
                e_1 = _a.sent();
                if (!(e_1.message === 'Deadline Exceeded')) return [3 /*break*/, 5];
                console.log("Deadline Error in getCollections()...waiting " + SLEEP_TIME / 1000 + " second(s) before retrying");
                return [4 /*yield*/, firestore_helpers_1.sleep(SLEEP_TIME)];
            case 4:
                _a.sent();
                deadlineError = true;
                return [3 /*break*/, 6];
            case 5: throw e_1;
            case 6: return [3 /*break*/, 7];
            case 7:
                if (deadlineError || !collectionsSnapshot) return [3 /*break*/, 1];
                _a.label = 8;
            case 8:
                collectionPromises = [];
                collectionsSnapshot.map(function (collectionRef) {
                    collectionPromises.push(clearDocuments(collectionRef));
                });
                return [2 /*return*/, firestore_helpers_1.batchExecutor(collectionPromises)];
        }
    });
}); };
var clearDocuments = function (collectionRef) { return __awaiter(_this, void 0, void 0, function () {
    var allDocuments, deadlineError, e_2, documentPromises;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Retrieving documents from " + collectionRef.path);
                deadlineError = false;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 7]);
                return [4 /*yield*/, collectionRef.listDocuments()];
            case 2:
                allDocuments = _a.sent();
                deadlineError = false;
                return [3 /*break*/, 7];
            case 3:
                e_2 = _a.sent();
                if (!(e_2.code && e_2.code === 4)) return [3 /*break*/, 5];
                console.log("Deadline Error in listDocuments()...waiting " + SLEEP_TIME / 1000 + " second(s) before retrying");
                return [4 /*yield*/, firestore_helpers_1.sleep(SLEEP_TIME)];
            case 4:
                _a.sent();
                deadlineError = true;
                return [3 /*break*/, 6];
            case 5: throw e_2;
            case 6: return [3 /*break*/, 7];
            case 7:
                if (deadlineError || !allDocuments) return [3 /*break*/, 1];
                _a.label = 8;
            case 8:
                documentPromises = [];
                allDocuments.forEach(function (docRef) {
                    documentPromises.push(clearCollections(docRef));
                    documentPromises.push(docRef.delete());
                });
                return [2 /*return*/, firestore_helpers_1.batchExecutor(documentPromises)];
        }
    });
}); };
exports.default = clearData;
