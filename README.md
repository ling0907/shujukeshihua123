# 可视化网页项目

## 项目概述
这是一个基于HTML的可视化网页项目，包含静态资源和模板文件。

## 项目结构
```
miniconda3/
├── static/          # 静态资源
│   ├── css/         # 样式文件
│   ├── js/          # JavaScript文件
│   └── uploads/     # 上传文件
└── templates/       # 网页模板
    ├── index.html   # 主页面
    └── web_index.html
```

## 使用说明
1. 确保Python环境已安装
2. 启动开发服务器：
   ```bash
   python -m http.server 8000
   ```
3. 访问 http://localhost:8000/templates/index.html

## 部署到GitHub
1. 初始化Git仓库：
   ```bash
   git init
   git add .
   git commit -m "初始提交"
   ```
2. 在GitHub创建新仓库
3. 添加远程仓库并推送：
   ```bash
   git remote add origin [您的仓库URL]
   git push -u origin main