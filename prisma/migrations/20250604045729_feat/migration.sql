-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourPackages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "price" DECIMAL(12,2),
    "duration" TEXT NOT NULL,
    "mainImageUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "TourPackages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourImages" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "TourImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TourPackages_slug_key" ON "TourPackages"("slug");

-- CreateIndex
CREATE INDEX "TourPackages_categoryId_idx" ON "TourPackages"("categoryId");

-- CreateIndex
CREATE INDEX "TourImages_packageId_idx" ON "TourImages"("packageId");

-- AddForeignKey
ALTER TABLE "TourPackages" ADD CONSTRAINT "TourPackages_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourImages" ADD CONSTRAINT "TourImages_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "TourPackages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
