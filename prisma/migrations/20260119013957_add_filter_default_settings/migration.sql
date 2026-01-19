/*
  Warnings:

  - The primary key for the `ArgumentSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ArgumentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `shopSettingId` on the `ArgumentSettings` table. All the data in the column will be lost.
  - The primary key for the `ShopSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ShopSettings` table. All the data in the column will be lost.
  - You are about to drop the column `defaultFilterDisliked` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `defaultFilterLiked` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `defaultFilterNeutral` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ArgumentSettings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Settings" (
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductFilters" (
    "userId" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT true,
    "disliked" BOOLEAN NOT NULL DEFAULT true,
    "neutral" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ProductFilters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Settings" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoryFilters" (
    "userId" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT true,
    "disliked" BOOLEAN NOT NULL DEFAULT true,
    "neutral" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "CategoryFilters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Settings" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArgumentSettings" (
    "shopArgumentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "ArgumentSettings_shopArgumentId_fkey" FOREIGN KEY ("shopArgumentId") REFERENCES "ShopArguments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArgumentSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopSettings" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ArgumentSettings" ("shopArgumentId", "value") SELECT "shopArgumentId", "value" FROM "ArgumentSettings";
DROP TABLE "ArgumentSettings";
ALTER TABLE "new_ArgumentSettings" RENAME TO "ArgumentSettings";
CREATE UNIQUE INDEX "ArgumentSettings_userId_key" ON "ArgumentSettings"("userId");
CREATE TABLE "new_ShopSettings" (
    "userId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ShopSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Settings" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ShopSettings_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ShopSettings" ("enabled", "shopId", "userId") SELECT "enabled", "shopId", "userId" FROM "ShopSettings";
DROP TABLE "ShopSettings";
ALTER TABLE "new_ShopSettings" RENAME TO "ShopSettings";
CREATE UNIQUE INDEX "ShopSettings_userId_key" ON "ShopSettings"("userId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "name", "password") SELECT "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductFilters_userId_key" ON "ProductFilters"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryFilters_userId_key" ON "CategoryFilters"("userId");
