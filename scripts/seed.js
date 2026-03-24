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
Object.defineProperty(exports, "__esModule", { value: true });
var next_sanity_1 = require("next-sanity");
var dotenv = require("dotenv");
dotenv.config({ path: '.env.local' });
var projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
var dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
var token = process.env.SANITY_API_TOKEN;
if (!projectId || !dataset || !token) {
    console.error('Missing Sanity configuration. Please check your .env.local file.');
    process.exit(1);
}
var client = (0, next_sanity_1.createClient)({
    projectId: projectId,
    dataset: dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: token,
});
var CATEGORIES = [
    'Desktop',
    'Laptop',
    'Monitor',
    'Phone',
    'Watch',
    'Mouse',
    'Tablet',
    'Headphones'
];
var COLORS = [
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Gold', value: '#FFD700' }
];
var SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
/** Fetch image from URL and upload to Sanity; returns asset document _id. */
function uploadImageFromUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var res, arrayBuffer, buffer, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, { headers: { 'User-Agent': 'SanitySeed/1.0' } })];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Failed to fetch image: ".concat(res.status, " ").concat(url));
                    return [4 /*yield*/, res.arrayBuffer()];
                case 2:
                    arrayBuffer = _a.sent();
                    buffer = Buffer.from(arrayBuffer);
                    return [4 /*yield*/, client.assets.upload('image', buffer, {
                            filename: "seed-".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 8), ".jpg"),
                        })];
                case 3:
                    doc = _a.sent();
                    return [2 /*return*/, doc._id];
            }
        });
    });
}
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var homePageId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Starting seed...');
                    return [4 /*yield*/, client.fetch("*[_type == \"homePage\"][0]._id")];
                case 1:
                    homePageId = _a.sent();
                    if (!homePageId) return [3 /*break*/, 3];
                    console.log('Clearing product references from Homepage...');
                    return [4 /*yield*/, client
                            .patch(homePageId)
                            .set({ heroCarousel: [] })
                            .unset(['heroSmallCard1', 'heroSmallCard2', 'promoBigCard', 'promoMediumCard1', 'promoMediumCard2', 'countdownProduct'])
                            .commit()];
                case 2:
                    _a.sent();
                    console.log('  Cleared.');
                    _a.label = 3;
                case 3:
                    // 1. Delete existing products and categories (so re-runs don’t duplicate)
                    console.log('Deleting existing products and categories...');
                    return [4 /*yield*/, client.delete({ query: '*[_type == "product"]' })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, client.delete({ query: '*[_type == "category"]' })];
                case 5:
                    _a.sent();
                    console.log('  Deleted.');
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(function (err) {
    console.error('Seed failed:', err);
    process.exit(1);
});
