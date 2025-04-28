const chalk = require('chalk');
const { displayBanner, connectToNetwork, getWalletInfo, closeReadline } = require('./utils');
const {
  executeRandomTransfers,
  depositETHToGateway,
  withdrawETHFromGateway,
  batchWrapETH,
  batchUnwrapWETH,
  sendToSpecificAddress,
  unwrapWETH,
  approveWETH,
  swapWETHtoUSDC,
  swapUSDCtoWETH
} = require('./contracts');

async function showGasPumpMenu(wallet) {
  console.clear();
  const { provider, proxy } = await connectToNetwork();
  await displayBanner(provider);
  await getWalletInfo(wallet, provider, proxy);

  console.log(chalk.white('\n===== GAS PUMP MENU ====='));
  console.log(chalk.white('1. Batch Wrap ETH to WETH'));
  console.log(chalk.white('2. Unwrap WETH to ETH'));
  console.log(chalk.white('3. Approve WETH for DODO'));
  console.log(chalk.white('4. Swap WETH to USDC'));
  console.log(chalk.white('5. Swap USDC to WETH'));
  console.log(chalk.white('6. Send to Specific Address'));
  console.log(chalk.white('7. Back to main menu'));
  console.log(chalk.white('========================'));

  require('./utils').rl.question(chalk.yellow('\nChoose an option (1-7): '), async (answer) => {
    switch (answer) {
      case '1':
        await batchWrapETH(wallet, showGasPumpMenu);
        break;
      case '2':
        await unwrapWETH(wallet, () => showGasPumpMenu(wallet));
        break;
      case '3':
        await approveWETH(wallet, () => showGasPumpMenu(wallet));
        break;
      case '4':
        await swapWETHtoUSDC(wallet, () => showGasPumpMenu(wallet));
        break;
      case '5':
        await swapUSDCtoWETH(wallet, () => showGasPumpMenu(wallet));
        break;
      case '6':
        require('./utils').rl.question(chalk.yellow('Enter recipient address: '), async (toAddress) => {
          require('./utils').rl.question(chalk.yellow('Enter amount of ETH to send: '), async (amountStr) => {
            await sendToSpecificAddress(wallet, parseFloat(amountStr), toAddress);
            await showGasPumpMenu(wallet);
          });
        });
        break;
      case '7':
        console.clear();
        await showMainMenu();
        break;
      default:
        console.log(chalk.red('Invalid option. Please try again. ⚠️'));
        await showGasPumpMenu(wallet);
        break;
    }
  });
}

async function showInariBankMenu(wallet) {
  console.clear();
  const { provider, proxy } = await connectToNetwork();
  await displayBanner(provider);
  await getWalletInfo(wallet, provider, proxy);

  console.log(chalk.white('\n===== INARI BANK MENU ====='));
  console.log(chalk.white('1. Supply ETH to Inari Bank'));
  console.log(chalk.white('2. Withdraw ETH from Inari Bank'));
  console.log(chalk.white('3. Back to main menu'));
  console.log(chalk.white('=========================='));

  require('./utils').rl.question(chalk.yellow('\nChoose an option (1-3): '), async (answer) => {
    switch (answer) {
      case '1':
        await depositETHToGateway(wallet, () => showInariBankMenu(wallet));
        break;
      case '2':
        await withdrawETHFromGateway(wallet, () => showInariBankMenu(wallet));
        break;
      case '3':
        console.clear();
        await showMainMenu();
        break;
      default:
        console.log(chalk.red('Invalid option. Please try again. ⚠️'));
        await showInariBankMenu(wallet);
        break;
    }
  });
}

async function showMainMenu() {
  const { provider, wallet, proxy } = await connectToNetwork();
  await displayBanner(provider);
  await getWalletInfo(wallet, provider, proxy);

  console.log(chalk.white('\n===== MAIN MENU ====='));
  console.log(chalk.white('1. Send to Random Addresses'));
  console.log(chalk.white('2. Gas Pump'));
  console.log(chalk.white('3. Inari Bank'));
  console.log(chalk.white('4. Exit'));
  console.log(chalk.white('More feature will add soon!'));
  console.log(chalk.white('===================='));

  require('./utils').rl.question(chalk.yellow('\nChoose an option (1-4): '), async (answer) => {
    switch (answer) {
      case '1':
        await executeRandomTransfers(wallet, showMainMenu);
        break;
      case '2':
        await showGasPumpMenu(wallet);
        break;
      case '3':
        await showInariBankMenu(wallet);
        break;
      case '4':
        console.log(chalk.white('\n===== EXITING ====='));
        console.log(chalk.white('Thank you for using RISE TESTNET BOT! 👋'));
        console.log(chalk.white('===================='));
        closeReadline();
        process.exit(0);
        break;
      default:
        console.log(chalk.red('Invalid option. Please try again. ⚠️'));
        await showMainMenu(wallet);
        break;
    }
  });
}

module.exports = {
  showMainMenu,
  showGasPumpMenu,
  showInariBankMenu
};
