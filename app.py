from flask import Flask, render_template, request, jsonify
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# 确保上传目录存在
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def detect_date_column(df):
    """自动检测日期时间列"""
    for col in df.columns:
        # 尝试将列转换为日期时间
        try:
            # 检查列名是否包含日期相关关键词
            if any(keyword in col.lower() for keyword in ['date', 'time', 'year', 'month', 'day']):
                df[col] = pd.to_datetime(df[col])
                return col
        except:
            continue
    
    # 如果没有明确的时间列，尝试第一列
    try:
        df[df.columns[0]] = pd.to_datetime(df[df.columns[0]])
        return df.columns[0]
    except:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': '没有选择文件'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': '没有选择文件'}), 400
    
    if not file.filename.endswith('.csv'):
        return jsonify({'error': '只支持CSV文件'}), 400
    
    try:
        # 保存文件
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # 读取CSV文件
        df = pd.read_csv(filepath)
        
        # 获取数据信息
        columns = df.columns.tolist()
        numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
        date_column = detect_date_column(df)
        
        # 返回文件信息和前几行数据
        data_info = {
            'filename': filename,
            'columns': columns,
            'numeric_columns': numeric_columns,
            'date_column': date_column,
            'preview': df.head(10).to_dict('records')
        }
        
        return jsonify(data_info)
    
    except Exception as e:
        return jsonify({'error': f'文件处理错误: {str(e)}'}), 500

@app.route('/chart-data', methods=['POST'])
def get_chart_data():
    data = request.json
    filename = data.get('filename')
    selected_columns = data.get('columns', [])
    
    if not filename or not selected_columns:
        return jsonify({'error': '缺少必要参数'}), 400
    
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        df = pd.read_csv(filepath)
        
        # 检测日期列
        date_column = detect_date_column(df)
        
        if date_column:
            # 按日期排序
            df = df.sort_values(date_column)
            x_data = df[date_column].astype(str).tolist()
        else:
            # 使用索引作为X轴
            x_data = list(range(len(df)))
        
        # 生成系列数据
        series_data = []
        for col in selected_columns:
            if col in df.columns:
                series_data.append({
                    'name': col,
                    'type': 'line',
                    'data': df[col].tolist()
                })
        
        chart_data = {
            'xAxis': x_data,
            'series': series_data
        }
        
        return jsonify(chart_data)
    
    except Exception as e:
        return jsonify({'error': f'生成图表数据错误: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)