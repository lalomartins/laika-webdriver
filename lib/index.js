var webdriver = require('selenium-webdriver');

var builder = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome());

function wrap() {
    for(var i = 0; i < arguments.length; i++) {
        client = arguments[i];
        client._webdriver = builder.build();
        client.find = function(selector) {
            return client._webdriver.findElement(webdriver.By.css(selector));
        };
        orig_close = client.close;
        client.close = function() {
            orig_close.call(client);
            client._webdriver.quit();
        };
        client.eval = function(code) {
            if(this._wd_pageOpened)
                client._webdriver.executeScript(code);
            else
                this.once('wd.pageOpened', function() {
                    client._webdriver.executeScript(code);
                });
            return this;
        };
        client._webdriver.get(client.appUrl)
            .then(function() {
                client._wd_pageOpened = true;
                client.emit('pageOpened');
                client.emit('wd.pageOpened');
            });
    }
}

module.exports = {
    wrap: wrap,
    by: webdriver.By
};
