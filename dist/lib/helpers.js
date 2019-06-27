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
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var DocumentReference = admin.firestore.DocumentReference;
var GeoPoint = admin.firestore.GeoPoint;
// From https://stackoverflow.com/questions/8495687/split-array-into-chunks
var array_chunks = function (array, chunk_size) {
    return Array(Math.ceil(array.length / chunk_size))
        .fill(null)
        .map(function (_, index) { return index * chunk_size; })
        .map(function (begin) { return array.slice(begin, begin + chunk_size); });
};
exports.array_chunks = array_chunks;
var serializeSpecialTypes = function (data) {
    var cleaned = {};
    Object.keys(data).map(function (key) {
        var rawValue = data[key];
        if (rawValue instanceof admin.firestore.Timestamp) {
            rawValue = {
                __datatype__: 'timestamp',
                value: {
                    _seconds: rawValue.seconds,
                    _nanoseconds: rawValue.nanoseconds,
                },
            };
        }
        else if (rawValue instanceof GeoPoint) {
            rawValue = {
                __datatype__: 'geopoint',
                value: {
                    _latitude: rawValue.latitude,
                    _longitude: rawValue.longitude,
                },
            };
        }
        else if (rawValue instanceof DocumentReference) {
            rawValue = {
                __datatype__: 'documentReference',
                value: rawValue.path,
            };
        }
        else if (rawValue === Object(rawValue)) {
            var isArray = Array.isArray(rawValue);
            rawValue = serializeSpecialTypes(rawValue);
            if (isArray) {
                rawValue = Object.keys(rawValue).map(function (key) { return rawValue[key]; });
            }
        }
        cleaned[key] = rawValue;
    });
    return cleaned;
};
exports.serializeSpecialTypes = serializeSpecialTypes;
var unserializeSpecialTypes = function (data) {
    if (isScalar(data)) {
        return data;
    }
    else if (Array.isArray(data)) {
        return data.map(function (val) { return unserializeSpecialTypes(val); });
    }
    else if (data instanceof Object) {
        var rawValue = __assign({}, data); // Object.assign({}, data);
        if ('__datatype__' in rawValue && 'value' in rawValue) {
            switch (rawValue.__datatype__) {
                case 'timestamp':
                    rawValue = rawValue;
                    if (rawValue.value instanceof String) {
                        var millis = Date.parse(rawValue.value);
                        rawValue = new admin.firestore.Timestamp(millis / 1000, 0);
                    }
                    else {
                        rawValue = new admin.firestore.Timestamp(rawValue.value._seconds, rawValue.value._nanoseconds);
                    }
                    break;
                case 'geopoint':
                    rawValue = rawValue;
                    rawValue = new admin.firestore.GeoPoint(rawValue.value._latitude, rawValue.value._longitude);
                    break;
                case 'documentReference':
                    rawValue = rawValue;
                    rawValue = admin.firestore().doc(rawValue.value);
                    break;
            }
        }
        else {
            var cleaned_1 = {};
            Object.keys(rawValue).map(function (key) { return cleaned_1[key] = unserializeSpecialTypes(data[key]); });
            rawValue = cleaned_1;
        }
        return rawValue;
    }
};
exports.unserializeSpecialTypes = unserializeSpecialTypes;
var isScalar = function (val) { return (typeof val === 'string' || val instanceof String)
    || (typeof val === 'number' && isFinite(val))
    || (val === null)
    || (typeof val === 'boolean'); };
