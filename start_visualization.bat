@echo off
echo 正在启动互动可视化网页...
echo.

REM 检查Python是否可用
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Python，请确保Python已安装并添加到PATH环境变量
    echo 或者直接双击打开 interactive_visualization.html 文件
    pause
    exit /b 1
)

REM 启动简单的HTTP服务器
echo 启动本地服务器...
echo 在浏览器中打开: http://localhost:8000/interactive_visualization.html
echo 按 Ctrl+C 停止服务器
echo.

python -m http.server 8000

pause