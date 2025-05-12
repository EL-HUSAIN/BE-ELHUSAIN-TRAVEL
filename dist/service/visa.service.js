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
exports.applyVisa = applyVisa;
exports.checkVisaStatus = checkVisaStatus;
const visa_repository_1 = require("../repository/visa.repository");
// ubah menjadi async function saja dari pada class
function applyVisa(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const repo = new visa_repository_1.VisaRepository();
        // (bisa tambah validasi/custom logic di sini)
        return repo.createApplication(data);
    });
}
function checkVisaStatus(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const repo = new visa_repository_1.VisaRepository();
        const record = yield repo.getStatus(params.applicationId);
        if (!record)
            throw new Error("Application not found");
        return { status: record.status };
    });
}
