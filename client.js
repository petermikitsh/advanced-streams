// IE needs these two polyfills
import 'core-js/fn/promise';
import 'whatwg-fetch';

import csvtojson from 'csvtojson';
import FileReadStream from 'filestream/read';

class MassCreateQueue {
  constructor() {
    // Data to upload
    this.data = [];
    // Max number of records per service call
    this.maxData = 1000;
    // Total number of bytes for all data objects
    this.payloadSize = 0;
    // Max service payload size (10 MiB)
    this.maxPayloadSize = 10 * Math.pow(2, 20);
  }

  isFull() {
    return (
      (this.data.length === this.maxData) ||
      (this.payloadSize >= this.maxPayloadSize)
    );
  }

  reset() {
    this.data = [];
    this.payloadSize = 0;
  }

  async drain() {
    const url = `http://${window.location.hostname}:8081/`;
    const payload = `{"records":[${this.data.join(',')}]}`;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    });
    const msg = `<div>Sent ${this.data.length} records</div>`;
    document.body.insertAdjacentHTML('beforeend', msg);
    this.reset();
  }

  async addData(obj, length) {
    if (this.isFull()) {
      await this.drain();
    }
    this.data.push(obj);
    this.payloadSize += length;
  }
}

const onChange = async () => {
  const queue = new MassCreateQueue();
  const file = input.files[0];
  /* There's two major JS stream implementations: 
   * - WHATWG stream (for web)
   * - NodeJS stream v2 (there's also v1 and v3).
   *
   * All of the open source stream tooling, e.g.,
   * csvtojson, is made for Node streams. :(
   *
   * Fortunately, filereader-stream converts WHATWG
   * streams to Node V2 streams :)
   */
  const nodeStream = new FileReadStream(file);
  const csvtojsonOpts = {
    flatKeys: true,
    colParser: {
        "randomInt": "number"
    },
  };
  const onData = async (data) => {
    const dataString = JSON.stringify(data);
    await queue.addData(dataString, dataString.length);
  };
  const onError = async (err) => {
    console.error(err.message);
  };
  const onDone = () => {
    queue.drain();
  }
  const transform = csvtojson(csvtojsonOpts);
  transform.subscribe(onData);
  transform.on('error', onError);
  transform.on('done', onDone);
  nodeStream.pipe(transform);
}

// Page setup
const input = document.createElement('input');
input.setAttribute('type', 'file');
document.body.appendChild(input);
input.addEventListener('change', onChange);
