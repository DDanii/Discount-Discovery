-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "defaultFilterLiked" BOOLEAN NOT NULL DEFAULT true,
    "defaultFilterDisliked" BOOLEAN NOT NULL DEFAULT true,
    "defaultFilterNeutral" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "ShopSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ShopSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ShopSettings_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArgumentSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopArgumentId" INTEGER NOT NULL,
    "shopSettingId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "ArgumentSettings_shopArgumentId_fkey" FOREIGN KEY ("shopArgumentId") REFERENCES "ShopArguments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArgumentSettings_shopSettingId_fkey" FOREIGN KEY ("shopSettingId") REFERENCES "ShopSettings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShopArguments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopId" INTEGER NOT NULL,
    "argument" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "defaultValue" TEXT,
    CONSTRAINT "ShopArguments_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Preference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "value" BOOLEAN,
    CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Preference_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "country" TEXT,
    "lastUpdated" DATETIME
);

-- CreateTable
CREATE TABLE "Product" (
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
    CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ShopSettings_userId_shopId_key" ON "ShopSettings"("userId", "shopId");

-- CreateIndex
CREATE UNIQUE INDEX "ArgumentSettings_shopArgumentId_shopSettingId_key" ON "ArgumentSettings"("shopArgumentId", "shopSettingId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopArguments_shopId_argument_key" ON "ShopArguments"("shopId", "argument");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_productId_key" ON "Preference"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_source_key" ON "Shop"("source");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopId_externalId_key" ON "Product"("shopId", "externalId");
