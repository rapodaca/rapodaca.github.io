const path = './smival.wasm';

const read_smiles = instance => {
  return smiles => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(`${smiles}\0`);
    const length = encoded.length;
    const pString = instance.exports.alloc(length);
    const view = new Uint8Array(
      instance.exports.memory.buffer, pString, length
    );

    view.set(encoded);

    return instance.exports.read_smiles(pString);
  };
};

const watch = instance => {
  const read = read_smiles(instance);

  document.querySelector('input').addEventListener('input', e => {
    const { target } = e;

    if (read(target.value) === 0) {
      target.classList.remove('invalid');
    } else {
      target.classList.add('invalid');
    }
  });
}

(async () => {
  const response = await fetch(path);
  const bytes = await response.arrayBuffer();
  const wasm = await WebAssembly.instantiate(bytes, { });

  watch(wasm.instance);
})();