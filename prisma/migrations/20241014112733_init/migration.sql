-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('Supervisor', 'FacilityTechnician', 'FacilitySupport', 'Security');

-- CreateTable
CREATE TABLE "PermitDriving" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "namaPengemudi" TEXT NOT NULL,
    "carId" INTEGER NOT NULL,
    "tujuan" TEXT NOT NULL,
    "barangBawaan" TEXT NOT NULL,
    "pemohon" TEXT NOT NULL,
    "pemberiIzin" TEXT NOT NULL,
    "petugasSecurity" TEXT NOT NULL,
    "kmAwal" TEXT NOT NULL,
    "kmAkhir" TEXT,
    "jamKeluar" TIMESTAMP(3) NOT NULL,
    "jamMasuk" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "fuelLevel" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "PermitDriving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "nopol" TEXT NOT NULL,
    "model" TEXT NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "kmUsed" DOUBLE PRECISION NOT NULL,
    "carId" INTEGER NOT NULL,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "position" "Position",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyRecord" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "monthlySafeManhours" INTEGER NOT NULL,
    "ytdSafeManhours" INTEGER NOT NULL,
    "cumulativeSafeManhours" INTEGER NOT NULL,
    "monthlySafeDriving" INTEGER NOT NULL,
    "ytdSafeDriving" INTEGER NOT NULL,
    "cumulativeSafeDriving" INTEGER NOT NULL,
    "fatality" INTEGER NOT NULL,
    "lostTimeInjury" INTEGER NOT NULL,
    "incidentAccident" INTEGER NOT NULL,
    "totalSicknessAbsence" DOUBLE PRECISION NOT NULL,
    "sicknessAbsenceFrequency" DOUBLE PRECISION NOT NULL,
    "environmentPollution" INTEGER NOT NULL,
    "securityIncident" INTEGER NOT NULL,

    CONSTRAINT "SafetyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PermitDriving_carId_idx" ON "PermitDriving"("carId");

-- CreateIndex
CREATE INDEX "PermitDriving_userId_idx" ON "PermitDriving"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Car_nopol_key" ON "Car"("nopol");

-- CreateIndex
CREATE INDEX "UsageLog_carId_idx" ON "UsageLog"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PermitDriving" ADD CONSTRAINT "PermitDriving_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermitDriving" ADD CONSTRAINT "PermitDriving_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
