import json
import base64
import io
import matplotlib.pyplot as plt
import numpy as np

# 输入和输出文件路径
INPUT_FILE = 'raw_questions.json'
OUTPUT_FILE = 'processed_questions.json'

def code_to_base64(code_str):
    """执行绘图代码并返回 Base64 字符串"""
    if not code_str: return None
    try:
        plt.clf() # 清除画布
        # 创建独立的命名空间，防止变量污染，但允许访问 numpy 和 plt
        exec_globals = {'plt': plt, 'np': np}
        exec(code_str, exec_globals)

        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', transparent=False)
        buf.seek(0)
        img_b64 = base64.b64encode(buf.read()).decode('utf-8')
        buf.close()
        return f"data:image/png;base64,{img_b64}"
    except Exception as e:
        print(f"❌ 代码执行出错: {e}")
        return None

def main():
    print(f"📂 正在读取 {INPUT_FILE} ...")
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ 未找到原始数据文件，请先创建 raw_questions.json")
        return

    print("⚙️ 开始处理数据...")

    for idx, item in enumerate(data):
        print(f"   正在处理第 {idx + 1} 题 (ID: {item.get('id')})...")

        # 1. 处理题干图片
        if 'content_plot_code' in item:
            img = code_to_base64(item['content_plot_code'])
            if img:
                item['content_image'] = img
                print("     ✅ 题干图片生成成功")
            # 这里的策略是保留源代码字段，以便后续修改调试
            # 如果不想保留，可以 del item['content_plot_code']

        # 2. 处理选项图片
        if 'options' in item:
            for opt in item['options']:
                if 'option_plot_code' in opt:
                    img = code_to_base64(opt['option_plot_code'])
                    if img:
                        opt['option_image'] = img
                        print(f"     ✅ 选项 {opt['label']} 图片生成成功")

    print(f">>> 正在写入 {OUTPUT_FILE} ...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("✨ 全部完成！现在可以打开 view.html 查看结果了。")

if __name__ == '__main__':
    main()