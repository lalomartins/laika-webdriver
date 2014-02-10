Prototype/test-case for Laika's upcoming plug-in architecture; allows you to
write tests usign Selenium WebDriver instead of PhantomJS.

Why would you do that?

To be honest, I don't recommend it. Phantom is awesome. However, as a browser,
it's a couple of years out of date. For LimeMakers tests, it turns out we need
WebGL; so Phantom doesn't quite cut it. If you're in a similar situation, you
may try this out.

Fair warning, though; Laika's plugin architecture is still being designed, and
as a consequence, this will probably become incompatible, and in turn, its own
API is likely to change a lot in the next few weeks. If you don't have time to
deal with that, just wait a month or so for 1.0.
