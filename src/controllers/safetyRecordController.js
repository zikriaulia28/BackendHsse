const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Mendapatkan semua rekaman safety
const getAllSafetyRecords = async (req, res) => {
  try {
    const safetyRecords = await prisma.safetyRecord.findMany();
    res.json(safetyRecords);
  } catch (error) {
    console.error('Error fetching safety records:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data.' });
  }
};

// Menambahkan rekaman safety baru
const createSafetyRecord = async (req, res) => {
  try {
    const {
      date,
      monthlySafeManhours,
      ytdSafeManhours,
      cumulativeSafeManhours,
      monthlySafeDriving,
      ytdSafeDriving,
      cumulativeSafeDriving,
      fatality,
      lostTimeInjury,
      incidentAccident,
      totalSicknessAbsence,
      sicknessAbsenceFrequency,
      environmentPollution,
      securityIncident
    } = req.body;

    // Pastikan data yang harusnya integer dikonversi dari string ke integer
    const newRecord = await prisma.safetyRecord.create({
      data: {
        date: new Date(date),
        monthlySafeManhours: parseInt(monthlySafeManhours),
        ytdSafeManhours: parseInt(ytdSafeManhours),
        cumulativeSafeManhours: parseFloat(cumulativeSafeManhours),
        monthlySafeDriving: parseInt(monthlySafeDriving),
        ytdSafeDriving: parseInt(ytdSafeDriving),
        cumulativeSafeDriving: parseFloat(cumulativeSafeDriving),
        fatality: parseInt(fatality),
        lostTimeInjury: parseInt(lostTimeInjury),
        incidentAccident: parseInt(incidentAccident),
        totalSicknessAbsence: parseInt(totalSicknessAbsence),
        sicknessAbsenceFrequency: parseFloat(sicknessAbsenceFrequency),
        environmentPollution: parseInt(environmentPollution),
        securityIncident: parseInt(securityIncident)
      },
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error creating safety record:", error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat data.' });
  }
};

// Mengupdate rekaman safety
const updateSafetyRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Pastikan data numerik juga dikonversi sebelum update jika diperlukan
    const updatedData = {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      monthlySafeManhours: data.monthlySafeManhours ? parseInt(data.monthlySafeManhours) : undefined,
      ytdSafeManhours: data.ytdSafeManhours ? parseInt(data.ytdSafeManhours) : undefined,
      cumulativeSafeManhours: data.cumulativeSafeManhours ? parseFloat(data.cumulativeSafeManhours) : undefined,
      monthlySafeDriving: data.monthlySafeDriving ? parseInt(data.monthlySafeDriving) : undefined,
      ytdSafeDriving: data.ytdSafeDriving ? parseInt(data.ytdSafeDriving) : undefined,
      cumulativeSafeDriving: data.cumulativeSafeDriving ? parseFloat(data.cumulativeSafeDriving) : undefined,
      fatality: data.fatality ? parseInt(data.fatality) : undefined,
      lostTimeInjury: data.lostTimeInjury ? parseInt(data.lostTimeInjury) : undefined,
      incidentAccident: data.incidentAccident ? parseInt(data.incidentAccident) : undefined,
      totalSicknessAbsence: data.totalSicknessAbsence ? parseInt(data.totalSicknessAbsence) : undefined,
      sicknessAbsenceFrequency: data.sicknessAbsenceFrequency ? parseFloat(data.sicknessAbsenceFrequency) : undefined,
      environmentPollution: data.environmentPollution ? parseInt(data.environmentPollution) : undefined,
      securityIncident: data.securityIncident ? parseInt(data.securityIncident) : undefined,
    };

    const updatedRecord = await prisma.safetyRecord.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    res.json(updatedRecord);
  } catch (error) {
    console.error("Error updating safety record:", error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui data.' });
  }
};

// Menghapus rekaman safety
const deleteSafetyRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.safetyRecord.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error("Error deleting safety record:", error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus data.' });
  }
};

module.exports = {
  getAllSafetyRecords,
  createSafetyRecord,
  updateSafetyRecord,
  deleteSafetyRecord
}