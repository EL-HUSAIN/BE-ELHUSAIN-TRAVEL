import { VisaRepository } from "../repository/visa.repository";
import { ApplyVisaDTO, CheckStatusDTO } from "../dto/visa.dto";

// ubah menjadi async function saja dari pada class
export async function applyVisa(data: ApplyVisaDTO) {
  const repo = new VisaRepository();
  // (bisa tambah validasi/custom logic di sini)
  return repo.createApplication(data);
}

export async function checkVisaStatus(params: CheckStatusDTO) {
  const repo = new VisaRepository();
  const record = await repo.getStatus(params.applicationId);
  if (!record) throw new Error("Application not found");
  return { status: record.status };
}