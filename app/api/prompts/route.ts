import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 获取list.json文件的路径
const dataFilePath = path.join(process.cwd(), 'public/data/list.json');

// GET方法：获取提示词列表
export async function GET() {
  try {
    // 读取文件内容
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('读取文件失败:', error);
    return NextResponse.json(
      { error: '获取数据失败' },
      { status: 500 }
    );
  }
}

// POST方法：更新提示词列表
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 验证请求数据
    if (!body.data || !Array.isArray(body.data)) {
      return NextResponse.json(
        { error: '无效的数据格式' },
        { status: 400 }
      );
    }

    // 将数据写入文件
    await fs.writeFile(
      dataFilePath,
      JSON.stringify({ data: body.data }, null, 2),
      'utf8'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('保存文件失败:', error);
    return NextResponse.json(
      { error: '保存数据失败' },
      { status: 500 }
    );
  }
}