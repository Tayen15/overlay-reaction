const os = require('os');

function getLocalIPAddress() {
     const interfaces = os.networkInterfaces();
     for (const interfaceName in interfaces) {
          const addresses = interfaces[interfaceName];
          for (const address of addresses) {
               if (address.family === 'IPv4' && !address.internal) {
                    return address.address;
               }
          }
     }
     return 'localhost';
}

const ip = getLocalIPAddress();
console.log('🌐 Server Information:');
console.log(`📱 Mobile Control URL: http://${ip}:3000/control`);
console.log(`🖥️  OBS Overlay URL: http://${ip}:3000/overlay`);
console.log(`🏠 Local Access: http://localhost:3000`);
console.log('');
console.log('📋 Quick Setup for OBS:');
console.log('1. Add Browser Source');
console.log(`2. URL: http://localhost:3000/overlay`);
console.log('3. Width: 1920, Height: 1080');
console.log('4. Check "Refresh browser when scene becomes active"');
console.log('');
