'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface PromptItem {
  image: string;
  name: string;
  prompt: string;
  title: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [newPrompt, setNewPrompt] = useState<PromptItem>({
    image: '',
    name: '',
    prompt: '',
    title: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // 加载提示词列表
    fetch('/data/list.json')
      .then(res => res.json())
      .then(data => setPrompts(data.data));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPrompts = isEditing
      ? prompts.map((p, index) => (index === editingIndex ? newPrompt : p))
      : [...prompts, newPrompt];

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: updatedPrompts }),
      });

      if (response.ok) {
        setPrompts(updatedPrompts);
        setNewPrompt({
          image: '',
          name: '',
          prompt: '',
          title: ''
        });
        setIsEditing(false);
        setEditingIndex(-1);
      }
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const handleEdit = (index: number) => {
    setIsEditing(true);
    setEditingIndex(index);
    setNewPrompt(prompts[index]);
  };

  const handleDelete = async (index: number) => {
    const updatedPrompts = prompts.filter((_, i) => i !== index);
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: updatedPrompts }),
      });

      if (response.ok) {
        setPrompts(updatedPrompts);
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">AI绘画提示词管理</h1>
        <Button onClick={handleLogout} variant="outline">退出登录</Button>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? '编辑提示词' : '添加新提示词'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              value={newPrompt.title}
              onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              value={newPrompt.name}
              onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">图片URL</Label>
            <Input
              id="image"
              value={newPrompt.image}
              onChange={(e) => setNewPrompt({ ...newPrompt, image: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">提示词</Label>
            <Input
              id="prompt"
              value={newPrompt.prompt}
              onChange={(e) => setNewPrompt({ ...newPrompt, prompt: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditingIndex(-1);
                setNewPrompt({
                  image: '',
                  name: '',
                  prompt: '',
                  title: ''
                });
              }}
            >
              取消
            </Button>
          )}
          <Button type="submit">{isEditing ? '保存修改' : '添加'}</Button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">提示词列表</h2>
        <div className="grid grid-cols-2 gap-4">
          {prompts.map((prompt, index) => (
            <div key={index} className="p-4 border rounded-lg flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-semibold">{prompt.title}</h3>
                <Image width={100} height={100} className='w-[100px] h-[100px]' src={prompt.image} alt={prompt.title}/>
                <p><span className="font-medium">名称：</span>{prompt.name}</p>
                <p><span className="font-medium">提示词：</span>{prompt.prompt}</p>
                <p className="truncate"><span className="font-medium">图片URL：</span>{prompt.image}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(index)}
                >
                  编辑
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(index)}
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}