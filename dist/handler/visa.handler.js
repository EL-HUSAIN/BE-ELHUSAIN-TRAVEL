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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyVisaHandler = applyVisaHandler;
exports.checkStatusHandler = checkStatusHandler;
const visa_service_1 = require("../service/visa.service");
("../service/visa.service");
function applyVisaHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = req.body;
            const result = yield (0, visa_service_1.applyVisa)(payload);
            res.status(201).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    });
}
function checkStatusHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = { applicationId: Number(req.params.id) };
            const result = yield (0, visa_service_1.checkVisaStatus)(params);
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    });
}
