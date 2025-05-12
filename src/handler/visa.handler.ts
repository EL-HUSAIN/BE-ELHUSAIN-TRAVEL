import { Request, Response, NextFunction } from "express";
import { applyVisa, checkVisaStatus } from "../service/visa.service";
("../service/visa.service");
import { ApplyVisaDTO, CheckStatusDTO } from "../dto/visa.dto";

export async function applyVisaHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload: ApplyVisaDTO = req.body;
    const result = await applyVisa(payload);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function checkStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params: CheckStatusDTO = { applicationId: Number(req.params.id) };
    const result = await checkVisaStatus(params);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
