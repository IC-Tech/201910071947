function ga(ea, ec) {
  'use strict';
  return self.registration.pushManager.getSubscription().then(b => {
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
    }
    b = Object.keys(a).filter(b => a[b]).map(b => b + '=' + encodeURIComponent(a[b])).join('&')
    return fetch('https://www.google-analytics.com/collect', {method: 'post', body: b})
  }).then(a => !a.ok ? a.text().then(b => {
    throw new Error('Bad response from Google Analytics:\n' + a.status)
  }) : 0).catch(a => console.warn('Unable to send the analytics event', a))
}
