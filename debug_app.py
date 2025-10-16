#!/usr/bin/env python3
import sys
import os
import traceback

print("=== Flask 应用调试脚本 ===")

# 检查当前目录
print(f"当前目录: {os.getcwd()}")
print(f"Python 路径: {sys.path}")

# 检查依赖导入
try:
    import flask
    print("✅ Flask 导入成功")
except ImportError as e:
    print(f"❌ Flask 导入失败: {e}")

try:
    import pandas
    print("✅ pandas 导入成功")
except ImportError as e:
    print(f"❌ pandas 导入失败: {e}")

try:
    from datetime import datetime
    print("✅ datetime 导入成功")
except ImportError as e:
    print(f"❌ datetime 导入失败: {e}")

# 尝试导入应用
try:
    from app import app
    print("✅ Flask 应用导入成功")
    
    # 测试路由
    with app.test_client() as client:
        response = client.get('/')
        print(f"首页路由状态: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ 应用运行正常")
        else:
            print("❌ 应用运行异常")
            
except Exception as e:
    print(f"❌ 应用导入失败: {e}")
    traceback.print_exc()

print("=== 调试完成 ===")