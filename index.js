const { ethers } = require('ethers');
const dotenv = require('dotenv');
dotenv.config();

// 配置提供者（这里使用的是Infura，你也可以选择其他的提供者）
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
);

// 錢包私鑰

const senderPrivateKey = 'your-private-key-here';
const wallet = new ethers.Wallet(senderPrivateKey, provider);

// 批量轉帳的工具
const addresses = ['address1', 'address2', 'address3'];
const amount = ethers.utils.parseEther('0.01');

(async () => {
  let nonce = await wallet.getTransactionCount();

  for (let address of addresses) {
    const tx = {
      to: address,
      value: amount,
      nonce: nonce++,
      gasLimit: ethers.utils.hexlify(21000), //設定 Gas 限制
      gasPrice: ethers.utils.hexlify(await provider.getGasPrice()), // 獲取當前GAS價格
    };

    try {
      // 发送事务
      const transaction = await wallet.sendTransaction(tx);
      console.log(`Transaction hash: ${transaction.hash}`);

      // 等待事务被挖掘
      await transaction.wait();
      console.log(`Transaction to ${address} confirmed.`);
    } catch (error) {
      console.error(`Transaction to ${address} failed: `, error);
    }
  }
})();
