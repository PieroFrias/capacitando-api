import fs from "fs";

const deleteImage = (imgRoute) => {
  fs.unlink(imgRoute, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Imagen eliminada correctamente");
    }
  });
};

export default deleteImage;
