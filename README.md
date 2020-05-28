## introduction

nodejs 库，完成文件的读写

## api

```js
const Mango = require("fs-mango");
const db = new Mango({ root: "/User/wangyongfeng" });
db.rDir();
```

| api                   | 返回       | 用途                              |
| --------------------- | ---------- | --------------------------------- |
| rDir(dirname)         | string[]   | 读取目录                          |
| wDir(dirname, flag)   | void       | 创建目录，flag 为 null 时表示删除 |
| rFile(filename)       | ReadStream | 读取文件                          |
| wFile(filename, data) | Promise    | 写文件，flag 为 null 表示删除     |
| cp(name, newName)     | void       | 重命名，支持文件/目录             |
