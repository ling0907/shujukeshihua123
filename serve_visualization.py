import http.server
import socketserver
import webbrowser
import os

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    PORT = 8000
    
    # 切换到当前目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
        print(f"🌐 可视化网页服务器已启动!")
        print(f"📊 访问地址: http://localhost:{PORT}/数据可视化平台.html")
        print("💡 您可以直接在浏览器中打开上述链接使用可视化工具")
        print("⏹️  按 Ctrl+C 停止服务器")
        
        # 自动打开浏览器
        webbrowser.open(f'http://localhost:{PORT}/数据可视化平台.html')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 服务器已停止")

if __name__ == "__main__":
    main()