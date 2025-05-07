/*
  Warnings:

  - You are about to drop the column `artworkTitle` on the `Diary` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Diary` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Diary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "artworkId" INTEGER NOT NULL,
    CONSTRAINT "Diary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Diary_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "DailyArtwork" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Diary" ("artworkId", "content", "createdAt", "id", "updatedAt", "userId") SELECT "artworkId", "content", "createdAt", "id", "updatedAt", "userId" FROM "Diary";
DROP TABLE "Diary";
ALTER TABLE "new_Diary" RENAME TO "Diary";
CREATE UNIQUE INDEX "Diary_userId_artworkId_key" ON "Diary"("userId", "artworkId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
