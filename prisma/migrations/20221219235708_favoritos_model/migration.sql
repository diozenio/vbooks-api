/*
  Warnings:

  - Made the column `livroId` on table `Favoritos` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Favoritos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "livroId" TEXT NOT NULL,
    CONSTRAINT "Favoritos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favoritos_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Favoritos" ("id", "livroId", "userId") SELECT "id", "livroId", "userId" FROM "Favoritos";
DROP TABLE "Favoritos";
ALTER TABLE "new_Favoritos" RENAME TO "Favoritos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
