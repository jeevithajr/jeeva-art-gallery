import {notFound} from "next/navigation";
import {db,photo,type Product} from "@/lib/db";
import WhatsAppOrder from "@/components/WhatsAppOrder";
export const dynamic="force-dynamic";
export default async function Detail({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const {data,error}=await db().from("products").select("*").eq("slug",slug).eq("is_published",true).maybeSingle();
 if(error){console.error("Product lookup failed",error.message);throw new Error("Unable to load artwork");}
 if(!data)notFound();
 const p=data as Product;
 const site=(process.env.NEXT_PUBLIC_SITE_URL||"https://jeeva-art-gallery.vercel.app").replace(/\/$/,"");
 const productUrl=site+"/products/"+encodeURIComponent(p.slug);
 return <main className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
  <div className="grid gap-4">{p.images?.length?p.images.map((im,i)=><img key={im} src={photo(im)} alt={p.name+" image "+(i+1)} className="w-full rounded-xl bg-stone-100"/>):<div className="flex aspect-square items-center justify-center rounded-xl bg-stone-200 text-stone-500">Artwork image coming soon</div>}</div>
  <div><p className="text-xs uppercase tracking-widest text-stone-500">{p.category||"Original artwork"}</p><h1 className="mt-4 text-5xl font-light">{p.name}</h1><p className="mt-6 text-2xl">₹{Number(p.price).toLocaleString("en-IN")}</p><p className="mt-8 whitespace-pre-wrap leading-8 text-stone-700">{p.description}</p><p className="mt-5 text-sm">{p.is_available?"Available":"Sold out"}</p>
   <WhatsAppOrder productName={p.name} price={p.price} productUrl={productUrl} available={p.is_available} phone={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||""}/>
  </div>
 </main>;
}
