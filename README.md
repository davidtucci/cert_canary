# Cert Canary

Cert Canary is a browser extension designed to warn if a TLS certificate is near expiration. 

A yellow warning box will appear if a page results in a request served with a certificate due to expire within 30 days. If there are fewer than 15 days until the certificate expires the warning box will be red.

Clicking on the canary icon will show a list of domains the page has requested, color coded based on the time to their certificate expiration.

### Chrome support

Chrome does not currently expose the necessary information regarding TLS connections. There's an outstanding bug filed on the Chromium project, since 2016. https://issues.chromium.org/issues/41264310

### License
Cert Canary is distributed under the GPLv3