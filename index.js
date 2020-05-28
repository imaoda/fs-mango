const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class Mango {
  constructor({ root }) {
    if (root[0] !== "/") throw new Error("根路径需要绝对地址");
    this.root = root;

    // 统一加上 tryCatch
  }

  _exact(dir) {
    if (dir.match("..")) throw new Error("非法路径");
    return path.resolve(this.root, dir);
  }

  // 读取路径下的内容
  rDir(dir) {
    dir = this._exact(dir);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      return [];
    } else {
      return fs.readdirSync(dir);
    }
  }

  /**
   *
   * @param {*} dir
   * @param {*} flag 如果传递 null 则表示删除
   */
  wDir(dir, flag) {
    dir = this._exact(dir);
    if (dir === this.root && flag === null) throw new Error("不支持删除根目录");
    execSync(`mkdir -p ${dir}`);
    if (flag === null) {
      execSync(`rm -fr ${dir}`);
    }
  }

  // 读文件 (多数场景用不到 stream，直接 fs.sendFile 就好)
  rFile(dir) {
    dir = this._exact(dir);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isFile()) {
      throw new Error("没有该文件");
    } else {
      return fs.createReadStream(dir);
    }
  }

  /**
   *
   * @param {*} dir
   * @param {*} stream 支持 str buffer stream。以及 特殊的 null，null 会删除原文件
   */
  wFile(dir, stream) {
    dir = this._exact(dir);
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory())
      throw new Error("已存在同名文件夹");
    // 删除原文件
    if (fs.existsSync(dir)) execSync(`rm -rf ${dir}`);
    execSync(`mkdir -p ${path.dirname(dir)}`);
    return new Promise((resolve, reject) => {
      if (typeof stream === "string" || stream instanceof Buffer) {
        fs.writeFileSync(dir, stream);
        resolve();
      } else if (stream === null) {
        // 达到删除的目的
        resolve();
      } else {
        stream.pipe(fs.createWriteStream(dir));
        stream.on("end", resolve);
      }
    });
  }

  // 重命名目录/文件
  mv(oldName, newName) {
    oldName = this._exact(oldName);
    newName = this._exact(newName);
    let errorMsg = "";
    if (!fs.existsSync(oldName)) errorMsg = "不存在当前目录/文件";
    if (fs.existsSync(newName)) errorMsg = "该路径名已存在";
    if (errorMsg) throw new Error(errorMsg);
    execSync(`mv ${oldName} ${newName}`);
  }
}

module.exports = Mango;
