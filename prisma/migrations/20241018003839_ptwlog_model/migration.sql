-- CreateTable
CREATE TABLE "PTWLog" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "noPTW" TEXT NOT NULL,
    "workDescription" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "typeOfWork" TEXT NOT NULL,
    "receivingAuthority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "hsseRemark" TEXT,
    "scan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PTWLog_pkey" PRIMARY KEY ("id")
);
