import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { captureNetworkConnectionFrom } from 'more-ember-test-helpers/capture';

module('Unit | capture', function(hooks) {
  setupTest(hooks);

  // BEGIN-SNIPPET capture.captureNetworkConnectionFrom
  test('captureNetworkConnectionFrom - xhr', async function(assert) {
    let requests = await captureNetworkConnectionFrom(async () => {
      await new Promise(resolve => {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            resolve(xhr);
          }
        };

        xhr.open('POST', '/robots.txt?key=value&array[]=value&array[]=value', true);

        xhr.setRequestHeader('X-Custom-1', '1');
        xhr.setRequestHeader('X-Custom-1', '2');

        xhr.setRequestHeader('X-Custom-2', '1');
        xhr.setRequestHeader('X-Custom-2', '2');

        xhr.send({
          'xhr': 'body'
        });
      });
    });

    let robot = requests.post().pathname('/robots.txt').first();
    let request = robot.request.headers.toJSON();
    let response = robot.response.headers.toJSON();

    delete response.date;

    assert.deepEqual(request, {
      'content-type': 'text/plain;charset=UTF-8',
      'x-custom-1': '1, 2',
      'x-custom-2': '1, 2'
    });

    assert.equal(response['content-length'], '51');
    assert.equal(response['x-powered-by'], 'Express');
  });
  // END-SNIPPET

  test('captureNetworkConnectionFrom - fetch', async function(assert) {
    let requests = await captureNetworkConnectionFrom(async () => {
      await fetch(new Request('/robots.txt?key=value&array[]=value&array[]=value', {
        method: 'post',

        headers: {
          'X-Custom-1': '1, 2',
          'X-Custom-2': '1, 2'
        },

        body: {
          'xhr': 'body'
        }
      }));
    });

    let robot = requests.post().pathname('/robots.txt').first();
    let request = robot.request.headers.toJSON();
    let response = robot.response.headers.toJSON();

    delete response.date;

    assert.deepEqual(request, {
      'content-type': 'text/plain;charset=UTF-8',
      'x-custom-1': '1, 2',
      'x-custom-2': '1, 2'
    });

    assert.equal(response['content-length'], '51');
    assert.equal(response['x-powered-by'], 'Express');
  });
});
