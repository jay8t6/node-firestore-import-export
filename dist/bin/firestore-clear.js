#!/usr/bin/env node
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
var commander = require("commander");
var colors = require("colors");
var process = require("process");
var fs = require("fs");
var firestore_helpers_1 = require("../lib/firestore-helpers");
var lib_1 = require("../lib");
var prompt = require("prompt");
var packageInfo = require('../../package.json');
var accountCredentialsEnvironmentKey = 'GOOGLE_APPLICATION_CREDENTIALS';
var accountCredentialsPathParamKey = 'accountCredentials';
var accountCredentialsPathParamDescription = 'path to Google Cloud account credentials JSON file. If missing, will look ' +
    ("at the " + accountCredentialsEnvironmentKey + " environment variable for the path.");
var nodePathParamKey = 'nodePath';
var nodePathParamDescription = 'Path to database node to start (e.g. collectionA/docB/collectionC). ' +
    'Backs up entire database from the root if missing.';
var yesToClearParamKey = 'yes';
var yesToClearParamDescription = 'Unattended clear without confirmation (like hitting "y" from the command line).';
commander.version(packageInfo.version)
    .option("-a, --" + accountCredentialsPathParamKey + " <path>", accountCredentialsPathParamDescription)
    .option("-n, --" + nodePathParamKey + " <path>", nodePathParamDescription)
    .option("-y, --" + yesToClearParamKey, yesToClearParamDescription)
    .parse(process.argv);
var accountCredentialsPath = commander[accountCredentialsPathParamKey] || process.env[accountCredentialsEnvironmentKey];
if (!accountCredentialsPath) {
    console.log(colors.bold(colors.red('Missing: ')) + colors.bold(accountCredentialsPathParamKey) + ' - ' + accountCredentialsPathParamDescription);
    commander.help();
    process.exit(1);
}
if (!fs.existsSync(accountCredentialsPath)) {
    console.log(colors.bold(colors.red('Account credentials file does not exist: ')) + colors.bold(accountCredentialsPath));
    commander.help();
    process.exit(1);
}
var nodePath = commander[nodePathParamKey];
var unattendedConfirmation = commander[yesToClearParamKey];
firestore_helpers_1.getCredentialsFromFile(accountCredentialsPath)
    .then(function (credentials) {
    var db = firestore_helpers_1.getFirestoreDBReference(credentials);
    var pathReference = firestore_helpers_1.getDBReferenceFromPath(db, nodePath);
    return { credentials: credentials, pathReference: pathReference };
})
    .then(function (_a) {
    var credentials = _a.credentials, pathReference = _a.pathReference;
    return __awaiter(_this, void 0, void 0, function () {
        var nodeLocation, projectID, deleteText;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nodeLocation = pathReference
                        .path || '[database root]';
                    projectID = credentials.project_id;
                    deleteText = "About to clear all data from '" + projectID + "' firestore starting at '" + nodeLocation + "'.";
                    console.log("\n\n" + colors.bold(colors.blue(deleteText)));
                    if (!unattendedConfirmation) return [3 /*break*/, 2];
                    console.log(colors.bgYellow(colors.blue(' === Warning: Deletion will start in 5 seconds. Hit Ctrl-C to cancel. === ')));
                    return [4 /*yield*/, firestore_helpers_1.sleep(5000)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, pathReference];
                case 2:
                    console.log(colors.bgYellow(colors.blue(' === Warning: This will clear all existing data. Do you want to proceed? === ')));
                    prompt.message = 'firestore-clear';
                    prompt.start();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            prompt.get({
                                properties: {
                                    response: {
                                        description: colors.red("Proceed with clear? [y/N] "),
                                    },
                                },
                            }, function (err, result) {
                                if (err) {
                                    reject(err);
                                }
                                else if (result.response.trim().toLowerCase() !== 'y') {
                                    reject('Clear aborted.');
                                }
                                else {
                                    resolve(pathReference);
                                }
                            });
                        })];
            }
        });
    });
})
    .then(function (pathReference) { return lib_1.firestoreClear(pathReference); })
    .then(function () {
    console.log(colors.bold(colors.green('All done 🎉')));
})
    .catch(function (error) {
    if (error instanceof Error) {
        console.log(colors.red(error.message));
        process.exit(1);
    }
    else {
        console.log(colors.red(error));
    }
});
