/*
  Warnings:

  - Added the required column `title` to the `profile_pictures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile_pictures" ADD COLUMN     "title" TEXT NOT NULL;
