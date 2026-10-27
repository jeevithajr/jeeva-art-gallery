"use client";
import {useState} from "react";

type Props = { productName:string; price:number; productUrl:string; available:boolean; phone:string };
export default function WhatsAppOrder({productName,price,productUrl,available,phone}:Props){
 const [copied,setCopied]=useState(false);
 const normalized=phone.replace(/\D/g,"");
 const configured=/^[1-9]\d{7,14}$/.test(normalized);
 const message=[
  "Hello JEEVA Art Gallery! 👋",
  "",
  "I would like to enquire about this artwork:",
  "🎨 Artwork: "+productName,
  "💰 Listed price: ₹"+Number(price).toLocaleString("en-IN"),
  "🔗 Product: "+productUrl,
  "",
  "Could you confirm availability, shipping charges and delivery time? Thank you!"
 ].join("\n");
 const url="https://wa.me/"+normalized+"?text="+encodeURIComponent(message);
 async function copy(){try{await navigator.clipboard.writeText(message);setCopied(true)}catch{setCopied(false)}}
 if(!available)return <p className="mt-8 rounded-lg bg-stone-100 p-4 text-stone-600">This artwork is currently sold out. Please explore our other creations.</p>;
 return <section className="mt-9 space-y-3" aria-label="Order enquiry">
 {configured?<a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#176b45] px-6 py-4 text-center font-semibold text-white hover:bg-[#115536]">Enquire on WhatsApp ↗</a>:<p role="status" className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">WhatsApp enquiries are temporarily unavailable. Please try again later.</p>}
 <button type="button" onClick={copy} className="w-full rounded-full border border-stone-300 px-6 py-3 text-sm hover:bg-stone-100">{copied?"Message copied!":"Copy enquiry message"}</button>
 <p className="text-xs leading-5 text-stone-500">No account required. WhatsApp opens with a pre-filled enquiry; review it and tap Send. This is not a confirmed purchase or payment.</p>
 </section>;
}
