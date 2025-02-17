'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, Download, LoaderCircle } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const { prompts, loading, error, fetchPrompts } = useStore();
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    image: '',
    prompt: '',
    title: ''
  })
  const [generateL, setGenerateL] = useState(false)
  const [logoS, setLogoS] = useState(false)

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  useEffect(() => {
    if (logoS === true) {
      const timer = setTimeout(() => {
        setLogoS(false)
        clearTimeout(timer)
      }, 1000)
    }
  }, [logoS])

  const generateLogo = async () => {
    setGenerateL(true)
    const res = await axios.post('/api/logo', {
      ...form
    })

    const url = JSON.parse(res.data.data.data).output


    setGenerateL(false)
    setLogoS(true)
    setForm((e) => {
      return {
        ...e,
        image: url
      }
    })
  }

  if (loading) return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>加载中...</div>
    </main>
  );

  if (error) return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-red-500">{error}</div>
    </main>
  );

  return (
    <main className="min-h-screen p-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {prompts.map((prompt, index) => (
          <div
            onClick={() => {
              setOpen(true)
              setForm(() => {
                return {
                  title: prompt.title,
                  prompt: prompt.prompt,
                  image: prompt.image
                }
              })
            }}
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
            {prompt.image && (
              <div className="aspect-square">
                <Image
                  width={100}
                  height={100}
                  src={prompt.image}
                  alt={prompt.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{prompt.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{prompt.prompt}</p>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={(e) => {
        setOpen(e)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>生成表情包</DialogTitle>
            <DialogDescription>
              完成表单填写，快速生成表情包
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 items-center">
            
            <div className='border-2 p-5 rounded-lg relative overflow-hidden cursor-pointer group'>
              <Image width={100} height={100} src={form.image} className={'h-[200px] w-[200px] rounded-md '} alt={form.title} />
              {
                generateL && <div className="absolute h-full w-full top-0 left-0 bg-black/50 flex justify-center items-center">
                  <LoaderCircle className="animate-spin" color="#fff" size={32} />
                </div>
              }
              {
                logoS && <div className="absolute h-full w-full top-0 left-0 bg-black/50 flex justify-center items-center">
                  <Check color="#fff" size={32} />
                </div>
              }
              <div 
              onClick={async ()=>{
                try {
                  const response = await fetch(form.image);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = form.title || 'meme.png';
                  link.click();
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('下载失败:', error);
                }
              }}
              className="absolute h-full w-full top-0 left-0 bg-black/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Download color='#fff' size={32} />
              </div>
            </div>
            <Textarea defaultValue={form.prompt
            } placeholder='请输入提示词' className='h-[100px]' />
            <Input defaultValue={form.title} placeholder='请输入配文' />
            <Button
              onClick={() => {
                generateLogo()
              }} disabled={generateL} className='w-full' size={'lg'}>
              {
                generateL ? (
                  <>
                    <LoaderCircle className="animate-spin" color="#fff" size={32} />
                    正在生成中...
                  </>
                ) : <>立即生成</>
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </main>
  );
}