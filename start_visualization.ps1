# PowerShell启动脚本 - 互动数据可视化平台
Write-Host "正在启动互动可视化网页..." -ForegroundColor Green
Write-Host ""

# 检查Python是否可用
try {
    $pythonVersion = python --version 2>&1
    Write-Host "检测到Python: $pythonVersion" -ForegroundColor Cyan
} catch {
    Write-Host "警告: 未找到Python，将尝试直接打开HTML文件" -ForegroundColor Yellow
}

# 检查文件是否存在
if (Test-Path "interactive_visualization.html") {
    Write-Host "找到可视化文件: interactive_visualization.html" -ForegroundColor Green
} else {
    Write-Host "错误: 未找到interactive_visualization.html文件" -ForegroundColor Red
    Read-Host "按Enter键退出"
    exit
}

# 提供多种启动方式
Write-Host "请选择启动方式:" -ForegroundColor Yellow
Write-Host "1. 启动本地服务器（推荐）"
Write-Host "2. 直接打开HTML文件"
Write-Host "3. 查看文件列表"
Write-Host ""

$choice = Read-Host "请输入选择 (1-3)"

switch ($choice) {
    "1" {
        Write-Host "启动本地HTTP服务器..." -ForegroundColor Cyan
        Write-Host "服务器地址: http://localhost:8000" -ForegroundColor Cyan
        Write-Host "访问地址: http://localhost:8000/interactive_visualization.html" -ForegroundColor Cyan
        Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
        Write-Host ""
        
        try {
            # 启动Python HTTP服务器
            python -m http.server 8000
        } catch {
            Write-Host "启动服务器失败，尝试使用其他端口..." -ForegroundColor Red
            try {
                python -m http.server 8080
            } catch {
                Write-Host "无法启动服务器，请检查Python安装" -ForegroundColor Red
            }
        }
    }
    "2" {
        Write-Host "直接打开HTML文件..." -ForegroundColor Cyan
        try {
            Invoke-Item "interactive_visualization.html"
            Write-Host "文件已打开，请在浏览器中查看" -ForegroundColor Green
        } catch {
            Write-Host "打开文件失败" -ForegroundColor Red
        }
        Read-Host "按Enter键退出"
    }
    "3" {
        Write-Host "当前目录文件列表:" -ForegroundColor Cyan
        Get-ChildItem -Name *.html, *.css, *.js, *.bat, *.ps1, *.md | ForEach-Object {
            Write-Host "  $_" -ForegroundColor White
        }
        Write-Host ""
        Read-Host "按Enter键返回主菜单"
        & $MyInvocation.MyCommand.Path
    }
    default {
        Write-Host "无效选择，使用默认方式启动服务器..." -ForegroundColor Yellow
        python -m http.server 8000
    }
}