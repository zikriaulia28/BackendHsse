const prisma = require('../../lib/prismaClient');

const createCar = async (req, res) => {
  const { nopol, model } = req.body;

  try {
    const existingCar = await prisma.car.findUnique({
      where: { nopol },
    });

    if (existingCar) {
      return res.status(400).json({ error: "Mobil dengan nopol tersebut sudah ada." });
    }

    const newCar = await prisma.car.create({
      data: { nopol, model },
    });

    res.json(newCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating car" });
  }
};

const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching cars" });
  }
};

module.exports = {
  createCar,
  getAllCars,
};
