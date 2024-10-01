const mqtt = require('mqtt');

const host = 'broker.emqx.io';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: '',
  password: '',
  reconnectPeriod: 1000,
});

client.on('connect', () => {
    console.log('Connected to MQTT Broker');
    }
);

client.on('error', (error) => {
    console.log('Error:', error);
    }
);

client.on('reconnect', () => {
    console.log('Reconnecting to MQTT Broker');
    }
);
module.exports = {
  client,
};