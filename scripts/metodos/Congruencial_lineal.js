class CongruencialLineal {
  getX_i(x0, a, c, m, tam) {
    var x_i = [];
    for (let index = 0; index < tam; index++) {
      x0 = (a * x0 + c) % m;
      x_i.push(x0);
    }
    return x_i;
  }

  getR_i(x_i, m) {
    var r_i = [];
    for (let index = 0; index < x_i.length; index++) {
      r_i[index] = x_i[index] / (m - 1);
    }
    return r_i;
  }

  getN_i(r_i, min, max) {
    var n_i = [];
    for (let index = 0; index < r_i.length; index++) {
      n_i[index] = min + (max - min) * r_i[index];
      n_i[index] = this.round(n_i[index], 5);
    }
    return n_i;
  }

  createMatrix(x_i, r_i, n_i) {
    let result = [];
    for (let i = 0; i < r_i.length; i++) {
      let data = [];
      data.push(i + 1, x_i[i], r_i[i], n_i[i]);
      result.push(data);
    }
    return result;
  }

  round(value, decimals) {
    return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  }
}

generarNumeroSpseudoaleatorios = async (min, max, size) => {
  var cl = new CongruencialLineal();
  var exito_Prueba = false;
  ni = [];
  while (!exito_Prueba) {
    ni = await generarNumerosCongruencialLineal(cl, min, max, size);
    if (pruebaMedia(ni) && pruebaVarianza(ni) && pruebaPoker(ni)) {
      exito_Prueba = true;
    }
  }

  return ni;
};

generarNumerosCongruencialLineal = async (cl, min, max, size) => {
  let x_0 = generateRandom(1, 10);
  //console.log("X_0", x_0);
  let k = generateRandom(1, 10);
  //console.log("K ", k);
  let c = generateRandom(1, 10);
  //console.log("c ",c);
  let g = generateRandom(1, 10);
  //console.log("g ", g);

  let a = 1 + 2 * k;
  let m = Math.pow(2, g);
  let x_i = cl.getX_i(x_0, a, c, m, size);
  let r_i = cl.getR_i(x_i, m);

  let n_i = cl.getN_i(r_i, min, max);
  cl = null;
  return n_i;
};

generateRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

generarRandonNi = async (r_i, min, max) => {
  cl = new CongruencialLineal();
  return cl.getN_i(r_i, min, max);
};

generarTiros = async (min, max) => {
  let tiros = await generarNumeroSpseudoaleatorios(0, 100, 700);

  return tiros;
};
