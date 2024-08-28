# Aztec Wallet Wheez(i)

<img src="https://github.com/hpmaxi/awwi/blob/98780ef7ac4fcb1e50a85bab0de04cacd14ecea2/assets/wheezi.webp" alt="aztec wallet wheez(i) logo" width="30%">

```bash
VERSION=0.48.0 aztec-up
aztec start --sandbox
```

Then:

```bash
cd awwi
yarn
yarn dev
```

## Known problems

- Adding wagmi dependency conflicts with nodePolyfills, and requires a clean install (removing `node_modules`) to make it work again.
- Using rivet, if the wallet is connected, never finishes of doing `setupSandbox`
- -32601 `method not found` on creating/deploying accounts. As above, if rivet is connected, the rpc messages are sent to anvil instead to pxe. This doesn't happen with rivet!
