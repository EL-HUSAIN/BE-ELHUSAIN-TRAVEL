import { PrismaClient } from "@prisma/client";
import { ApplyVisaDTO } from "../dto/visa.dto";

const prisma = new PrismaClient();

export class VisaRepository {
  async createApplication(data: ApplyVisaDTO) {
    return prisma.visaApplication.create({ data });
  }

  async getStatus(applicationId: number) {
    return prisma.visaApplication.findUnique({ where: { id: applicationId } });
  }
}
