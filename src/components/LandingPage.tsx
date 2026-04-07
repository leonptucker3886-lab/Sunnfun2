'use client';

import React, { useEffect } from 'react';

const LandingPage: React.FC = () => {
  useEffect(() => {
    // STARS
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
      for (let i = 0; i < 80; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const sz = 1 + Math.random() * 2.5;
        s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 70}%;
          width:${sz}px;height:${sz}px;
          animation-duration:${2 + Math.random() * 3}s;
          animation-delay:-${Math.random() * 4}s`;
        starsContainer.appendChild(s);
      }
    }

    // EMBERS
    const embersContainer = document.getElementById('embers');
    if (embersContainer) {
      for (let i = 0; i < 28; i++) {
        const e = document.createElement('div');
        e.className = 'ember';
        const sz = 2 + Math.random() * 5;
        const col = Math.random() < 0.7 ? 'rgba(255,130,0,.9)' : 'rgba(255,220,60,.85)';
        e.style.cssText = `
          left:${4 + Math.random() * 92}%;width:${sz}px;height:${sz}px;
          background:${col};box-shadow:0 0 ${sz * 2}px ${col};
          --dx:${(Math.random() - 0.5) * 130}px;
          animation-duration:${4 + Math.random() * 7}s;
          animation-delay:-${Math.random() * 10}s`;
        embersContainer.appendChild(e);
      }
    }

    // Keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        if (document.getElementById('p-land')?.classList.contains('active')) {
          e.preventDefault();
          enterSite();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const enterSite = () => {
    window.location.href = '/slots';
  };

  const goBack = () => {
    const pLand = document.getElementById('p-land');
    const pAbout = document.getElementById('p-about');
    if (pLand && pAbout) {
      pAbout.classList.remove('active');
      setTimeout(() => pLand.classList.add('active'), 80);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const launchGame = () => {
    window.location.href = '/slots';
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --fire:#FF3300;--orange:#FF6B1A;--sun:#FFD700;--gold:#FFA500;
  --wood-dark:#1C0F05;--wood-mid:#3A200A;--wood-light:#5C3318;
  --copper:#B87333;--copper-l:#D4894E;--cream:#FFF8DC;
  --red:#FF4444;--bg:#0c0400;
}
html,body{min-height:100%;background:var(--bg);font-family:'Oswald',sans-serif;color:var(--cream);overflow-x:hidden}

/* ── ATMOSPHERE ── */
#bg{position:fixed;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(ellipse at 10% 100%,rgba(255,60,0,.45) 0%,transparent 35%),
    radial-gradient(ellipse at 90% 100%,rgba(255,80,0,.4) 0%,transparent 35%),
    radial-gradient(ellipse at 50% 100%,rgba(200,50,0,.2) 0%,transparent 50%),
    linear-gradient(180deg,#050100 0%,#0c0400 25%,#1a0800 60%,#3a1000 100%)}
#stars{position:fixed;inset:0;pointer-events:none;z-index:0}
.star{position:absolute;border-radius:50%;background:rgba(255,240,200,.7);animation:twinkle ease-in-out infinite alternate}
@keyframes twinkle{from{opacity:.2;transform:scale(.8)}to{opacity:.9;transform:scale(1.1)}}
#embers{position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden}
.ember{position:absolute;bottom:2%;border-radius:50%;animation:ember-rise linear infinite}
@keyframes ember-rise{0%{opacity:1;transform:translateY(0) translateX(0)}70%{opacity:.5}100%{opacity:0;transform:translateY(-80vh) translateX(var(--dx))}}
.flame-L,.flame-R{position:fixed;bottom:0;pointer-events:none;z-index:2}
.flame-L{left:0;width:100px;height:180px}
.flame-R{right:0;width:100px;height:180px}
.flame-L::before,.flame-R::before{content:'';position:absolute;bottom:0;border-radius:50% 50% 30% 30%/60% 60% 40% 40%;animation:flicker ease-in-out infinite alternate}
.flame-L::before{left:15px;width:55px;height:130px;background:radial-gradient(ellipse,rgba(255,140,0,.65),rgba(255,50,0,.25));animation-duration:1.3s}
.flame-R::before{right:15px;width:55px;height:130px;background:radial-gradient(ellipse,rgba(255,140,0,.65),rgba(255,50,0,.25));animation-duration:1.1s;animation-delay:-.5s}
@keyframes flicker{from{transform:scaleX(1) scaleY(1)}to{transform:scaleX(.82) scaleY(1.12)}}
.pig-decor{position:fixed;bottom:14%;font-size:2.2rem;opacity:.18;animation:sway 6s ease-in-out infinite;z-index:2}
.pig-decor.l{left:2%}.pig-decor.r{right:2%;animation-delay:-3s}
@keyframes sway{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}

/* ── PAGES ── */
.page{position:relative;z-index:10;min-height:100vh;display:flex;flex-direction:column;
  align-items:center;justify-content:center;padding:30px 20px;gap:28px}
.page{display:none}
.page.active{display:flex}

/* ── PAGE 1: LANDING ── */
#p-land .logo-wrap{text-align:center}
.ccg-logo{position:relative;display:inline-block}
.logo-badge{width:clamp(160px,40vw,220px);height:clamp(160px,40vw,220px);
  border-radius:50%;background:radial-gradient(circle at 40% 38%,#5C3318 0%,#2d1000 55%,#0d0400 100%);
  border:5px solid var(--copper);
  box-shadow:0 0 0 3px rgba(184,115,51,.25),0 0 50px rgba(255,107,26,.3),0 0 100px rgba(255,70,0,.15),
    inset 0 2px 0 rgba(255,255,255,.06);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
  position:relative;overflow:hidden}
.logo-badge::before{content:'';position:absolute;inset:0;border-radius:50%;
  background:radial-gradient(circle at 50% 0%,rgba(255,200,50,.08) 0%,transparent 60%)}
.logo-ring{position:absolute;inset:-3px;border-radius:50%;border:2px dashed rgba(184,115,51,.35);animation:logo-spin 20s linear infinite}
@keyframes logo-spin{to{transform:rotate(360deg)}}
.logo-icons{font-size:clamp(2rem,6vw,2.8rem);line-height:1;letter-spacing:4px;animation:icon-bob 3s ease-in-out infinite}
@keyframes icon-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.logo-txt-inner{font-family:'Rye',cursive;font-size:clamp(.75rem,2.5vw,1rem);color:var(--sun);
  text-shadow:0 0 12px rgba(255,215,0,.5);letter-spacing:3px;text-align:center;line-height:1.3}
.logo-txt-inner span{display:block;font-size:.65em;color:var(--copper-l);letter-spacing:4px}
.logo-glow{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(255,150,0,.06) 0%,transparent 70%);animation:badge-pulse 2.5s ease-in-out infinite}
@keyframes badge-pulse{0%,100%{opacity:.5}50%{opacity:1}}

/* TITLE */
.main-title{font-family:'Rye',cursive;font-size:clamp(1.8rem,7vw,3.5rem);color:var(--sun);
  text-align:center;text-shadow:0 0 30px rgba(255,215,0,.65),3px 3px 0 var(--fire),6px 6px 0 #600;
  letter-spacing:4px;line-height:1.15}
.main-sub{font-size:clamp(.7rem,2.5vw,.9rem);color:var(--copper);letter-spacing:5px;
  text-transform:uppercase;text-align:center;opacity:.75}

/* ENTER BUTTON */
.enter-btn{padding:18px 55px;background:linear-gradient(180deg,#FF9500 0%,#FF4500 45%,#CC2000 100%);
  border:3px solid var(--sun);border-radius:50px;color:var(--cream);font-family:'Rye',cursive;
  font-size:clamp(1.1rem,3.5vw,1.5rem);letter-spacing:5px;cursor:pointer;
  box-shadow:0 0 30px rgba(255,100,0,.4),0 6px 0 #880000,inset 0 1px 0 rgba(255,255,255,.15);
  transition:all .12s;position:relative;overflow:hidden;animation:btn-breathe 2.5s ease-in-out infinite}
.enter-btn::after{content:'';position:absolute;top:0;left:-100%;width:70%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:shim 2.5s infinite}
@keyframes shim{0%{left:-100%}100%{left:150%}}
@keyframes btn-breathe{0%,100%{box-shadow:0 0 30px rgba(255,100,0,.4),0 6px 0 #880000,inset 0 1px 0 rgba(255,255,255,.15)}50%{box-shadow:0 0 55px rgba(255,100,0,.65),0 6px 0 #880000,inset 0 1px 0 rgba(255,255,255,.15)}}
.enter-btn:hover{transform:translateY(-3px);box-shadow:0 0 60px rgba(255,100,0,.7),0 9px 0 #880000,inset 0 1px 0 rgba(255,255,255,.15);animation:none}
.enter-btn:active{transform:translateY(3px);box-shadow:0 0 18px rgba(255,100,0,.3),0 2px 0 #880000}
.tagline{font-size:clamp(.65rem,2vw,.78rem);color:rgba(184,115,51,.5);letter-spacing:3px;
  text-transform:uppercase;text-align:center}

/* ── PAGE 2: ABOUT ── */
#p-about{gap:22px}
.back-btn{position:absolute;top:22px;left:22px;background:none;border:2px solid rgba(184,115,51,.4);
  border-radius:8px;color:rgba(184,115,51,.65);font-family:'Oswald',sans-serif;font-size:.72rem;
  letter-spacing:2px;cursor:pointer;padding:5px 14px;transition:all .2s;text-transform:uppercase}
.back-btn:hover{border-color:var(--copper);color:var(--copper)}

.about-card{background:linear-gradient(180deg,rgba(58,32,10,.97),rgba(28,15,5,.97));
  border:3px solid var(--copper);border-radius:22px;padding:clamp(22px,5vw,38px) clamp(20px,5vw,42px);
  max-width:680px;width:100%;box-shadow:0 0 60px rgba(255,107,26,.2),inset 0 1px 0 rgba(255,255,255,.04);
  position:relative;overflow:hidden}
.about-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,transparent 0%,var(--copper) 30%,var(--sun) 50%,var(--copper) 70%,transparent 100%)}

.about-header{font-family:'Rye',cursive;font-size:clamp(1.3rem,4.5vw,2rem);color:var(--sun);
  text-shadow:0 0 20px rgba(255,215,0,.5),2px 2px 0 var(--fire);text-align:center;margin-bottom:20px;
  padding-bottom:14px;border-bottom:1px solid rgba(184,115,51,.3)}

.about-body{color:var(--cream);font-size:clamp(.82rem,2.5vw,.97rem);line-height:1.95;
  display:flex;flex-direction:column;gap:14px}
.about-body p{color:rgba(255,248,220,.88)}
.about-body .highlight{color:var(--sun);font-weight:700}
.about-body .copper{color:var(--copper-l)}
.fine-print{font-size:.68rem;color:rgba(184,115,51,.45);letter-spacing:1px;
  border-top:1px solid rgba(92,48,16,.35);padding-top:14px;margin-top:6px;line-height:1.7}

/* GAME CARD SECTION */
.game-section{display:flex;flex-direction:column;align-items:center;gap:14px;width:100%;max-width:680px}
.game-section-lbl{font-size:.68rem;color:var(--copper);letter-spacing:5px;text-transform:uppercase;opacity:.75}
.game-preview-wrap{width:100%;cursor:pointer;position:relative;border-radius:18px;overflow:hidden;
  border:3px solid var(--copper);box-shadow:0 0 40px rgba(255,107,26,.25);
  transition:all .2s;transform-origin:center}
.game-preview-wrap:hover{transform:scale(1.025) translateY(-3px);
  box-shadow:0 0 70px rgba(255,107,26,.5),0 12px 30px rgba(0,0,0,.5)}
.game-preview-wrap:hover .play-overlay{opacity:1}
.play-overlay{position:absolute;inset:0;background:rgba(0,0,0,.55);display:flex;
  flex-direction:column;align-items:center;justify-content:center;gap:12px;
  opacity:0;transition:opacity .25s;z-index:5}
.play-btn-big{font-family:'Rye',cursive;font-size:clamp(1.1rem,4vw,1.7rem);
  background:linear-gradient(180deg,#FF9500,#CC2000);border:3px solid var(--sun);
  border-radius:50px;padding:14px 40px;color:var(--cream);letter-spacing:4px;
  box-shadow:0 0 30px rgba(255,215,0,.4)}
.play-sub{color:rgba(255,248,220,.7);font-size:.75rem;letter-spacing:3px;text-transform:uppercase}

/* ── CSS GAME SCREENSHOT ── */
.game-mock{background:linear-gradient(180deg,#1C0F05 0%,#200E00 50%,#1C0F05 100%);
  padding:clamp(10px,3vw,18px);width:100%}
.mock-header{background:linear-gradient(90deg,transparent,rgba(184,115,51,.1),transparent);
  border-bottom:1px solid rgba(184,115,51,.28);padding:7px 16px;
  display:flex;align-items:center;justify-content:space-between;margin-bottom:clamp(8px,2vw,14px)}
.mock-title-txt{font-family:'Rye',cursive;font-size:clamp(.75rem,2.5vw,1rem);color:var(--sun);
  text-shadow:0 0 10px rgba(255,215,0,.4);letter-spacing:2px}
.mock-dots{display:flex;gap:4px}
.mock-dot{width:7px;height:7px;border-radius:50%;background:var(--sun);
  box-shadow:0 0 6px var(--sun),0 0 12px rgba(255,215,0,.4)}
.mock-dot:nth-child(2){animation-delay:.3s}
.mock-dot:nth-child(3){animation-delay:.6s}
.mock-dot:nth-child(4){animation-delay:.9s}
.mock-dot:nth-child(5){animation-delay:1.2s}

.mock-reels-frame{background:radial-gradient(ellipse at 50% 70%,#2d1500,#0d0400);
  border:2px solid #5c3010;border-radius:10px;padding:7px;
  box-shadow:inset 0 0 40px rgba(0,0,0,.85);margin-bottom:clamp(8px,2vw,14px);
  position:relative;overflow:hidden}
.mock-pit{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse at 50% 110%,rgba(255,80,0,.4) 0%,transparent 50%),
    radial-gradient(circle at 15% 90%,rgba(80,45,10,.5) 0%,transparent 4%),
    radial-gradient(circle at 80% 85%,rgba(70,40,8,.45) 0%,transparent 3%)}
.mock-reels{display:flex;gap:5px;position:relative;z-index:2}
.mock-reel{flex:1;border-radius:6px;background:rgba(0,0,0,.28);border:1px solid rgba(92,48,16,.4);
  overflow:hidden;position:relative}
.mock-reel::before,.mock-reel::after{content:'';position:absolute;left:0;right:0;height:22px;z-index:2;pointer-events:none}
.mock-reel::before{top:0;background:linear-gradient(180deg,rgba(0,0,0,.85),transparent)}
.mock-reel::after{bottom:0;background:linear-gradient(0deg,rgba(0,0,0,.85),transparent)}
.mock-sym{display:flex;align-items:center;justify-content:center;
  font-size:clamp(1.2rem,4vw,1.8rem);border-bottom:1px solid rgba(92,48,16,.15)}
.mock-sym.win{background:rgba(255,215,0,.18);animation:mock-glow .6s ease-in-out infinite alternate}
@keyframes mock-glow{from{background:rgba(255,215,0,.1)}to{background:rgba(255,215,0,.3)}}
.mock-center{position:absolute;left:0;right:0;z-index:3;pointer-events:none;
  border-top:1px solid rgba(255,215,0,.2);border-bottom:1px solid rgba(255,215,0,.2);
  background:rgba(255,215,0,.018)}

.mock-win{text-align:center;font-family:'Rye',cursive;font-size:clamp(.85rem,2.5vw,1.1rem);
  color:var(--sun);text-shadow:0 0 12px rgba(255,215,0,.6);margin-bottom:clamp(6px,1.5vw,10px)}

.mock-controls{display:flex;flex-direction:column;gap:8px}
.mock-ctrl-row{display:flex;align-items:center;justify-content:center;gap:8px}
.mock-bet{background:rgba(0,0,0,.55);border:1.5px solid var(--copper);border-radius:7px;
  padding:5px 16px;color:var(--sun);font-size:clamp(.7rem,2vw,.88rem);font-weight:700;letter-spacing:1px}
.mock-btn-sm{width:26px;height:26px;border-radius:6px;background:linear-gradient(135deg,#3A200A,#1C0F05);
  border:1.5px solid var(--copper);color:var(--sun);font-size:.85rem;
  display:flex;align-items:center;justify-content:center}
.mock-spd{display:flex;gap:4px}
.mock-spd-btn{padding:3px 10px;border-radius:12px;font-size:.58rem;letter-spacing:1px;text-transform:uppercase;
  border:1.5px solid rgba(184,115,51,.3);color:rgba(184,115,51,.45)}
.mock-spd-btn.on{background:var(--copper);color:var(--wood-dark);font-weight:700;border-color:var(--copper)}
.mock-spin{width:100%;padding:clamp(8px,2vw,12px);background:linear-gradient(180deg,#FF9500,#FF4500,#CC2000);
  border:2px solid var(--sun);border-radius:30px;color:var(--cream);font-family:'Rye',cursive;
  font-size:clamp(.8rem,2.5vw,1.1rem);letter-spacing:4px;text-align:center;
  box-shadow:0 0 20px rgba(255,100,0,.35),0 4px 0 #880000}

/* top HUD */
.mock-hud{display:flex;justify-content:space-between;align-items:center;
  background:linear-gradient(135deg,rgba(28,15,5,.95),rgba(58,32,10,.95));
  border:1.5px solid var(--copper);border-radius:10px;padding:7px 14px;margin-bottom:8px}
.mock-hud-item{display:flex;flex-direction:column;align-items:center;gap:2px}
.mock-hud-lbl{font-size:.5rem;color:var(--copper);letter-spacing:2px;text-transform:uppercase}
.mock-hud-val{font-size:clamp(.75rem,2vw,.92rem);font-weight:700;color:var(--sun)}
.mock-jp{background:linear-gradient(135deg,rgba(100,0,0,.4),rgba(60,0,0,.4));
  border:1.5px solid rgba(255,70,0,.4);border-radius:8px;padding:4px 12px;
  text-align:center;margin-bottom:8px;animation:jp-glow 2s ease-in-out infinite}
@keyframes jp-glow{0%,100%{box-shadow:0 0 6px rgba(255,70,0,.1)}50%{box-shadow:0 0 18px rgba(255,70,0,.4)}}
.mock-jp-lbl{font-size:.5rem;color:rgba(255,180,100,.65);letter-spacing:3px;text-transform:uppercase}
.mock-jp-val{font-family:'Rye',cursive;font-size:clamp(.75rem,2.5vw,1rem);color:var(--sun)}

/* ── TOAST ── */
#toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
  background:rgba(28,15,5,.97);border:2px solid var(--copper);border-radius:12px;
  padding:12px 28px;color:var(--sun);font-size:.88rem;z-index:600;text-align:center;
  box-shadow:0 0 22px rgba(255,107,26,.28);max-width:90%;display:none}
#toast.show{display:block;animation:toast-in .3s ease}
@keyframes toast-in{from{transform:translateX(-50%) translateY(14px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}

@media(max-width:480px){
  .mock-sym{font-size:1.3rem}
  .enter-btn{padding:15px 38px}
}
        `
      }} />

      <div id="bg"></div>
      <div id="stars"></div>
      <div id="embers"></div>
      <div className="flame-L"></div>
      <div className="flame-R"></div>
      <div className="pig-decor l">🐷</div>
      <div className="pig-decor r">🐷</div>

      {/* PAGE 1: LANDING */}
      <div className="page active" id="p-land">
        <div className="logo-wrap">
          <div className="ccg-logo">
            <div className="logo-badge">
              <div className="logo-ring"></div>
              <div className="logo-glow"></div>
              <div className="logo-icons">🔥🐷🍺</div>
              <div className="logo-txt-inner">
                Company Cookout
                <span>Gaming</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="main-title">Company Cookout<br />Gaming</div>
          <div className="main-sub">Where the fun don't stop when the food runs out</div>
        </div>

        <button className="enter-btn" onClick={enterSite}>🔥 &nbsp;ENTER&nbsp; 🔥</button>
        <div className="tagline">Members Only · You Know Who You Are</div>
      </div>

      {/* PAGE 2: ABOUT + GAME */}
      <div className="page" id="p-about">
        <button className="back-btn" onClick={goBack}>← Back</button>

        {/* ABOUT CARD */}
        <div className="about-card">
          <div className="about-header">🔥 So What Is This, Exactly? 🔥</div>
          <div className="about-body">
            <p>
              <span className="highlight">Company Cookout Gaming</span> is an entertainment platform founded sometime between the second and fourth cold one at a company cookout. Our exact founding date is disputed, but most witnesses agree there was a pig on a spit involved.
            </p>
            <p>
              We make <span className="highlight">exactly one game</span>. It's a slot machine. It does not involve real money, real gambling, or any decisions that would hold up in a court of law. It does involve Beer Money, which is a currency we invented that has no value, cannot be exchanged for anything, and yet somehow everyone wants more of it.
            </p>
            <p>
              Our <span className="copper">company mission</span> is to keep coworkers entertained after the potato salad runs out and before somebody's uncle starts telling stories. We believe in the American dream: that with a little luck, some friendly competition, and access to a generator, you too can have a great time in a field.
            </p>
            <p>
              <span className="highlight">Who is this for?</span> Employees of a certain company. Which company? The one that gave you this link. If you don't know what company that is, you are either very lost or having a much better day than we expected.
            </p>
            <div className="fine-print">
              ⚠️ Company Cookout Gaming accepts no responsibility for hurt feelings, friendly rivalries that escalate, or anyone who takes the jackpot too personally. Beer Money is not redeemable for beer. Nails are not actual nails. The pig is symbolic. Play responsibly, drink water, wear sunscreen. This message brought to you by the HR department, who we assume has not actually read this.
            </div>
          </div>
        </div>

        {/* GAME CARD */}
        <div className="game-section">
          <div className="game-section-lbl">▼ Click to Play ▼</div>
          <div className="game-preview-wrap" onClick={launchGame}>
            {/* PLAY OVERLAY */}
            <div className="play-overlay">
              <div className="play-btn-big">🎰 PLAY NOW 🎰</div>
              <div className="play-sub">Sun N Fun Slots — Pig Pit Edition</div>
            </div>

            {/* CSS GAME SCREENSHOT */}
            <div className="game-mock">
              {/* HUD */}
              <div className="mock-hud">
                <div className="mock-hud-item">
                  <div className="mock-hud-lbl">💰 Beer Money</div>
                  <div className="mock-hud-val">42.50</div>
                </div>
                <div className="mock-hud-item" style={{textAlign: 'center'}}>
                  <div style={{fontFamily: "'Rye', cursive", fontSize: 'clamp(.65rem,2vw,.82rem)', color: 'var(--sun)', letterSpacing: '1px'}}>☀️ Sun N Fun ☀️</div>
                  <div style={{fontSize: '.5rem', color: 'var(--copper)', letterSpacing: '2px'}}>PIG PIT EDITION</div>
                </div>
                <div className="mock-hud-item">
                  <div className="mock-hud-lbl">🔩 Nails</div>
                  <div className="mock-hud-val">137</div>
                </div>
              </div>

              {/* JACKPOT */}
              <div className="mock-jp">
                <div className="mock-jp-lbl">🏆 Progressive Jackpot 🏆</div>
                <div className="mock-jp-val">💰 24.75</div>
              </div>

              {/* REEL FRAME */}
              <div className="mock-reels-frame">
                <div className="mock-pit"></div>
                <div className="mock-reels">
                  {/* Reel 0 */}
                  <div className="mock-reel">
                    <div className="mock-center" style={{top: 'calc(33.3% - 0px)', height: '33.3%'}}></div>
                    <div className="mock-sym" style={{height: '33.3%'}}>🍺</div>
                    <div className="mock-sym win" style={{height: '33.3%'}}>🛻</div>
                    <div className="mock-sym" style={{height: '33.3%'}}>🚬</div>
                  </div>
                  {/* Reel 1 */}
                  <div className="mock-reel">
                    <div className="mock-center" style={{top: 'calc(33.3% - 0px)', height: '33.3%'}}></div>
                    <div className="mock-sym" style={{height: '33.3%'}}>🐕</div>
                    <div className="mock-sym win" style={{height: '33.3%'}}>🛻</div>
                    <div className="mock-sym" style={{height: '33.3%'}}>🌽</div>
                  </div>
                  {/* Reel 2 */}
                  <div className="mock-reel">
                    <div className="mock-center" style={{top: 'calc(33.3% - 0px)', height: '33.3%'}}></div>
                    <div className="mock-sym" style={{height: '33.3%'}}>🏕</div>
                    <div className="mock-sym win" style={{height: '33.3%'}}>🛻</div>
                    <div className="mock-sym" style={{height: '33.3%'}}>🎣</div>
                  </div>
                </div>
              </div>

              {/* WIN LINE */}
              <div className="mock-win">🏆 &nbsp;JACKPOT!&nbsp; 💰 24.75 &nbsp;🏆</div>

              {/* CONTROLS */}
              <div className="mock-controls">
                <div className="mock-ctrl-row">
                  <div className="mock-btn-sm">−</div>
                  <div className="mock-bet">💰 1.00</div>
                  <div className="mock-btn-sm">+</div>
                  <div className="mock-btn-sm" style={{fontSize: '.55rem', width: 'auto', padding: '0 7px'}}>MAX</div>
                </div>
                <div className="mock-ctrl-row">
                  <span style={{fontSize: '.58rem', color: 'var(--copper)', letterSpacing: '2px'}}>SPEED</span>
                  <div className="mock-spd">
                    <div className="mock-spd-btn">Slow</div>
                    <div className="mock-spd-btn on">Normal</div>
                    <div className="mock-spd-btn">Fast</div>
                  </div>
                </div>
                <div className="mock-spin">🎰 &nbsp;SPIN&nbsp; 🎰</div>
              </div>
            </div>
          </div>
          <div style={{fontSize: '.65rem', color: 'rgba(184,115,51,.4)', letterSpacing: '2px', textTransform: 'uppercase'}}>
            Opens Sun N Fun Slots · Company Members Only
          </div>
        </div>
      </div>

      <div id="toast"></div>
    </>
  );
};

export default LandingPage;