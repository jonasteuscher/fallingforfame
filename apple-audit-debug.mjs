import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
await page.addInitScript(()=>{localStorage.setItem('falling-for-fame-mobile-notice-dismissed','true');sessionStorage.setItem('sport-safety-warning-accepted','true');});
await page.goto('http://localhost:3000/de/findings');await page.waitForTimeout(700);
console.log(await page.evaluate(()=>({mq:matchMedia('(max-width:767px)').matches,lang:document.documentElement.lang,headings:[...document.querySelectorAll('h2')].slice(0,5).map(e=>({text:e.textContent,wrap:getComputedStyle(e).overflowWrap,hyphens:getComputedStyle(e).hyphens})),styles:[...document.styleSheets].map(s=>{try{return [...s.cssRules].map(r=>r.cssText).filter(t=>t.includes('Long German')||t.includes('overflow-wrap: anywhere')&&t.includes('findings-page'))}catch{return []}})})));
console.log(JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.clientWidth>0&&e.scrollWidth>e.clientWidth+3).map(e=>({tag:e.tagName,cls:e.className,client:e.clientWidth,scroll:e.scrollWidth,overflow:getComputedStyle(e).overflowX,text:e.textContent?.slice(0,130)})).slice(-30)),null,2));await browser.close();
