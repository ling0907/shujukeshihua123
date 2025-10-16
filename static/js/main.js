// CSV 图表生成器前端逻辑
document.addEventListener('DOMContentLoaded', function() {
    let currentData = null;
    let chartInstance = null;
    
    // 初始化 ECharts 图表
    const chartDom = document.getElementById('chart-container');
    chartInstance = echarts.init(chartDom);
    
    // 初始化 Ant Design 组件
    initUploadComponent();
    
    // 初始化文件上传组件
    function initUploadComponent() {
        const uploadArea = document.getElementById('upload-area');
        
        // 创建上传按钮
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'ant-btn ant-btn-primary ant-btn-lg';
        uploadBtn.innerHTML = '<span>选择 CSV 文件</span>';
        uploadBtn.onclick = triggerFileInput;
        
        const uploadDesc = document.createElement('p');
        uploadDesc.style.marginTop = '12px';
        uploadDesc.style.color = '#666';
        uploadDesc.textContent = '支持上传 CSV 文件，文件大小不超过 16MB';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';
        fileInput.onchange = handleFileUpload;
        
        uploadArea.appendChild(uploadBtn);
        uploadArea.appendChild(uploadDesc);
        uploadArea.appendChild(fileInput);
    }
    
    function triggerFileInput() {
        document.querySelector('input[type="file"]').click();
    }
    
    async function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.name.endsWith('.csv')) {
            alert('请选择 CSV 文件');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                currentData = result;
                showDataPreview(result.preview);
                initColumnSelector(result.columns, result.numeric_columns);
                showFilterSection();
            } else {
                alert('上传失败: ' + result.error);
            }
        } catch (error) {
            alert('上传错误: ' + error.message);
        }
    }
    
    function showDataPreview(previewData) {
        const previewSection = document.getElementById('preview-section');
        const previewTable = document.getElementById('preview-table');
        
        // 创建表格
        let tableHtml = '<table class="ant-table" style="width:100%;border-collapse:collapse;">';
        
        // 表头
        if (previewData.length > 0) {
            tableHtml += '<thead><tr>';
            Object.keys(previewData[0]).forEach(key => {
                tableHtml += `<th style="border:1px solid #ddd;padding:8px;background:#fafafa;">${key}</th>`;
            });
            tableHtml += '</tr></thead>';
            
            // 表格内容
            tableHtml += '<tbody>';
            previewData.forEach(row => {
                tableHtml += '<tr>';
                Object.values(row).forEach(value => {
                    tableHtml += `<td style="border:1px solid #ddd;padding:8px;">${value}</td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody>';
        }
        
        tableHtml += '</table>';
        previewTable.innerHTML = tableHtml;
        previewSection.style.display = 'block';
    }
    
    function initColumnSelector(allColumns, numericColumns) {
        const columnSelector = document.getElementById('column-selector');
        columnSelector.innerHTML = '';
        
        // 创建多选下拉框
        const select = document.createElement('select');
        select.multiple = true;
        select.style.width = '100%';
        select.style.height = '120px';
        select.style.padding = '8px';
        select.style.border = '1px solid #d9d9d9';
        select.style.borderRadius = '6px';
        
        // 添加选项
        numericColumns.forEach(column => {
            const option = document.createElement('option');
            option.value = column;
            option.textContent = column;
            select.appendChild(option);
        });
        
        columnSelector.appendChild(select);
        
        // 添加选择说明
        const helpText = document.createElement('div');
        helpText.style.marginTop = '8px';
        helpText.style.fontSize = '12px';
        helpText.style.color = '#666';
        helpText.textContent = '按住 Ctrl 键可多选数值列';
        columnSelector.appendChild(helpText);
    }
    
    function showFilterSection() {
        document.getElementById('filter-section').style.display = 'block';
        
        // 绑定生成图表按钮事件
        document.getElementById('generate-chart').onclick = generateChart;
    }
    
    async function generateChart() {
        const selectedOptions = document.querySelector('#column-selector select').selectedOptions;
        const selectedColumns = Array.from(selectedOptions).map(opt => opt.value);
        
        if (selectedColumns.length === 0) {
            alert('请至少选择一个数值列');
            return;
        }
        
        try {
            const response = await fetch('/chart-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: currentData.filename,
                    columns: selectedColumns
                })
            });
            
            const chartData = await response.json();
            
            if (response.ok) {
                renderChart(chartData, selectedColumns);
                document.getElementById('chart-section').style.display = 'block';
            } else {
                alert('生成图表失败: ' + chartData.error);
            }
        } catch (error) {
            alert('生成图表错误: ' + error.message);
        }
    }
    
    function renderChart(chartData, selectedColumns) {
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: selectedColumns
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: chartData.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: chartData.series.map(series => ({
                name: series.name,
                type: 'line',
                data: series.data,
                smooth: true,
                lineStyle: {
                    width: 2
                },
                symbolSize: 6
            }))
        };
        
        chartInstance.setOption(option);
        
        // 响应窗口大小变化
        window.addEventListener('resize', function() {
            chartInstance.resize();
        });
    }
});