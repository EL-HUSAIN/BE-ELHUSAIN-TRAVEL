-- CreateTable
CREATE TABLE "VisaApplication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisaApplication_pkey" PRIMARY KEY ("id")
);
