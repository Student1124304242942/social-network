const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'react-social-network',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

