-- CreateTable
CREATE TABLE "ProductByCategoryFilters" (
    "userId" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT true,
    "disliked" BOOLEAN NOT NULL DEFAULT true,
    "neutral" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ProductByCategoryFilters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Settings" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductByCategoryFilters_userId_key" ON "ProductByCategoryFilters"("userId");
