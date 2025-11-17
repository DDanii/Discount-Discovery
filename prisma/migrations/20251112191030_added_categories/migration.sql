-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "CategoryPreference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "value" BOOLEAN,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "CategoryPreference_category_fkey" FOREIGN KEY ("category") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CategoryPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "price" REAL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "url" TEXT,
    "pricePerUnit" REAL,
    "unit" TEXT,
    "description" TEXT,
    "warning" TEXT,
    "category" TEXT,
    CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_category_fkey" FOREIGN KEY ("category") REFERENCES "Category" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("category", "description", "endDate", "externalId", "id", "image", "name", "price", "pricePerUnit", "shopId", "startDate", "unit", "url", "warning") SELECT "category", "description", "endDate", "externalId", "id", "image", "name", "price", "pricePerUnit", "shopId", "startDate", "unit", "url", "warning" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_shopId_externalId_key" ON "Product"("shopId", "externalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CategoryPreference_userId_category_key" ON "CategoryPreference"("userId", "category");
