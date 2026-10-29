export const initialPods = [
  {
    id: 'frontend-nginx-7d84f884bf-x4m29',
    node: 'node-pool-prod-us-east-1a',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    age: '2d 6h',
    cpu: '42m',
    memory: '84Mi',
    ip: '10.244.1.48',
    healthStatus: 'Passing (HTTP 200)'
  },
  {
    id: 'frontend-nginx-7d84f884bf-7v9lp',
    node: 'node-pool-prod-us-east-1b',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    age: '2d 6h',
    cpu: '38m',
    memory: '79Mi',
    ip: '10.244.2.112',
    healthStatus: 'Passing (HTTP 200)'
  },
  {
    id: 'frontend-nginx-7d84f884bf-k92z1',
    node: 'node-pool-prod-us-east-1c',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    age: '2d 6h',
    cpu: '45m',
    memory: '88Mi',
    ip: '10.244.3.73',
    healthStatus: 'Passing (HTTP 200)'
  }
];

export const nginxServerStats = {
  serverVersion: 'nginx/1.27.0-alpine',
  uptime: '99.99%',
  activeConnections: 142,
  requestsPerSecond: 648,
  gzipCompressionRatio: '72.4%',
  avgResponseLatency: '4.8ms',
  cacheHitRatio: '94.2%',
  sslCipher: 'TLS_AES_256_GCM_SHA384'
};
