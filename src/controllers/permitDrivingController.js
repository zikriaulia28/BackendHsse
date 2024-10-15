const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Utility function untuk error logging
const handleError = (res, error, message, statusCode = 500) => {
  console.error(error);
  res.status(statusCode).json({ error: message });
};

// Endpoint untuk mendapatkan semua permitDriving
const getAllPermitDriving = async (req, res) => {
  try {
    const permitDriving = await prisma.permitDriving.findMany({
      include: { car: true },
    });

    if (permitDriving.length === 0) {
      return res.status(404).json({ message: "Tidak ada data permit driving yang ditemukan" });
    }

    res.json(permitDriving);
  } catch (error) {
    handleError(res, error, "Gagal mengambil data permit driving");
  }
};

// Endpoint untuk mendapatkan semua permitDriving dengan nopol dan model
const getPermitDrivingDetails = async (req, res) => {
  try {
    const permitData = await prisma.permitDriving.findMany({
      include: {
        car: {
          select: {
            nopol: true,
            model: true,
          },
        },
      },
    });

    if (permitData.length === 0) {
      return res.status(404).json({ message: "Detail permit driving tidak ditemukan" });
    }

    res.json(permitData);
  } catch (error) {
    handleError(res, error, "Gagal mengambil detail permit driving");
  }
};

// Endpoint untuk menambahkan permitDriving baru
const createPermitDriving = async (req, res) => {
  const data = req.body;

  try {
    const date = new Date(data.date);
    const jamKeluar = new Date(`${data.date}T${data.jamKeluar}:00.000Z`);

    // Cek apakah mobil sudah memiliki permit yang belum selesai
    const existingPermit = await prisma.permitDriving.findFirst({
      where: {
        carId: Number(data.carId),
        OR: [
          { status: "waiting" },
          { jamMasuk: null } // Jika belum ada jam masuk, permit masih aktif
        ]
      },
    });

    if (existingPermit) {
      return res.status(400).json({
        error: `Mobil dengan ID ${data.carId} sudah memiliki permit yang aktif. Silakan selesaikan permit sebelumnya.`
      });
    }

    const recordData = {
      date: date,
      namaPengemudi: data.namaPengemudi,
      tujuan: data.tujuan,
      barangBawaan: data.barangBawaan,
      pemohon: data.pemohon,
      pemberiIzin: data.pemberiIzin,
      petugasSecurity: data.petugasSecurity,
      kmAwal: data.kmAwal,
      status: "waiting",
      jamKeluar: jamKeluar,
      jamMasuk: null,
      fuelLevel: data.fuelLevel,
      car: { connect: { id: Number(data.carId) } },
    };

    const newRecord = await prisma.permitDriving.create({
      data: recordData,
    });

    res.json(newRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating record" });
  }
};


// Endpoint untuk memperbarui status permitDriving
const updatePermitDrivingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, kmAkhir, jamMasuk, fuelLevel } = req.body;

  try {
    const permitDriving = await prisma.permitDriving.findUnique({
      where: { id: Number(id) },
    });

    if (!permitDriving) {
      return res.status(404).json({ error: "Permit tidak ditemukan" });
    }

    if (kmAkhir && Number(kmAkhir) < Number(permitDriving.kmAwal)) {
      return res.status(400).json({
        error: `KM Akhir tidak boleh lebih kecil dari KM Awal (${permitDriving.kmAwal})`,
      });
    }

    // Siapkan objek data untuk pembaruan
    const dataToUpdate = { status }; // Hanya status yang perlu diupdate

    // Cek apakah ada nilai lain yang perlu diupdate
    if (kmAkhir !== undefined) {
      dataToUpdate.kmAkhir = kmAkhir; // Tambahkan jika ada
    }
    if (jamMasuk) {
      // Validasi jamMasuk jika diberikan
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      // Misalkan jamMasuk berisi waktu dalam format "HH:mm"
      const formattedJamMasuk = `${year}-${month}-${day}T${jamMasuk}:00Z`; // Format ISO-8601
      dataToUpdate.jamMasuk = formattedJamMasuk; // Tambahkan jika ada
    }
    if (fuelLevel !== undefined) {
      dataToUpdate.fuelLevel = fuelLevel; // Tambahkan jika ada
    }

    // Lakukan update
    const updatedPermitDriving = await prisma.permitDriving.update({
      where: { id: Number(id) },
      data: dataToUpdate, // Gunakan objek yang telah disiapkan
    });

    res.json(updatedPermitDriving);
  } catch (error) {
    handleError(res, error, "Gagal memperbarui status permit driving", 500);
    console.log(error);
  }
};




// Endpoint untuk filter permitDriving berdasarkan tanggal, bulan, atau tahun
const filterPermitDriving = async (req, res) => {
  const { date, month, year } = req.query;

  try {
    let whereClause = {};

    if (date) {
      whereClause.date = new Date(date);
    } else if (month && year) {
      whereClause.date = {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${year}-${Number(month) + 1}-01`),
      };
    } else if (year) {
      whereClause.date = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${Number(year) + 1}-01-01`),
      };
    }

    // Jika tidak ada parameter yang diisi, maka tidak ada filter dan akan menampilkan semua data
    const permitDriving = await prisma.permitDriving.findMany({
      where: whereClause, // whereClause tetap kosong jika tidak ada filter
      include: {
        car: true,
        user: true,
      },
    });

    if (permitDriving.length === 0) {
      return res.status(404).json({ message: "Data permit driving tidak ditemukan untuk filter yang diberikan" });
    }

    res.json(permitDriving);
  } catch (error) {
    handleError(res, error, "Gagal melakukan filter permit driving", 500);
  }
};


// Endpoint untuk menambah data penggunaan mobil (UsageLog)
const createUsageLog = async (req, res) => {
  const { permitId } = req.body; // Ambil permitId dari body request

  try {
    // Temukan record PermitDriving berdasarkan permitId
    const permitDriving = await prisma.permitDriving.findUnique({
      where: { id: Number(permitId) },
    });

    // Validasi jika permit tidak ditemukan
    if (!permitDriving) {
      return res.status(404).json({ error: "Permit tidak ditemukan" });
    }

    // Konversi kmAwal dan kmAkhir ke angka
    const kmAwal = Number(permitDriving.kmAwal);
    const kmAkhir = Number(permitDriving.kmAkhir);

    // Hitung kmUsed
    const kmUsed = kmAkhir - kmAwal;

    // Validasi jika kmUsed harus lebih dari 0
    if (kmUsed <= 0) {
      return res.status(400).json({ error: "KM digunakan harus lebih dari 0" });
    }

    // Buat record baru di tabel UsageLog
    const newUsageLog = await prisma.usageLog.create({
      data: {
        date: new Date(), // Atau bisa ambil dari request body jika perlu
        carId: permitDriving.carId, // Pastikan Anda mengambil carId dari permitDriving
        kmUsed: kmUsed,
      },
    });

    res.json(newUsageLog);
  } catch (error) {
    console.error("Error creating usage log:", error.message);
    res.status(500).json({ error: "Error creating usage log" });
  }
};



// const getTotalKmUsage = async (req, res) => {
//   const { date, month, year } = req.query;

//   try {
//     let usageLogs;

//     // Jika ada query 'date'
//     if (date) {
//       usageLogs = await prisma.usageLog.findMany({
//         where: {
//           date: new Date(date),
//         },
//         include: { car: true },
//       });
//     }
//     // Jika ada query 'month'
//     else if (month) {
//       const [yearPart, monthPart] = month.split("-");
//       usageLogs = await prisma.usageLog.findMany({
//         where: {
//           date: {
//             gte: new Date(`${yearPart}-${monthPart}-01`),
//             lt: new Date(`${yearPart}-${parseInt(monthPart) + 1}-01`),
//           },
//         },
//         include: { car: true },
//       });
//     }
//     // Jika ada query 'year'
//     else if (year) {
//       usageLogs = await prisma.usageLog.findMany({
//         where: {
//           date: {
//             gte: new Date(`${year}-01-01`),
//             lt: new Date(`${parseInt(year) + 1}-01-01`),
//           },
//         },
//         include: { car: true },
//       });
//     }
//     // Jika tidak ada query
//     else {
//       return res.status(400).json({ error: "Please provide date, month, or year query" });
//     }

//     if (usageLogs.length === 0) {
//       return res.status(404).json({ message: "No usage logs found for the given date range" });
//     }

//     // Menghitung total KM yang digunakan
//     const totalKmUsed = usageLogs.reduce((total, log) => total + log.kmUsed, 0);

//     res.json({
//       totalKmUsed,
//       usageLogs,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error fetching usage logs" });
//   }
// };

const getTotalKmUsage = async (req, res) => {
  const { year, month } = req.query;

  try {
    let usageLogs;

    // Jika hanya tahun diberikan
    if (year && !month) {
      usageLogs = await prisma.usageLog.findMany({
        where: {
          date: {
            gte: new Date(`${year}-01-01`), // Mulai dari 1 Januari
            lt: new Date(`${parseInt(year) + 1}-01-01`), // Sampai sebelum 1 Januari tahun berikutnya
          },
        },
        include: { car: true },
      });
    }
    // Jika tahun dan bulan diberikan
    else if (year && month) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(year, month, 0); // Menggunakan 0 untuk mendapatkan hari terakhir bulan tersebut

      usageLogs = await prisma.usageLog.findMany({
        where: {
          date: {
            gte: startDate,
            lt: new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1), // Tanggal pertama bulan berikutnya
          },
        },
        include: { car: true },
      });
    } else {
      return res.status(400).json({ error: "Please provide year and optionally month query" });
    }

    if (usageLogs.length === 0) {
      return res.status(404).json({ message: "No usage logs found for the given date range" });
    }

    // Mengelompokkan dan menjumlahkan kmUsed berdasarkan car
    const groupedUsage = usageLogs.reduce((acc, log) => {
      const carId = log.car.id; // Asumsikan id dari car
      if (!acc[carId]) {
        acc[carId] = {
          car: log.car,
          totalKmUsed: 0,
          lastDate: log.date, // Menyimpan tanggal terakhir penggunaan
        };
      }
      acc[carId].totalKmUsed += log.kmUsed; // Menjumlahkan kmUsed
      acc[carId].lastDate = log.date; // Memperbarui tanggal terakhir penggunaan
      return acc;
    }, {});

    // Mengubah objek menjadi array dan format tanggal
    const totalUsageLogs = Object.values(groupedUsage).map(log => ({
      car: log.car,
      totalKmUsed: log.totalKmUsed,
      lastDate: log.lastDate, // Menyertakan tanggal terakhir
    }));

    res.json({
      totalUsageLogs, // Mengembalikan hasil yang telah dikelompokkan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching usage logs" });
  }
};



module.exports = {
  getAllPermitDriving,
  getPermitDrivingDetails,
  createPermitDriving,
  updatePermitDrivingStatus,
  filterPermitDriving,
  getTotalKmUsage,
  createUsageLog
};
