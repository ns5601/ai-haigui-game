#!/usr/bin/env python3
"""
简单的Markdown转HTML转换器，用于打印为PDF
"""

import sys
import os
import markdown
from datetime import datetime

def convert_markdown_to_html(md_text, title="文档"):
    """转换Markdown为打印友好的HTML"""

    # 使用基本扩展
    extensions = ['extra', 'tables', 'fenced_code', 'toc']

    # 转换Markdown
    html_body = markdown.markdown(md_text, extensions=extensions)

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        /* 打印样式 */
        @media print {{
            @page {{
                size: A4;
                margin: 2cm;
            }}

            body {{
                font-family: "SimSun", "Microsoft YaHei", serif;
                font-size: 11pt;
                line-height: 1.6;
                color: #000;
            }}

            h1 {{
                font-size: 24pt;
                text-align: center;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
            }}

            h2 {{
                font-size: 18pt;
                border-bottom: 1px solid #ccc;
                padding-bottom: 5px;
                margin-top: 25px;
            }}

            h3 {{ font-size: 14pt; }}
            h4 {{ font-size: 12pt; }}

            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
            }}

            th, td {{
                border: 1px solid #ddd;
                padding: 8px;
            }}

            th {{
                background-color: #f5f5f5;
            }}

            pre, code {{
                font-family: "Consolas", monospace;
            }}

            pre {{
                background-color: #f5f5f5;
                padding: 10px;
                border-radius: 3px;
                overflow-x: auto;
            }}

            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}

            .footer {{
                text-align: center;
                margin-top: 50px;
                font-size: 9pt;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 10px;
            }}

            .print-button {{
                display: none;
            }}
        }}

        /* 屏幕样式 */
        @media screen {{
            body {{
                font-family: Arial, sans-serif;
                max-width: 1000px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
            }}

            .print-button {{
                display: block;
                background-color: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                margin: 20px auto;
                border-radius: 5px;
            }}

            .print-button:hover {{
                background-color: #0056b3;
            }}

            .instructions {{
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 5px;
            }}
        }}
    </style>
</head>
<body>
    <div class="instructions">
        <h3>打印说明</h3>
        <p>要生成PDF文件：</p>
        <ol>
            <li>点击下面的"打印为PDF"按钮</li>
            <li>或按 Ctrl+P (Windows) / Cmd+P (Mac)</li>
            <li>选择"另存为PDF"</li>
            <li>纸张大小选择 A4</li>
        </ol>
        <button class="print-button" onclick="window.print()">打印为PDF</button>
    </div>

    <div class="header">
        <h1>{title}</h1>
        <p><strong>版本:</strong> 1.0 | <strong>生成时间:</strong> {current_time}</p>
    </div>

    {html_body}

    <div class="footer">
        <p>--- 文档结束 ---</p>
        <p>生成于: {current_time}</p>
    </div>

    <script>
        // 打印快捷键
        document.addEventListener('keydown', function(e) {{
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {{
                e.preventDefault();
                window.print();
            }}
        }});
    </script>
</body>
</html>'''

    return html

def main():
    # 默认文件路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(script_dir, "PRD.md")
    output_file = os.path.join(script_dir, "PRD_print.html")

    # 如果提供了命令行参数
    if len(sys.argv) >= 2:
        input_file = sys.argv[1]
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]

    if not os.path.exists(input_file):
        print(f"错误: 文件不存在: {input_file}")
        return False

    try:
        print(f"正在转换: {input_file}")

        # 读取Markdown文件
        with open(input_file, 'r', encoding='utf-8') as f:
            md_content = f.read()

        # 提取标题
        title = "AI海龟汤游戏 - 产品需求文档(PRD)"
        lines = md_content.split('\n')
        for line in lines:
            if line.startswith('# '):
                title = line[2:].strip()
                break

        # 转换为HTML
        html_content = convert_markdown_to_html(md_content, title)

        # 保存HTML文件
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"HTML文件已生成: {output_file}")
        print("\n使用说明:")
        print("1. 用浏览器打开上面的HTML文件")
        print("2. 点击页面中的'打印为PDF'按钮")
        print("3. 或按 Ctrl+P (Windows) / Cmd+P (Mac)")
        print("4. 选择'另存为PDF'，纸张大小选A4")
        print("5. 保存PDF文件")

        return True

    except Exception as e:
        print(f"转换失败: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)