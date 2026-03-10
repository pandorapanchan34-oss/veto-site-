export default async function handler(req,res){

if(req.method !== "POST"){
return res.status(405).json({error:"Method not allowed"});
}

const {message} = req.body;

const SYSTEM_PROMPT = `
あなたはVETO AIというAI導入コンサルです。

ルール
・短く答える
・3〜5行
・質問を返す
・業務効率化の視点でアドバイス
`;

try{

const response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+process.env.GOOGLE_GENERATIVE_AI_API_KEY,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[
{
role:"user",
parts:[
{text:SYSTEM_PROMPT + "\n\n相談:" + message}
]
}
]
})
}
);

const data = await response.json();

console.log("Gemini raw:",JSON.stringify(data));

const reply =
data?.candidates?.[0]?.content?.parts?.[0]?.text
|| "AI応答を取得できませんでした";

res.status(200).json({reply});

}catch(error){

console.error(error);

res.status(500).json({
reply:"AIエラー"
});

}

}
