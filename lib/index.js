var webdriver = require('selenium-webdriver');

var builder;

// TODO: use Selenium Server if available to speed up tests

function instrumentClient() {
    // if in a version that doesn't call initialize()...
    if(builder === undefined) initialize();

    for(var i = 0; i < arguments.length; i++) {
        var future = new Future();
        client = arguments[i];
        client._webdriver = builder.build();
        client.find = function(selector) {
            // If you're just using webdriver's .click()/etc, you don't actually even
            // need a future, since their promise can take methods. But we do it for
            // consistency, in case you want to do something else with the element.
            future = new Future();
            client._webdriver.findElement(webdriver.By.css(selector))
                .then(function(element) {future.return(element);});
            return future.wait();
        };
        orig_close = client.close;
        client.close = function() {
            orig_close.call(client);
            client._webdriver.quit();
        };
        client.evalSync = function(code) {
            if(this._wd_pageOpened) {
                client._webdriver.executeScript(code);
            } else {
                var future = new Future();
                this.once('wd.pageOpened', function() {
                    client._webdriver.executeScript(code);
                    future.return();
                });
                future.wait();
            }
            return this;
        };
        client._webdriver.get(client.appUrl)
            .then(function() {
                client._wd_pageOpened = true;
                client.emit('pageOpened');
                client.emit('wd.pageOpened');
                future.return();
            });
    future.wait();
    }
}

function initialize(done) {
    // set up server
    builder = new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.chrome());
    done();
}

function shutdown(done) {
    // shut down server
    done();
}

module.exports = {
    wrap: instrumentClient,
    by: webdriver.By,
    laikaHelper: {
        initialize: initialize,
        shutdown: shutdown,
        instrumentClient: instrumentClient
    }
};
