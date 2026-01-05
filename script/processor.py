import json
import base64
import io
import matplotlib.pyplot as plt
import numpy as np
import traceback

# ================= 配置区域 =================
INPUT_FILE = 'raw_questions.json'
OUTPUT_FILE = 'questions.json'

# 是否在成功生成图片后清空代码字段
CLEAR_CODE_ON_SUCCESS = True

# ================= 核心工具：绘图与节点处理 =================

def execute_code_to_image(code_str):
    """
    执行绘图代码，返回 (Base64字符串, 是否出错, 错误信息)
    """
    if not code_str or not isinstance(code_str, str) or 'plt.' not in code_str:
        return None, False, "No plotting code provided"

    try:
        plt.clf()
        plt.close('all')
        # 设置支持 LaTeX 渲染的默认配置（可选）
        plt.rcParams.update({'text.usetex': False})

        exec_globals = {'plt': plt, 'np': np}
        exec(code_str, exec_globals)

        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', dpi=100)
        buf.seek(0)

        img_b64 = "data:image/png;base64," + base64.b64encode(buf.read()).decode('utf-8')
        buf.close()

        return img_b64, False, None

    except Exception:
        error_msg = traceback.format_exc()
        return None, True, error_msg

def process_rich_node(node, context_info=""):
    """
    [原子操作] 处理单个 RichContent 节点
    """
    if not isinstance(node, dict):
        return

    # 逻辑判断：只有当标识为需要图片 (has_image) 且 目前没有图片数据 (image 为 null) 时才执行
    if node.get('has_image') is True and not node.get('image'):
        # 只有存在 code 时才尝试生成
        if node.get('code'):
            print(f"    🎨 [绘图] {context_info} ...")
            image_data, is_error, err_msg = execute_code_to_image(node.get('code'))

            if is_error:
                node['code_error'] = True
                node['debug_msg'] = err_msg
                print(f"    ❌ {context_info} 绘图失败")
            else:
                node['image'] = image_data
                node['code_error'] = False
                node['debug_msg'] = None
                if CLEAR_CODE_ON_SUCCESS:
                    node['code'] = None
                print(f"    ✅ {context_info} 生成成功")
        else:
            # 有意图但无代码的情况标记为错误
            node['code_error'] = True
            node['debug_msg'] = "has_image is true but code is missing."
    else:
        # 确保基础字段存在
        if 'code_error' not in node:
            node['code_error'] = False

# ================= 题型特定策略 (Handlers) =================

def process_common_parts(question):
    """处理题干和解析"""
    q_id = question.get('id', 'Unknown')
    if 'content' in question:
        process_rich_node(question['content'], f"题目[{q_id}]-题干")
    if 'validation' in question and 'explanation' in question['validation']:
        process_rich_node(question['validation']['explanation'], f"题目[{q_id}]-解析")

def handle_choice_question(question):
    """处理选择题 (单选/多选)"""
    process_common_parts(question)
    options = question.get('structure', {}).get('options', [])
    q_id = question.get('id')
    for opt in options:
        process_rich_node(opt, f"题目[{q_id}]-选项[{opt.get('id')}]")

def handle_cloze_question(question):
    """
    [新加] 处理完形填空 (Cloze)
    完形填空的 structure 包含 blanks 数组，每个 blank 里有 options
    """
    process_common_parts(question)
    blanks = question.get('structure', {}).get('blanks', [])
    q_id = question.get('id')

    for blank in blanks:
        blank_id = blank.get('id')
        options = blank.get('options', [])
        for opt in options:
            process_rich_node(opt, f"题目[{q_id}]-空({blank_id})-选项[{opt.get('id')}]")

def handle_basic_question(question):
    """处理简答、普通填空"""
    process_common_parts(question)

# ================= 路由分发 (Router) =================

PROCESSOR_MAP = {
    'single_choice': handle_choice_question,
    'multiple_choice': handle_choice_question,
    'short_answer': handle_basic_question,
    'fill_blank': handle_basic_question,
    'cloze': handle_cloze_question  # 注册完形填空处理器
}

def dispatch_processor(question):
    q_type = question.get('type')
    handler = PROCESSOR_MAP.get(q_type)
    if handler:
        handler(question)
    else:
        print(f"⚠️ 未知的题目类型: {q_type}, 仅处理通用部分")
        process_common_parts(question)

# ================= 主程序 =================

def main():
    print(f"📂 正在读取数据源: {INPUT_FILE} ...")
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            questions = json.load(f)
    except Exception as e:
        print(f"❌ 读取文件失败: {e}")
        return

    total = len(questions)
    print(f"⚙️ 开始处理 {total} 道题目...")

    for i, q in enumerate(questions):
        print(f"[{i+1}/{total}] 正在处理: ID {q.get('id')} 类型 {q.get('type')}")
        dispatch_processor(q)

    print(f"💾 正在保存结果到: {OUTPUT_FILE} ...")
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)
        print("✨ 处理程序运行结束！")
    except Exception as e:
        print(f"❌ 保存文件失败: {e}")

if __name__ == '__main__':
    main()