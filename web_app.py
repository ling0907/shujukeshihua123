from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd
import os
import json
from datetime import datetime
from werkzeug.utils import secure_filename
import io

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

# 确保上传目录存在
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 预定义数据集
PREDEFINED_DATASETS = {
    '气温数据': {
        'filename': '气温数据.csv',
        'data': '''天数,最高气温,最低气温
4,32,19
5,33,19
6,34,20
7,34,22
8,33,22
9,31,21
10,30,22
11,29,16
12,30,18
13,29,18
14,26,17
15,23,14
16,21,15
17,25,16
18,31,16''',
        'description': '未来15天最高气温和最低气温数据'
    },
    '阿里巴巴GMV数据': {
        'filename': '阿里巴巴GMV数据.csv',
        'data': '''财年,GMV(亿元)
FY2013,10770
FY2014,16780
FY2015,24440
FY2016,30920
FY2017,37670
FY2018,48200
FY2019,57270''',
        'description': '2013-2019财年阿里巴巴GMV数据'
    },
    '网购替代率数据': {
        'filename': '网购替代率数据.csv',
        'data': '''商品种类,替代率
家政、家教、保姆等生活服务,0.959
飞机票、火车票,0.951
家具,0.935
手机、手机配件,0.924
计算机及其配套产品,0.893
汽车用品,0.892
通信充值、游戏充值,0.865
个人护理用品,0.863
书报杂志及音像制品,0.860
餐饮、旅游、住宿,0.856
家用电器,0.854
食品、饮料、烟酒、保健品,0.835
家庭日杂用品,0.826
保险、演出票务,0.816
服装、鞋帽、家用纺织品,0.798
数码产品,0.765
其他商品和服务,0.763
工艺品、收藏品,0.670''',
        'description': '各商品种类网购替代率数据'
    },
    '物流费用数据': {
        'filename': '物流费用数据.csv',
        'data': '''月份,公司A费用,公司B费用,公司C费用
1,198,203,185
2,215,236,205
3,245,200,226
4,222,236,199
5,200,269,238
6,236,216,200
7,201,298,250
8,253,333,209
9,236,301,246
10,200,349,219
11,266,360,253
12,290,368,288''',
        'description': '三家物流公司月度费用数据'
    },
    '汽车速度制动距离数据': {
        'filename': '汽车速度制动距离数据.csv',
        'data': '''速度(km/h),制动距离(m)
10,0.5
20,2.0
30,4.4
40,7.9
50,12.3
60,17.7
70,24.1
80,31.5
90,39.9
100,49.2
110,59.5
120,70.8
130,83.1
140,96.4
150,110.7
160,126.0
170,142.2
180,159.4
190,177.6
200,196.8''',
        'description': '汽车速度与制动距离关系数据'
    }
}

def parse_csv_data(csv_text):
    """解析CSV数据"""
    lines = csv_text.strip().split('\n')
    if len(lines) < 2:
        return {'headers': [], 'data': []}
    
    headers = [h.strip() for h in lines[0].split(',')]
    data = []
    
    for line in lines[1:]:
        if line.strip():
            values = [v.strip() for v in line.split(',')]
            row = {}
            for i, header in enumerate(headers):
                if i < len(values):
                    # 尝试转换为数字
                    try:
                        row[header] = float(values[i]) if values[i] else None
                    except ValueError:
                        row[header] = values[i]
                else:
                    row[header] = None
            data.append(row)
    
    return {'headers': headers, 'data': data}

def generate_chart_config(chart_type, data, x_axis, y_axis, series=None):
    """生成ECharts配置"""
    if not data or not x_axis or not y_axis:
        return None
    
    # 基础配置
    config = {
        'title': {
            'text': f'{chart_type} - {x_axis} vs {y_axis}',
            'left': 'center'
        },
        'tooltip': {
            'trigger': 'axis' if chart_type != '饼图' else 'item'
        },
        'grid': {
            'left': '3%',
            'right': '4%',
            'bottom': '3%',
            'containLabel': True
        },
        'toolbox': {
            'feature': {
                'saveAsImage': {
                    'title': '保存为图片'
                }
            }
        }
    }
    
    if chart_type == '折线图':
        config['xAxis'] = {
            'type': 'category',
            'data': [str(item.get(x_axis, '')) for item in data]
        }
        config['yAxis'] = {'type': 'value'}
        config['series'] = [{
            'name': y_axis,
            'type': 'line',
            'data': [item.get(y_axis) for item in data],
            'smooth': True
        }]
        
    elif chart_type == '柱状图':
        config['xAxis'] = {
            'type': 'category',
            'data': [str(item.get(x_axis, '')) for item in data]
        }
        config['yAxis'] = {'type': 'value'}
        config['series'] = [{
            'name': y_axis,
            'type': 'bar',
            'data': [item.get(y_axis) for item in data]
        }]
        
    elif chart_type == '饼图':
        config['series'] = [{
            'type': 'pie',
            'radius': '50%',
            'data': [
                {
                    'name': str(item.get(x_axis, '')),
                    'value': item.get(y_axis)
                }
                for item in data if item.get(y_axis) is not None
            ],
            'emphasis': {
                'itemStyle': {
                    'shadowBlur': 10,
                    'shadowOffsetX': 0,
                    'shadowColor': 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
        
    elif chart_type == '散点图':
        config['xAxis'] = {'type': 'value'}
        config['yAxis'] = {'type': 'value'}
        config['series'] = [{
            'type': 'scatter',
            'data': [
                [item.get(x_axis), item.get(y_axis)]
                for item in data 
                if item.get(x_axis) is not None and item.get(y_axis) is not None
            ],
            'symbolSize': 20
        }]
    
    return config

@app.route('/')
def index():
    """主页面"""
    return render_template('web_index.html')

@app.route('/api/datasets')
def get_datasets():
    """获取预定义数据集列表"""
    datasets = []
    for name, info in PREDEFINED_DATASETS.items():
        datasets.append({
            'name': name,
            'filename': info['filename'],
            'description': info['description']
        })
    return jsonify(datasets)

@app.route('/api/dataset/<dataset_name>')
def get_dataset(dataset_name):
    """获取特定数据集"""
    if dataset_name in PREDEFINED_DATASETS:
        csv_data = PREDEFINED_DATASETS[dataset_name]['data']
        parsed_data = parse_csv_data(csv_data)
        return jsonify(parsed_data)
    return jsonify({'error': '数据集不存在'}), 404

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """处理文件上传"""
    if 'file' not in request.files:
        return jsonify({'error': '没有选择文件'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': '没有选择文件'}), 400
    
    if not file.filename.lower().endswith('.csv'):
        return jsonify({'error': '只支持CSV文件'}), 400
    
    try:
        # 读取文件内容
        csv_text = file.read().decode('utf-8')
        parsed_data = parse_csv_data(csv_text)
        
        return jsonify({
            'success': True,
            'data': parsed_data,
            'filename': file.filename
        })
        
    except Exception as e:
        return jsonify({'error': f'文件处理错误: {str(e)}'}), 500

@app.route('/api/chart/generate', methods=['POST'])
def generate_chart():
    """生成图表配置"""
    data = request.json
    chart_type = data.get('chart_type')
    csv_data = data.get('data')
    x_axis = data.get('x_axis')
    y_axis = data.get('y_axis')
    
    if not all([chart_type, csv_data, x_axis, y_axis]):
        return jsonify({'error': '缺少必要参数'}), 400
    
    try:
        chart_config = generate_chart_config(chart_type, csv_data, x_axis, y_axis)
        if chart_config:
            return jsonify({'success': True, 'config': chart_config})
        else:
            return jsonify({'error': '生成图表配置失败'}), 500
            
    except Exception as e:
        return jsonify({'error': f'生成图表错误: {str(e)}'}), 500

@app.route('/api/data/preview')
def data_preview():
    """获取数据预览"""
    dataset_name = request.args.get('dataset')
    if dataset_name in PREDEFINED_DATASETS:
        csv_data = PREDEFINED_DATASETS[dataset_name]['data']
        parsed_data = parse_csv_data(csv_data)
        return jsonify(parsed_data)
    return jsonify({'error': '数据集不存在'}), 404

@app.route('/api/export/csv', methods=['POST'])
def export_csv():
    """导出CSV文件"""
    data = request.json
    headers = data.get('headers', [])
    rows = data.get('data', [])
    
    # 创建CSV内容
    output = io.StringIO()
    output.write(','.join(headers) + '\n')
    
    for row in rows:
        line = []
        for header in headers:
            value = row.get(header, '')
            line.append(str(value))
        output.write(','.join(line) + '\n')
    
    output.seek(0)
    
    return send_file(
        io.BytesIO(output.getvalue().encode('utf-8')),
        mimetype='text/csv',
        as_attachment=True,
        download_name='exported_data.csv'
    )

if __name__ == '__main__':
    # 创建模板目录
    os.makedirs('templates', exist_ok=True)
    
    # 启动应用
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)