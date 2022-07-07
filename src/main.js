const { formatDuration, intervalToDuration } = require('date-fns');
const hre = require('hardhat');

const { handlers } = require('./db');
const { getUserBalances, getTokenContracts } = require('./get-balance');

const BATCH_SIZE = 100;
const MAX_PAGES = 5;
const NETWORK = 'mainnet';

const main = async () => {
    const now = performance.now();
    const START_AT_PAGE = await handlers.getInitialPage(BATCH_SIZE);

    console.log('Running on:', hre.network.name);
    console.log('Starting at page:', START_AT_PAGE);

    const tokenContracts = getTokenContracts(NETWORK);

    const totalUsers = await handlers.getUserCount();
    const totalPages = Math.ceil(totalUsers / BATCH_SIZE);
    const iter = Array.from({ length: totalPages }, (_, i) => i + START_AT_PAGE);

    for await (page of iter) {
        console.log('page:', page);
        const users = await handlers.getUsers(page, BATCH_SIZE);
        const balances = await Promise.all(
            users.map((u) => getUserBalances(u, NETWORK, tokenContracts)),
        );
        await handlers.saveUsers(balances);
        if (page >= MAX_PAGES) {
            break;
        }
    }

    console.log(
        'Total time:',
        formatDuration(
            intervalToDuration({
                start: 0,
                end: Math.round(performance.now() - now),
            }),
        ),
    );
};

main()
    .catch(console.error)
    .finally(() => process.exit());
