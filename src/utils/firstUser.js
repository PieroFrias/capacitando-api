import User from "../infrastructure/data_access/userModel.js"

const creatAdmin = async () => {
  try {
    const count = await User.findAndCountAll();

    if (count.count > 0) return;

    const adminUser = await User.create({
      usuario: "admin",
      password: "capacitando@2023",
      rol: 1,
    });

    console.log("Usuario admin creado", adminUser);
  } catch (error) {
    console.error(error);
  }
};

export default creatAdmin;