
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let localIp = 'localhost';

for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName];
    for (const addr of addresses) {
        if (addr.family === 'IPv4' && !addr.internal) {
            localIp = addr.address;
            // Prefer 192.168.x.x or 10.x.x.x
            if (localIp.startsWith('192.168.') || localIp.startsWith('10.')) {
                break;
            }
        }
    }
}

console.log(localIp);
