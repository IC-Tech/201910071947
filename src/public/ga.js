function ga(ea, ec) {
  'use strict';
  return self.registration.pushManager.getSubscription().then(function(b) {
    if (b === null) {
      throw new Error('No subscription currently available.');
    }
    var a = {
      v: 1,
      cid: b.endpoint,
      tid: 'UA-149903610-1',
      t: 'event',
      ec: ec,
      ea: ea,
      el: 'SW'
    };
    b = Object.keys(a).filter(function(b) {
      return a[b];
    }).map(function(b) {
      return b + '=' + encodeURIComponent(a[b]);
    }).join('&');
    return fetch('https://www.google-analytics.com/collect', {
      method: 'post',
      body: b
    });
  }).then(function(a) {
    if (!a.ok) {
      return a.text().then(function(b) {
        throw new Error(
          'Bad response from Google Analytics:\n' + a.status
        );
      });
    }
  }).catch(function(a) {
    console.warn('Unable to send the analytics event', a);
  })
}
