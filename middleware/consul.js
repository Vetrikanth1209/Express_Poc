const Consul = require('consul');

const consul = new Consul({
    host: "52.90.146.225", // Hardcoded Consul host
    port: 8500,            // Hardcoded Consul port
    promisify: true,
    secure: false,
    timeout: 200000
});

const CONSUL_SERVICE_ID = "Express_Poc";
const CONSUL_SERVICE_NAME = "Express_Poc";
let SERVICE_HOST = "127.0.0.1"; // Fallback value for service host
const SERVICE_PORT = 6000;

// Dynamically retrieve the host from Consul agent API

    // Register the service in Consul
    consul.agent.service.register({
        id: CONSUL_SERVICE_ID,
        name: CONSUL_SERVICE_NAME,
        address: SERVICE_HOST,
        port: SERVICE_PORT,
    }, (err) => {
        if (err) {
            console.error('Error registering service:', err);
            throw err;
        }
        console.log('User Service successfully registered with Consul');
    });

    
// Gracefully deregister service when shutting down
process.on('SIGINT', async () => {
    try {
        await consul.agent.service.deregister(CONSUL_SERVICE_ID);
        console.log('User Service deregistered from Consul');
        process.exit();
    } catch (err) {
        console.error('Error deregistering service:', err);
        process.exit(1);
    }
});

module.exports = consul;
