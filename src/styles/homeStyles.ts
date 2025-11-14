/**
 * Estilos CSS para la página Home y sus componentes
 * Estos estilos se inyectan como string en el componente Home
 */
export const homeStyles = `
  .rv{opacity:0;transform:translateY(16px);transition:opacity .5s,transform .5s;}
  .rv-show{opacity:1;transform:none;}
  @media (prefers-reduced-motion:reduce){.rv{transition:none;transform:none;opacity:1}}

  .container{width:100%;max-width:1160px;margin:0 auto;padding:0 20px;}

  .hero{position:relative;background:linear-gradient(180deg,var(--bg-soft) 0%,var(--bg) 100%);overflow:clip;}
  .hero__imgw{position:absolute;inset:0;pointer-events:none;}
  .hero__img{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(1.05);
    min-width:110%;min-height:110%;object-fit:cover;opacity:.25;transition:transform .2s linear;filter:saturate(115%);}
  .hero__content{position:relative;z-index:1;text-align:center;padding:96px 20px 64px;}
  .hero__title{margin:0;font-size:clamp(32px,6vw,56px);line-height:1.1;letter-spacing:-.5px;color:var(--text);}
  .hero__sub{margin:16px auto 0;font-size:18px;color:var(--muted);max-width:780px;}
  .ctas{margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
  .btn{text-decoration:none;display:inline-block;padding:12px 18px;border-radius:999px;font-weight:600;letter-spacing:.3px;}
  .btn--primary{color:var(--primary-contrast);background:var(--primary);}
  .btn--ghost{color:var(--text);border:1px solid var(--text);}

  .controls{display:grid;gap:12px;grid-template-columns:1fr;padding:16px 0 0;}
  .controls__bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:space-between;margin-top:8px;}
  .search input{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:var(--card);color:var(--text);}
  .select{border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:var(--card);color:var(--text);}
  .chips{display:flex;gap:8px;flex-wrap:wrap;}
  .chip{border:1px solid var(--border);padding:7px 12px;border-radius:999px;font-size:13px;color:var(--text);background:transparent;cursor:pointer;transition:transform .12s,background .2s;}
  .chip:hover{transform:translateY(-2px);background:var(--chip-bg);} .chip--on{background:var(--primary);color:var(--primary-contrast);border-color:var(--primary);}

  .create{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;box-shadow:var(--shadow);margin-top:10px;}
  .create h3{margin:0 0 8px;color:var(--text);}
  .row{display:grid;gap:10px;grid-template-columns:1fr 1fr;}
  .row-1{display:grid;gap:10px;grid-template-columns:1fr;}
  .field{display:flex;flex-direction:column;gap:6px;}
  .field label{font-size:13px;color:var(--muted-2);}
  .field input,.field textarea{padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);}
  .check{display:flex;align-items:center;gap:8px;color:var(--muted);}
  .count{font-size:12px;color:var(--muted-2);}
  .actions{display:flex;gap:10px;justify-content:flex-end;margin-top:10px;}
  .error{color:#b91c1c;font-size:13px;margin-top:6px;}
  .dz{border:1px dashed var(--border);border-radius:12px;padding:10px;text-align:center;color:var(--muted);font-size:13px;}
  .dz--on{background:var(--bg-soft);}

  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:22px 0 6px;text-align:center;}
  .stat{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;box-shadow:var(--shadow);}
  .stat__num{font-size:28px;font-weight:800;color:var(--text);} .stat__sub{color:var(--muted);}
  @media (max-width:900px){ .stats{grid-template-columns:1fr;} }

  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;}
  .user-toolbar{display:flex;gap:10px;margin-top:8px;justify-content:flex-end;}
  .link-reset{background:transparent;border:0;text-decoration:underline;color:var(--text);cursor:pointer;}
  .metaBar{display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between;align-items:center;color:var(--muted);font-size:14px;margin:8px 0 18px;}
`;

