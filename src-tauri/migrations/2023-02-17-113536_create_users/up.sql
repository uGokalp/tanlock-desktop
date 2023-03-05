-- Your SQL goes here
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "cname" TEXT NOT NULL,
    "employee" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "four_eye" BOOLEAN NOT NULL
);