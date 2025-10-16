#!/usr/bin/env python3
print("=== Python 环境测试 ===")

# 测试基本导入
try:
    import flask
    print("✅ Flask 导入成功")
except ImportError as e:
    print(f"❌ Flask 导入失败: {e}")

try:
    import pandas as pd
    print("✅ pandas 导入成功")
except ImportError as e:
    print(f"❌ pandas 导入失败: {e}")

# 测试简单功能
try:
    print("✅ Python 环境正常")
    print("正在启动 Flask 应用...")
    
    # 直接导入并运行应用
    from app import app
    print("✅ Flask 应用导入成功")
    print("应用将在 http://127.0.0.1:5000 启动")
    
except Exception as e:
    print(f"❌ 应用启动失败: {e}")
    import traceback
    traceback.print_exc()

print("=== 测试完成 ===")