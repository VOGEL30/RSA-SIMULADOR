// Espera o DOM carregar completamente
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. EFEITO BOOT ---
    const bootContainer = document.getElementById("boot-text");
    const linhas = [
        "> INITIALIZING RSA_KERNEL...",
        "> LOADING PRIME_FACTOR_MODULES...",
        "> ESTABLISHING SECURE_CONNECTION...",
        "> ACCESS GRANTED."
    ];

    let l = 0;
    function typeBoot() {
        if (l < linhas.length) {
            bootContainer.innerHTML += linhas[l] + "<br>";
            l++;
            setTimeout(typeBoot, 600);
        } else {
            setTimeout(() => {
                document.getElementById("boot-screen").classList.add("hidden");
                document.getElementById("app").classList.remove("hidden");
            }, 800);
        }
    }
    typeBoot();

    // --- 2. MATRIX CANVAS ---
    const canvas = document.getElementById("matrix");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ff88";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 35);

    // --- 3. MATEMÁTICA RSA ---
    function mdc(a, b) {
        while (b) { a %= b; [a, b] = [b, a]; }
        return a;
    }

    function modInverse(e, phi) {
        for (let d = 1; d < phi; d++) {
            if ((d * e) % phi === 1) return d;
        }
        return 1;
    }

    function expMod(base, exp, mod) {
        let res = 1n;
        let b = BigInt(base);
        let e = BigInt(exp);
        let m = BigInt(mod);
        while (e > 0n) {
            if (e % 2n === 1n) res = (res * b) % m;
            b = (b * b) % m;
            e = e / 2n;
        }
        return Number(res);
    }

    // --- 4. AÇÃO DO BOTÃO ---
    document.getElementById("botao").addEventListener("click", () => {
        const p = parseInt(document.getElementById("p").value);
        const q = parseInt(document.getElementById("q").value);
        const msg = document.getElementById("mensagem").value;

        if (!p || !q || !msg) return alert("Preencha todos os campos!");

        const n = p * q;
        const phi = (p - 1) * (q - 1);
        const e = 3; // Simplificado para o simulador
        const d = modInverse(e, phi);
        const m = msg.charCodeAt(0);

        if (m >= n) return alert(`N (${n}) é muito pequeno para o ASCII de ${msg} (${m}). Use primos maiores.`);

        const c = expMod(m, e, n);
        const mFinal = expMod(c, d, n);

        document.getElementById("resultado").innerHTML = `
            <div class="bloco">
                <h3>PASSO 1: CHAVES</h3>
                <p>N = P * Q = <b>${n}</b></p>
                <p>Phi = (P-1)*(Q-1) = <b>${phi}</b></p>
                <p>Chave Pública (e): <b>${e}</b></p>
                <p>Chave Privada (d): <b>${d}</b></p>
            </div>
            <div class="bloco">
                <h3>PASSO 2: CRIPTOGRAFIA</h3>
                <div class="formula">C = ${m}^${e} mod ${n} = <b>${c}</b></div>
            </div>
            <div class="bloco">
                <h3>PASSO 3: DESCRIPTOGRAFIA</h3>
                <div class="formula">M = ${c}^${d} mod ${n} = <b>${mFinal}</b></div>
                <p>Letra Recuperada: <b>${String.fromCharCode(mFinal)}</b></p>
            </div>
            <div class="bloco">
                <h3>ATAQUE DE FATORAÇÃO</h3>
                <div class="barra"><div class="progresso" id="bar"></div></div>
                <p id="status">> Quebrando chave...</p>
            </div>
        `;

        setTimeout(() => {
            document.getElementById("bar").style.width = "100%";
            document.getElementById("status").innerText = "> Sucesso: N foi fatorado em " + p + " e " + q;
        }, 500);
    });
});