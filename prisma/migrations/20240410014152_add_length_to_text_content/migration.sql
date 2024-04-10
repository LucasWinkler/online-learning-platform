/*
  Warnings:

  - Added the required column `length` to the `TextContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TextContent" ADD COLUMN     "length" INTEGER NOT NULL;
