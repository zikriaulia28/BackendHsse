-- CreateEnum
CREATE TYPE "JenisTemuan" AS ENUM ('USA', 'USC');

-- CreateTable
CREATE TABLE "USATemuan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "lokasiTemuan" TEXT NOT NULL,
    "areaSpesifik" TEXT NOT NULL,
    "jenisTemuan" "JenisTemuan" NOT NULL,
    "uscConditionTerkait" TEXT,
    "usaPracticeTerkait" TEXT,
    "penyebabKetidaksesuaian" TEXT,
    "tindakanPerbaikan" TEXT,
    "tindakanPencegahan" TEXT,
    "fotoSebelum" TEXT,
    "fotoClosing" TEXT,
    "waktu" TIMESTAMP(3) NOT NULL,
    "statusAkhir" TEXT NOT NULL,

    CONSTRAINT "USATemuan_pkey" PRIMARY KEY ("id")
);
