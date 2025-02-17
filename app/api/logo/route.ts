import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest){
    const data = await request.json()
    const res = await axios.post(process.env.NEXT_PUBLIC_COZE_BASE_URL || "", {
        workflow_id: '7470848116120879119',
        parameters: {
            input: data.prompt + "配文：" + data.title
        }
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.NEXT_PUBLIC_COZE_API_KEY
        },
        responseType: 'json'
    })
    console.log(res.data);
    
    return NextResponse.json({
        data: res.data
    })
}