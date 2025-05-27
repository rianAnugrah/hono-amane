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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
// prisma/seed.ts
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function parseFloatSafe(val) {
    var num = parseFloat(val.replace(/,/g, "").trim());
    return isNaN(num) ? 0 : num;
}
function parseDateSafe(dateStr) {
    var _a = dateStr.split("/"), month = _a[0], day = _a[1], year = _a[2];
    return new Date("".concat(year, "-").concat(month, "-").concat(day));
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var assets, _i, assets_1, asset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assets = [
                        {
                            PROJECT_CODE: "Common",
                            ASSET_NO: "0201004000001",
                            LINE_NO: "01",
                            ASSET_NAME: "Camps",
                            REMARK: "Fence BD GMS Pasuruan",
                            LOCATION_DESC: "GMS Pasuruan",
                            DETAILS_LOCATION: "OUTSIDE AREA",
                            CONDITION: "Good",
                            PIS_DATE: "04/04/2019",
                            TRANS_DATE: "05/20/2020",
                            CATEGORY_CODE: "D",
                            AFE_NO: "N/A",
                            ADJUSTED_DEPRE: ".00",
                            PO_NO: 332004714,
                            ACQ_VALUE_IDR: " 834,999,952.91 ",
                            ACQ_VALUE: " 58,877.53 ",
                            ACCUM_DEPRE: " 47,525.35 ",
                            YTD_DEPRE: " 2,619.72 ",
                            BOOK_VALUE: " 11,352.18 ",
                            TAGGING_YEAR: "",
                        },
                        {
                            PROJECT_CODE: "Common",
                            ASSET_NO: "0202020000001",
                            LINE_NO: "01",
                            ASSET_NAME: "Transformers, High Voltage",
                            REMARK: "6.6kV / 480V POWER TRANSFORMER",
                            LOCATION_DESC: "BD WHP",
                            DETAILS_LOCATION: "Cellar Deck - Control Room",
                            CONDITION: "Good",
                            PIS_DATE: "07/23/2017",
                            TRANS_DATE: "01/07/2022",
                            CATEGORY_CODE: "F",
                            AFE_NO: 114022,
                            ADJUSTED_DEPRE: ".00",
                            PO_NO: "N/A",
                            ACQ_VALUE_IDR: " 2,432,734,768.26 ",
                            ACQ_VALUE: " 182,596.62 ",
                            ACCUM_DEPRE: " 162,792.98 ",
                            YTD_DEPRE: " 4,570.08 ",
                            BOOK_VALUE: " 19,803.64 ",
                            TAGGING_YEAR: "",
                        },
                        {
                            PROJECT_CODE: "Common",
                            ASSET_NO: "0401068000001",
                            LINE_NO: "01",
                            ASSET_NAME: "High Integrity Pressure Protection System Panel GTC",
                            REMARK: "HIPPS WELL A4",
                            LOCATION_DESC: "BD WHP",
                            DETAILS_LOCATION: "Mezzanine",
                            CONDITION: "Good",
                            PIS_DATE: "07/23/2017",
                            TRANS_DATE: "01/07/2022",
                            CATEGORY_CODE: "F",
                            AFE_NO: 114022,
                            ADJUSTED_DEPRE: ".00",
                            PO_NO: "N/A",
                            ACQ_VALUE_IDR: " 3,805,916,793.45 ",
                            ACQ_VALUE: " 285,665.15 ",
                            ACCUM_DEPRE: " 254,683.15 ",
                            YTD_DEPRE: " 7,149.69 ",
                            BOOK_VALUE: " 30,982.00 ",
                            TAGGING_YEAR: "",
                        },
                    ];
                    _i = 0, assets_1 = assets;
                    _a.label = 1;
                case 1:
                    if (!(_i < assets_1.length)) return [3 /*break*/, 4];
                    asset = assets_1[_i];
                    return [4 /*yield*/, prisma.asset.create({
                            data: {
                                projectCode: asset.PROJECT_CODE,
                                assetNo: asset.ASSET_NO,
                                lineNo: asset.LINE_NO,
                                assetName: asset.ASSET_NAME,
                                remark: asset.REMARK || null,
                                locationDesc: asset.LOCATION_DESC,
                                detailsLocation: asset.DETAILS_LOCATION || null,
                                condition: asset.CONDITION,
                                pisDate: parseDateSafe(asset.PIS_DATE),
                                transDate: parseDateSafe(asset.TRANS_DATE),
                                categoryCode: asset.CATEGORY_CODE,
                                afeNo: asset.AFE_NO === "N/A" ? null : String(asset.AFE_NO),
                                adjustedDepre: parseFloatSafe(asset.ADJUSTED_DEPRE),
                                poNo: asset.PO_NO === "N/A" ? null : String(asset.PO_NO),
                                acqValueIdr: parseFloatSafe(asset.ACQ_VALUE_IDR),
                                acqValue: parseFloatSafe(asset.ACQ_VALUE),
                                accumDepre: parseFloatSafe(asset.ACCUM_DEPRE),
                                ytdDepre: parseFloatSafe(asset.YTD_DEPRE),
                                bookValue: parseFloatSafe(asset.BOOK_VALUE),
                                taggingYear: asset.TAGGING_YEAR || null,
                            },
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () {
    //console.log("Seeding complete");
})
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
