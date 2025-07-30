-- AlterTable
ALTER TABLE "TourPackages" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
