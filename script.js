// =========================
// MATRIX
// =========================

const canvas =
document.getElementById("matrix");

const ctx =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

const letras =
"01ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const letrasArray =
letras.split("");

const tamanhoFonte = 14;

const colunas =
canvas.width / tamanhoFonte;

const gotas = [];

for(let i = 0; i < colunas; i++){

  gotas[i] = 1;
}

function desenharMatrix(){

  ctx.fillStyle =
  "rgba(0,0,0,0.05)";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle = "#00ff88";

  ctx.font =
  tamanhoFonte + "px monospace";

  for(let i = 0; i < gotas.length; i++){

    const texto =
    letrasArray[
      Math.floor(
        Math.random() *
        letrasArray.length
      )
    ];

    ctx.fillText(
      texto,
      i * tamanhoFonte,
      gotas[i] * tamanhoFonte
    );

    if(
      gotas[i] * tamanhoFonte >
      canvas.height &&
      Math.random() > 0.975
    ){
      gotas[i] = 0;
    }

    gotas[i]++;
  }
}

setInterval(desenharMatrix, 35);

// =========================
// RSA
// =========================

function mdc(a, b){

  while(b != 0){

    let temp = b;

    b = a % b;

    a = temp;
  }

  return a;
}

function encontrarE(phi){

  for(let e = 2; e < phi; e++){

    if(mdc(e, phi) == 1){

      return e;
    }
  }
}

function encontrarD(e, phi){

  for(let d = 1; d < phi; d++){

    if((d * e) % phi == 1){

      return d;
    }
  }
}

function potenciaModular(base, expoente, mod){

  let resultado = 1;

  for(let i = 0; i < expoente; i++){

    resultado =
    (resultado * base) % mod;
  }

  return resultado;
}

// =========================
// BOTÃO
// =========================

document
.getElementById("botao")
.addEventListener(
  "click",
  function(){

    let p =
    Number(
      document.getElementById("p").value
    );

    let q =
    Number(
      document.getElementById("q").value
    );

    let mensagem =
    document.getElementById("mensagem").value;

    if(
      !p ||
      !q ||
      mensagem == ""
    ){

      alert("Preencha tudo");

      return;
    }

    let ascii =
    mensagem.charCodeAt(0);

    let n = p * q;

    let phi =
    (p - 1) * (q - 1);

    let e =
    encontrarE(phi);

    let d =
    encontrarD(e, phi);

    let criptografado =
    potenciaModular(
      ascii,
      e,
      n
    );

    let descriptografado =
    potenciaModular(
      criptografado,
      d,
      n
    );

    let letraFinal =
    String.fromCharCode(
      descriptografado
    );

    document
    .getElementById("resultado")
    .innerHTML = `

      <div class="bloco">

        <div class="titulo">
          PASSO 1 — NÚMEROS PRIMOS
        </div>

        <div class="explicacao">

          O RSA começa escolhendo dois números primos.

          Neste caso:

          <br><br>

          p = ${p}
          <br>
          q = ${q}

        </div>

      </div>

      <div class="bloco">

        <div class="titulo">
          PASSO 2 — CÁLCULO DE n
        </div>

        <div class="formula">
          n = p × q
          <br><br>
          n = ${p} × ${q}
          <br><br>
          n = ${n}
        </div>

        <div class="terminal">

          > Multiplicando primos...<br>
          > Valor de n criado<br>
          > n = ${n}

        </div>

      </div>

      <div class="bloco">

        <div class="titulo">
          PASSO 3 — FUNÇÃO TOTIENTE
        </div>

        <div class="formula">
          φ(n) = (p-1)(q-1)
          <br><br>
          φ(n) = (${p}-1)(${q}-1)
          <br><br>
          φ(n) = ${phi}
        </div>

        <div class="explicacao">

          A função totiente indica quantos números
          são coprimos com n.

        </div>

      </div>

      <div class="bloco">

        <div class="titulo">
          PASSO 4 — CHAVE PÚBLICA
        </div>

        <div class="formula">
          mdc(e, φ(n)) = 1
        </div>

        <div class="terminal">

          > Procurando valor de e...<br>
          > e encontrado = ${e}<br>
          > mdc(${e}, ${phi}) = 1

        </div>

      </div>

      <div class="bloco">

        <div class="titulo">
          PASSO 5 — CHAVE PRIVADA
        </div>

        <div class="formula">
          d × e ≡ 1 mod φ(n)
        </div>

        <div class="terminal">

          > Procurando d...<br>
          > d encontrado = ${d}<br>
          > (${d} × ${e}) mod ${phi} = 1

        </div>

      </div>

      <div class="bloco">

        <div class="titulo">
          PASSO 6 — ASCII
        </div>

        <div class="terminal">

          > Letra digitada: ${mensagem}<br>
          > Código ASCII: ${ascii}

        </div>

      </div>

      <div class="bloco">

        <div class="titulo">
          PASSO 7 — CRIPTOGRAFIA
        </div>

        <div class="formula">
          C = M^e mod n
        </div>

        <div class="terminal">

          > Executando RSA...<br>
          > ${ascii}^${e} mod ${n}<br>
          > Resultado criptografado = ${criptografado}

        </div>

      </div>

      <div class="bloco">

        <div class="titulo">
          PASSO 8 — DESCRIPTOGRAFIA
        </div>

        <div class="formula">
          M = C^d mod n
        </div>

        <div class="terminal">

          > Recuperando mensagem...<br>
          > ${criptografado}^${d} mod ${n}<br>
          > Resultado = ${descriptografado}<br>
          > Letra final = ${letraFinal}

        </div>

      </div>

    `;
  }
);