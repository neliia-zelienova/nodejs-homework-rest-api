const path = require("path");
const createFolder = require("../helpers/create-dir");
const fs = require("fs/promises");
const Jimp = require("jimp");

class Upload {
  constructor(USERS_AVATARS) {
    this.USERS_AVATARS = USERS_AVATARS;
  }

  async transformAvatar(filePath) {
    const file = await Jimp.read(filePath);
    await file
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(filePath);
  }

  async saveAvatarToStatic({ userId, filePath, name, oldFile }) {
    await this.transformAvatar(filePath);
    const userFolderAvatar = path.join(this.USERS_AVATARS, userId);
    await createFolder(userFolderAvatar);
    await fs.rename(filePath, path.join(userFolderAvatar, name));
    await this.deleteOldAvatar(
      path.join(process.cwd(), this.USERS_AVATARS, oldFile)
    );
    const avatarUrl = path.normalize(path.join(userId, name));
    return avatarUrl;
  }

  async deleteOldAvatar(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = Upload;
