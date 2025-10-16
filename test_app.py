#!/usr/bin/env python3
import sys
import os

# 添加当前目录到 Python 路径
sys.path.insert(0, os.path.dirname(__file__))

try:
    from app import app
    print("Flask 应用导入成功")
    
    # 测试路由
    with app.test_client() as client:
        response = client.get('/')
        print(f"首页路由测试: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Flask 应用运行正常")
        else:
            print("❌ Flask 应用运行异常")
            
except Exception as e:
    print(f"错误: {e}")
    import traceback
    traceback.print_exc()