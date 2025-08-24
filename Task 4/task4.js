const axios = require('axios');

async function getInput() {
    const inputRes = await axios.get('https://share.shub.edu.vn/api/intern-test/input');
    return inputRes.data;
}

async function postOutput(token, result) {
    await axios.post(
        'https://share.shub.edu.vn/api/intern-test/output',
        result,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}

async function main() {
    const { token, data, query } = await getInput();
    const result = processQueries(data, query);
    console.log(result);
    await postOutput(token, result);
function processQueries(data, query) {
    const n = data.length;
    const prefixSum = new Array(n + 1).fill(0);
    const altPrefixSum = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + data[i];
        altPrefixSum[i + 1] = altPrefixSum[i] + (i % 2 === 0 ? data[i] : -data[i]);
    }
    return query.map(q => {
        const [l, r] = q.range;
        if (String(q.type) === "1") {
            return prefixSum[r + 1] - prefixSum[l];
        } else {
            return altPrefixSum[r + 1] - altPrefixSum[l];
        }
    });
}
}

main();
