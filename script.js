$(document).ready(function() {
    // 图表描述信息
    const chartDescriptions = {
        'line': {
            title: '折线图 - 未来15天最高气温和最低气温',
            description: '展示未来15天最高气温和最低气温的变化趋势。'
        },
        'bar': {
            title: '柱形图 - 2013—2019财年阿里巴巴淘宝和天猫平台的GMV',
            description: '展示2013年至2019年阿里巴巴淘宝和天猫平台的GMV（商品交易总额）变化。'
        },
        'barh': {
            title: '条形图 - 各商品种类的网购替代率',
            description: '展示不同商品种类的网购替代率，横向条形图适合展示较长的类别名称。'
        },
        'area': {
            title: '堆积面积图 - 物流公司物流费用统计',
            description: '展示三家物流公司在一年中各月份的物流费用统计。'
        },
        'histogram': {
            title: '直方图 - 人脸识别的灰度直方图',
            description: '展示人脸识别中灰度值的分布情况，用于分析图像特征。'
        },
        'pie': {
            title: '饼图 - 支付宝月账单报告',
            description: '展示支付宝月账单中各类消费的占比情况。'
        },
        'scatter': {
            title: '散点图 - 汽车速度与制动距离的关系',
            description: '展示汽车速度与制动距离之间的关系，可以观察到速度增加时制动距离的变化趋势。'
        },
        'box': {
            title: '箱形图 - 2017年和2018年全国发电量统计',
            description: '比较2017年和2018年全国发电量的分布情况，包括中位数、四分位数等统计信息。'
        },
        'radar': {
            title: '雷达图 - 霍兰德职业兴趣测试',
            description: '展示霍兰德职业兴趣测试中不同人员在六个维度上的得分情况。'
        },
        'errorbar': {
            title: '误差棒图 - 4个树种不同季节的细根生物量',
            description: '展示4个不同树种在春季、夏季和秋季的细根生物量及其误差范围。'
        }
    };

    // 初始加载折线图
    loadChart('line');

    // 图表类型切换
    $('.list-group-item').click(function() {
        $('.list-group-item').removeClass('active');
        $(this).addClass('active');
        
        const chartType = $(this).data('chart-type');
        loadChart(chartType);
    });

    // 生成图表按钮点击事件
    $('#generate-btn').click(function() {
        const chartType = $('.list-group-item.active').data('chart-type');
        loadChart(chartType);
    });

    // 加载图表函数
    function loadChart(chartType) {
        // 获取自定义参数
        const dataRange = parseInt($('#data-range').val());
        const dataScale = parseFloat($('#data-scale').val());
        
        // 更新图表标题和描述
        $('#chart-title').text(chartDescriptions[chartType].title);
        $('#chart-description').html(`<h5>${chartType === 'barh' ? '条形图' : 
                                   chartType === 'area' ? '堆积面积图' : 
                                   chartType === 'errorbar' ? '误差棒图' : 
                                   chartDescriptions[chartType].title.split(' - ')[0]}</h5>
                                   <p>${chartDescriptions[chartType].description}</p>`);
        
        // 根据图表类型生成不同的图表
        switch(chartType) {
            case 'line':
                generateLineChart(dataRange, dataScale);
                break;
            case 'bar':
                generateBarChart(dataRange, dataScale);
                break;
            case 'barh':
                generateBarhChart(dataRange, dataScale);
                break;
            case 'area':
                generateAreaChart(dataRange, dataScale);
                break;
            case 'histogram':
                generateHistogramChart(dataRange, dataScale);
                break;
            case 'pie':
                generatePieChart();
                break;
            case 'scatter':
                generateScatterChart(dataRange, dataScale);
                break;
            case 'box':
                generateBoxChart();
                break;
            case 'radar':
                generateRadarChart();
                break;
            case 'errorbar':
                generateErrorbarChart();
                break;
            default:
                generateLineChart(dataRange, dataScale);
        }
    }

    // 折线图生成函数
    function generateLineChart(dataRange, dataScale) {
        const x = Array.from({length: dataRange}, (_, i) => i + 4);
        const yMax = Array.from({length: dataRange}, () => Math.floor(25 + Math.random() * 10 * dataScale));
        const yMin = Array.from({length: dataRange}, () => Math.floor(15 + Math.random() * 8 * dataScale));
        
        const trace1 = {
            x: x,
            y: yMax,
            type: 'scatter',
            mode: 'lines+markers',
            name: '最高温度',
            line: {
                color: 'rgb(219, 64, 82)',
                width: 2
            }
        };
        
        const trace2 = {
            x: x,
            y: yMin,
            type: 'scatter',
            mode: 'lines+markers',
            name: '最低温度',
            line: {
                color: 'rgb(55, 128, 191)',
                width: 2
            }
        };
        
        const layout = {
            title: '未来' + dataRange + '天最高气温和最低气温',
            xaxis: {
                title: '日期'
            },
            yaxis: {
                title: '温度(°C)'
            }
        };
        
        Plotly.newPlot('chart-container', [trace1, trace2], layout);
    }

    // 柱形图生成函数
    function generateBarChart(dataRange, dataScale) {
        const years = dataRange > 7 ? 
            Array.from({length: dataRange}, (_, i) => 'FY' + (2013 + i)) : 
            ["FY2013", "FY2014", "FY2015", "FY2016", "FY2017", "FY2018", "FY2019"].slice(0, dataRange);
        
        const values = Array.from({length: dataRange}, (_, i) => Math.floor(10000 + i * 5000 * dataScale + Math.random() * 2000));
        
        const trace = {
            x: years,
            y: values,
            type: 'bar',
            marker: {
                color: 'rgb(55, 83, 109)'
            }
        };
        
        const layout = {
            title: '财年阿里巴巴淘宝和天猫平台的GMV',
            xaxis: {
                title: '财年'
            },
            yaxis: {
                title: 'GMV (亿元)'
            }
        };
        
        Plotly.newPlot('chart-container', [trace], layout);
    }

    // 条形图生成函数
    function generateBarhChart(dataRange, dataScale) {
        const labels = [
            "家政、家教、保姆等生活服务", "飞机票、火车票", "家具", "手机、手机配件", 
            "计算机及其配套产品", "汽车用品", "通信充值、游戏充值", "个人护理用品", 
            "书报杂志及音像制品", "餐饮、旅游、住宿", "家用电器", 
            "食品、饮料、烟酒、保健品", "家庭日杂用品", "保险、演出票务", 
            "服装、鞋帽、家用纺织品", "数码产品", "其他商品和服务", "工艺品、收藏品"
        ].slice(0, dataRange);
        
        const values = Array.from({length: dataRange}, () => 0.6 + Math.random() * 0.4 * dataScale);
        
        const trace = {
            y: labels,
            x: values,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(158, 202, 225)'
            }
        };
        
        const layout = {
            title: '各商品种类的网购替代率',
            xaxis: {
                title: '替代率'
            },
            yaxis: {
                automargin: true
            },
            margin: {
                l: 250
            }
        };
        
        Plotly.newPlot('chart-container', [trace], layout);
    }

    // 堆积面积图生成函数
    function generateAreaChart(dataRange, dataScale) {
        const x = Array.from({length: 12}, (_, i) => i + 1);
        const y1 = Array.from({length: 12}, () => Math.floor(180 + Math.random() * 100 * dataScale));
        const y2 = Array.from({length: 12}, () => Math.floor(200 + Math.random() * 150 * dataScale));
        const y3 = Array.from({length: 12}, () => Math.floor(180 + Math.random() * 120 * dataScale));
        
        const trace1 = {
            x: x,
            y: y1,
            name: 'A公司',
            stackgroup: 'one',
            fillcolor: 'rgba(255, 99, 132, 0.5)'
        };
        
        const trace2 = {
            x: x,
            y: y2,
            name: 'B公司',
            stackgroup: 'one',
            fillcolor: 'rgba(54, 162, 235, 0.5)'
        };
        
        const trace3 = {
            x: x,
            y: y3,
            name: 'C公司',
            stackgroup: 'one',
            fillcolor: 'rgba(75, 192, 192, 0.5)'
        };
        
        const layout = {
            title: '物流公司物流费用统计',
            xaxis: {
                title: '月份'
            },
            yaxis: {
                title: '费用(元)'
            }
        };
        
        Plotly.newPlot('chart-container', [trace1, trace2, trace3], layout);
    }

    // 直方图生成函数
    function generateHistogramChart(dataRange, dataScale) {
        // 生成正态分布的随机数
        const values = [];
        for (let i = 0; i < 1000; i++) {
            let u = 0, v = 0;
            while (u === 0) u = Math.random();
            while (v === 0) v = Math.random();
            let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            values.push(num * dataScale);
        }
        
        const trace = {
            x: values,
            type: 'histogram',
            nbinsx: dataRange,
            marker: {
                color: 'rgba(100, 200, 102, 0.7)',
                line: {
                    color: 'rgba(100, 200, 102, 1)',
                    width: 1
                }
            }
        };
        
        const layout = {
            title: '人脸识别的灰度直方图',
            xaxis: {
                title: '灰度值'
            },
            yaxis: {
                title: '频率'
            }
        };
        
        Plotly.newPlot('chart-container', [trace], layout);
    }

    // 饼图生成函数
    function generatePieChart() {
        const labels = ['购物', '人情往来', '餐饮美食', '通信物流', '生活日用', '交通出行', '休闲娱乐', '其他'];
        const values = [800, 100, 1000, 200, 300, 200, 200, 200];
        
        const trace = {
            labels: labels,
            values: values,
            type: 'pie',
            textinfo: 'label+percent',
            insidetextorientation: 'radial',
            marker: {
                colors: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                    '#9966FF', '#FF9F40', '#8AC249', '#EA526F'
                ]
            }
        };
        
        const layout = {
            title: '支付宝月账单报告'
        };
        
        Plotly.newPlot('chart-container', [trace], layout);
    }

    // 散点图生成函数
    function generateScatterChart(dataRange, dataScale) {
        const x = Array.from({length: 20}, (_, i) => (i + 1) * 10);
        const y = x.map(val => val * val * 0.005 * dataScale);
        
        const trace = {
            x: x,
            y: y,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 10,
                color: 'rgba(255, 65, 54, 0.7)',
                line: {
                    color: 'rgba(255, 65, 54, 1)',
                    width: 1
                }
            }
        };
        
        const layout = {
            title: '汽车速度与制动距离的关系',
            xaxis: {
                title: '速度(km/h)'
            },
            yaxis: {
                title: '制动距离(m)'
            }
        };
        
        Plotly.newPlot('chart-container', [trace], layout);
    }

    // 箱形图生成函数
    function generateBoxChart() {
        const y1 = [5200, 5254.5, 5283.4, 5107.8, 5443.3, 5550.6, 6400.2, 6404.9, 5483.1, 5330.2, 5543, 6199.9];
        const y2 = [4605.2, 4710.3, 5168.9, 4767.2, 4947, 5203, 6047.4, 5945.5, 5219.6, 5038.1, 5196.3, 5698.6];
        
        const trace1 = {
            y: y1,
            type: 'box',
            name: '2018年',
            boxmean: true,
            marker: {
                color: 'rgba(255, 144, 14, 0.7)'
            }
        };
        
        const trace2 = {
            y: y2,
            type: 'box',
            name: '2017年',
            boxmean: true,
            marker: {
                color: 'rgba(44, 160, 44, 0.7)'
            }
        };
        
        const layout = {
            title: '2017年和2018年全国发电量统计',
            yaxis: {
                title: '发电量(亿千瓦时)'
            }
        };
        
        Plotly.newPlot('chart-container', [trace1, trace2], layout);
    }

    // 雷达图生成函数
    function generateRadarChart() {
        const data = [
            [0.40, 0.32, 0.35, 0.30, 0.30, 0.88],
            [0.85, 0.35, 0.30, 0.40, 0.40, 0.30],
            [0.43, 0.89, 0.30, 0.28, 0.22, 0.30]
        ];
        
        const labels = ['研究型(I)', '艺术型(A)', '社会型(S)', '企业型(E)', '传统型(C)', '现实型(R)'];
        
        const traces = data.map((values, i) => {
            return {
                type: 'scatterpolar',
                r: [...values, values[0]],
                theta: [...labels, labels[0]],
                fill: 'toself',
                name: `人员${i+1}`
            };
        });
        
        const layout = {
            polar: {
                radialaxis: {
                    visible: true,
                    range: [0, 1]
                }
            },
            title: '霍兰德职业兴趣测试'
        };
        
        Plotly.newPlot('chart-container', traces, layout);
    }

    // 误差棒图生成函数
    function generateErrorbarChart() {
        const x = ['春季', '夏季', '秋季'];
        const y1 = [2.04, 1.57, 1.63];
        const y2 = [1.69, 1.61, 1.64];
        const y3 = [4.65, 4.99, 4.94];
        const y4 = [3.39, 2.33, 4.10];
        
        const error1 = [0.16, 0.08, 0.10];
        const error2 = [0.27, 0.14, 0.14];
        const error3 = [0.34, 0.32, 0.29];
        const error4 = [0.23, 0.23, 0.39];
        
        const trace1 = {
            x: x,
            y: y1,
            type: 'bar',
            name: '树种1',
            error_y: {
                type: 'data',
                array: error1,
                visible: true
            }
        };
        
        const trace2 = {
            x: x,
            y: y2,
            type: 'bar',
            name: '树种2',
            error_y: {
                type: 'data',
                array: error2,
                visible: true
            }
        };
        
        const trace3 = {
            x: x,
            y: y3,
            type: 'bar',
            name: '树种3',
            error_y: {
                type: 'data',
                array: error3,
                visible: true
            }
        };
        
        const trace4 = {
            x: x,
            y: y4,
            type: 'bar',
            name: '树种4',
            error_y: {
                type: 'data',
                array: error4,
                visible: true
            }
        };
        
        const layout = {
            title: '4个树种不同季节的细根生物量',
            xaxis: {
                title: '季节'
            },
            yaxis: {
                title: '细根生物量(t/hm²)'
            },
            barmode: 'group'
        };
        
        Plotly.newPlot('chart-container', [trace1, trace2, trace3, trace4], layout);
    }
});