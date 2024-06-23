import { defineStore } from 'pinia'
import * as cptable from 'codepage'
export const useBluetoothStore = defineStore('bluetooth', {
  state: () => ({
    devices: [],
    isConnected: false,
    printer: null,
    characteristic: null
  }),
  actions: {
    async scanDevices() {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ name: 'SPP-R410' }],
          optionalServices: ['00005500-d102-11e1-9b23-74f07d000000']
        });
        this.devices.push(device);
        console.log('Found device:', device);
      } catch (error) {
        console.error('Failed to scan devices:', error);
      }
    },
    async connectPrinter(device) {
      try {
        console.log('Attempting to connect to device...');
        const server = await device.gatt.connect();
        console.log('Connected to GATT server');
        const service = await server.getPrimaryService('00005500-d102-11e1-9b23-74f07d000000');
        console.log('Primary service obtained');
        this.characteristic = await service.getCharacteristic('00005501-d102-11e1-9b23-74f07d000000');
        console.log('Characteristic obtained');

        this.isConnected = true;
        this.printer = device;
        console.log('Printer connected successfully');
      } catch (error) {
        console.error('Failed to connect to printer:', error);
        alert('Failed to connect to printer: ' + error.message);
      }
    },
    // async print(data) {
    //   if (!this.characteristic) {
    //     console.error('Printer not connected');
    //     return;
    //   }
    
    //   try {
    //     const encodedData = cptable.utils.encode(874, data + '\n');
    //     const escPosCommands = new Uint8Array([
    //       0x1B, 0x40,
    //       0x1B, 0x74, 14,
    //       ...encodedData,
    //       0x0A
    //     ]);

    //     console.log('Starting print process...');
    //     const CHUNK_SIZE = 64
    //     for (let i = 0; i < escPosCommands.length; i += CHUNK_SIZE) {
    //       const chunk = escPosCommands.slice(i, i + CHUNK_SIZE);
    //       await this.characteristic.writeValue(chunk);
    //     }
    //     console.log('Print successful');
    //   } catch (error) {
    //     console.error('Failed to print:', error);
    //     alert('Failed to print: ' + error.message);
    //   }
    // }
    async print(data) {
      if (!this.characteristic) {
        console.error('Printer not connected');
        return;
      }
    
      try {
        const lines = data.split('\n');
        console.log('Total lines to print:', lines.length);
    
        console.log('Starting print process...');
        for (const [index, line] of lines.entries()) {
          if (!this.printer.gatt.connected) {
            throw new Error('Printer disconnected during print');
          }
    
          for (let i = 0; i < line.length; i += 20) {
            const part = line.slice(i, i + 20);
            const encodedPart = cptable.utils.encode(874, part + '\n');
            const partArray = new Uint8Array([
              0x1B, 0x74, 14,  
              ...encodedPart,
              0x0A
            ]);
    
            console.log(`Writing part ${i / 20 + 1} of line ${index + 1}/${lines.length}...`);
            await this.characteristic.writeValueWithoutResponse(partArray);
    
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        console.log('Print successful');
      } catch (error) {
        console.error('Failed to print:', error);
        alert('Failed to print: ' + error.message);
      }
    }    
    
    
  }
});
