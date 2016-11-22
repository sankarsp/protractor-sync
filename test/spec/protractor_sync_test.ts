/// <reference path='../../node_modules/node-shared-typescript-defs/jasmine/jasmine.d.ts'/>
/// <reference path='../../node_modules/node-shared-typescript-defs/mkdirp/mkdirp.d.ts'/>
import fs = require('fs');

import ab = require('asyncblock');
import mkdirp = require('mkdirp');

import _protractorSync = require('../../app/protractor_sync');

var protractorSync = _protractorSync.protractor_sync;

protractorSync.patch();
protractorSync.disallowMethods();

var TEST_AREA_ID = 'protractor_sync-test-area';
var PNG_HEADER_BASE_64 = 'iVBORw0KGgo';

interface IAppendTestAreaOptions {
  style?: { [name: string]: string; };
  innerHtml?: string;
}

function appendTestArea(options?: IAppendTestAreaOptions) {
  browser.executeScript((id: string, options?: IAppendTestAreaOptions) => {
    var existing = document.querySelector('#' + id);
    if (existing) {
      existing.parentNode.removeChild(existing);
    }

    var testArea = document.createElement('div');
    testArea.setAttribute('id', id);

    if (options && options.innerHtml) {
      testArea.innerHTML = options.innerHtml;
    }

    if (options && options.style) {
      Object.keys(options.style).forEach((item) => {
        (<any>testArea.style)[item] = options.style[item];
      });
    }

    document.body.appendChild(testArea);
  }, TEST_AREA_ID, options);
}

function createTest(fn: Function, errorMsg?: string) {
  return function(done: Function) {
    ab(() => {
      fn();
    }, function(err: any) {
      if (errorMsg) {
        expect(err.message).toEqual(errorMsg);
      } else {
        expect(err || undefined).toBeUndefined();
      }
      done();
    });
  };
}

describe('Protractor extensions', () => {

  describe('disallowed methods', () => {
    // browser/element selectors

    it('should prevent calling browser.$', () => {
        expect(() => {
          (<any>browser).$('body');
        }).toThrowError(
          '$() has been disabled in this project! Use element.findVisible() or element.findElement() instead.'
        );
    });

    it('should prevent calling browser.$$', () => {
        expect(() => {
          (<any>browser).$$('body');
        }).toThrowError(
          '$$() has been disabled in this project! Use element.findVisibles() or element.findElements() instead.'
        );
    });

    it('should prevent calling browser.element', () => {
        expect(() => {
          browser.element(by.model(''));
        }).toThrowError(
          'element() has been disabled in this project! Use element.findVisible() or element.findElement() instead.'
        );
    });

    it('should prevent calling browser.sleep', () => {
      expect(() => { browser.sleep(1); }).toThrowError(
        'sleep() has been disabled in this project! Use browser.waitFor(), element.waitUntil(), element.waitUntilRemove() etc. ' +
        'instead of browser.sleep().'
      );
    });

    it('should prevent calling browser.wait', () => {
      expect(() => { browser.wait(() => { return; }, 1); }).toThrowError(
        'wait() has been disabled in this project! Use browser.waitFor() instead.'
      );
    });

    it('should prevent calling browser.findElement', () => {
      expect(() => { browser.findElement('body'); }).toThrowError(
        'findElement() has been disabled in this project! Use element.findVisible() or element.findElement() instead.'
      );
    });

    it('should prevent calling browser.findElements', () => {
      expect(() => { browser.findElements('body'); }).toThrowError(
        'findElements() has been disabled in this project! Use element.findVisibles() or element.findElements() instead.'
      );
    });

    it('should prevent calling element.all', () => {
        expect(() => {
          (<any>element).all(by.model(''));
        }).toThrowError(
          'all() has been disabled in this project! Use element.findVisibles() or element.findElements() instead.'
        );
    });

    // elPrototype selectors.  These tests need an asyncblock so element.findVisible can call getCurrentFlow.

    it('should prevent calling element.$', (done) => {
      ab(() => {
        var body = element.findVisible('body');

        expect(() => {
          (<any>body).$('a');
        }).toThrowError(
          '$() has been disabled in this project! Use instance.findVisible() or instance.findElement() instead'
        );
      }, done);
    });

    it('should prevent calling element.$$', (done) => {
      ab(() => {
        var body = element.findVisible('body');

        expect(() => {
          (<any>body).$$('a');
        }).toThrowError(
          '$$() has been disabled in this project! Use instance.findVisibles() or instance.findElements() instead.'
        );
      }, done);
    });

    it('should prevent calling element.element', (done) => {
      ab(() => {
        var body = element.findVisible('body');
        expect(() => {
          (<any>body).element(by.model(''));
        }).toThrowError(
          'element() has been disabled in this project! Use instance.findVisible() or instance.findElement() instead'
        );
      }, done);
    });

    it('should prevent calling element.all', (done) => {
      ab(() => {
        var body = element.findVisible('body');
        expect(() => {
          (<any>body).all(by.model(''));
        }).toThrowError(
          'all() has been disabled in this project! Use instance.findVisibles() or instance.findElements() instead.'
        );
      }, done);
    });

    // wait/findElements/sleep

    it('should prevent calling browser.driver.wait', () => {
      expect(() => {
        browser.driver.wait(() => {
          return;
        }, 1);
      }).toThrowError(
        'wait() has been disabled in this project! Use browser.waitFor() instead.'
      );
    });

    it('should prevent calling browser.driver.findElement', () => {
        expect(() => {
          browser.driver.findElement('body');
        }).toThrowError(
          'findElement() has been disabled in this project! Use element.findVisible() or element.findElement() instead.'
        );
    });

    it('should prevent calling browser.driver.findElements', () => {
        expect(() => {
          browser.driver.findElements('body');
        }).toThrowError(
          'findElements() has been disabled in this project! Use element.findVisibles() or element.findElements() instead.'
        );
    });

    it('should prevent calling browser.driver.sleep', () => {
        expect(() => {
          browser.driver.sleep(1);
        }).toThrowError(
          'sleep() has been disabled in this project! Use browser.waitFor(), element.waitUntil(), element.waitUntilRemove() etc. ' +
          'instead of browser.sleep().'
        );
    });

    // locators

    it('should prevent calling by.binding', () => {
        expect(() => {
          by.binding('');
        }).toThrowError(
          'binding() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.buttonText', () => {
        expect(() => {
          by.buttonText('');
        }).toThrowError(
          'buttonText() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.className', () => {
        expect(() => {
          by.className('');
        }).toThrowError(
          'className() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.css', () => {
        expect(() => {
          by.css('');
        }).toThrowError(
          'css() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.id', () => {
        expect(() => {
          by.id('');
        }).toThrowError(
          'id() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.js', () => {
        expect(() => {
          by.js('');
        }).toThrowError(
          'js() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.name', () => {
        expect(() => {
          by.name('');
        }).toThrowError(
          'name() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.partialButtonText', () => {
        expect(() => {
          by.partialButtonText('');
        }).toThrowError(
          'partialButtonText() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.repeater', () => {
        expect(() => {
          by.repeater('');
        }).toThrowError(
          'repeater() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.tagName', () => {
        expect(() => {
          by.tagName('');
        }).toThrowError(
          'tagName() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    it('should prevent calling by.xpath', () => {
        expect(() => {
          by.xpath('');
        }).toThrowError(
          'xpath() has been disabled in this project! Use a css selector or by.model instead.'
        );
    });

    // locators that need a cast

    it('should prevent calling by.cssContainingText', () => {
      // These locator tests don't compile (Property 'cssContainingText' does not exist on type 'IProtractorLocatorStrategy'.)
      expect(() => {
        (<any>by).cssContainingText('');
      }).toThrowError(
        'cssContainingText() has been disabled in this project! Use a css selector or by.model instead.'
      );
    });

    it('should prevent calling by.deepCss', () => {
      expect(() => {
        (<any>by).deepCss('');
      }).toThrowError(
        'deepCss() has been disabled in this project! Use a css selector or by.model instead.'
      );
    });

    it('should prevent calling by.exactBinding', () => {
      expect(() => {
        (<any>by).exactBinding('');
      }).toThrowError(
        'exactBinding() has been disabled in this project! Use a css selector or by.model instead.'
      );
    });

    it('should prevent calling by.exactRepeater', () => {
      expect(() => {
        (<any>by).exactRepeater('');
      }).toThrowError(
        'exactRepeater() has been disabled in this project! Use a css selector or by.model instead.'
      );
    });

    it('should prevent calling by.options', () => {
      expect(() => {
        (<any>by).options('');
      }).toThrowError(
        'options() has been disabled in this project! Use a css selector or by.model instead.'
      );
    });

  });

  describe('jQuery methods', () => {
    var testArea: protractor.ElementFinder;
    var testSpan: protractor.ElementFinder;
    var testInput: protractor.ElementFinder;
    var testMultilineInput: protractor.ElementFinder;

    beforeAll(createTest(() => {
      //Make sure we are starting on a fresh page
      browser.get('data:,');

      appendTestArea({
          style: {
            position: 'absolute',
            left: '15px',
            top: '15px',
            boxSizing: 'context-box'
          },
          innerHtml: '<span ' +
          '  style="height:50px; width:30px; display:block; position: absolute; left:10px; top:10px; border:black solid 2px;" ' +
          '  class="test-span">test span 1</span>' +
          '<span class="test-span-2">test span 2</span>' +
          '<input type="text"/>' +
          '<textarea></textarea>'
        }
      );

      testArea = element.findVisible('#' + TEST_AREA_ID);
      testSpan = element.findVisible('.test-span');
      testInput = element.findVisible('input');
      testMultilineInput = element.findVisible('textarea');
    }));

    it('Finds the closest element matching the selector', createTest(() => {
       expect(testSpan.closest('div').getAttribute('id')).toEqual(TEST_AREA_ID);
    }));

    it('Can determine a class exists on an element', createTest(() => {
      expect(testSpan.hasClass('test-span')).toEqual(true);
    }));

    it('Can determine a class does not exist on an element', createTest(() => {
      expect(testSpan.hasClass('no')).toEqual(false);
    }));

    it('Can determine an element is focused', createTest(() => {
      testInput.click();
      expect(testInput.isFocused()).toEqual(true);
    }));

    it('Can determine an element is not focused', createTest(() => {
      testSpan.click();
      expect(testInput.isFocused()).toEqual(false);
    }));

    it('Can get the innerHeight of an element', createTest(() => {
      expect(testSpan.innerHeight()).toEqual(50);
    }));

    it('Can get the innerWidth of an element', createTest(() => {
      expect(testSpan.innerWidth()).toEqual(30);
    }));

    it('Can use "is" to determine the element is a span', createTest(() => {
      expect(testSpan.is('span')).toEqual(true);
    }));

    it('Can get the outerHeight of an element', createTest(() => {
      expect(testSpan.outerHeight()).toEqual(54);
    }));

    it('Can get the outerWidth of an element', createTest(() => {
      expect(testSpan.outerWidth()).toEqual(34);
    }));

    it('Can get the next element', createTest(() => {
      expect(testSpan.next().hasClass('test-span-2')).toEqual(true);
    }));

    it('Can get an element\'s offset', createTest(() => {
      expect(testSpan.offset()).toEqual({ top: 25, left: 25});
    }));

    it('Can get an element\'s parent', createTest(() => {
      expect(testSpan.parent().getAttribute('id')).toEqual(TEST_AREA_ID);
    }));

    it('Can get an element\'s parents', createTest(() => {
      expect(testSpan.parents().map(parent => parent.getTagName())).toEqual(['div', 'body', 'html']);
    }));

    it('Can get an element\'s position', createTest(() => {
      expect(testSpan.position()).toEqual({ top: 10, left: 10});
    }));

    it('Can get the previous element', createTest(() => {
      expect(testArea.findVisible('.test-span-2').prev().hasClass('test-span')).toEqual(true);
    }));

    it('Can get an element property', createTest(() => {
      expect(testSpan.prop('nodeType')).toEqual(1);
    }));

    it('Can send the ENTER key to an element', createTest(() => {
      testMultilineInput.sendKeys('Hello')
        .sendEnterKey();
      expect(testMultilineInput.getAttribute('value')).toBe('Hello\n');
    }));

    it('Can send the TAB key to an element', createTest(() => {
      testInput.clear(); // focus the input
      testInput.sendTabKey(); // tabbing twice should move focus forward
      expect(testMultilineInput.isFocused()).toEqual(true);
    }));

    it('Can get an element\'s scrollLeft', createTest(() => {
      expect(testSpan.scrollLeft()).toEqual(0);
    }));

    it('Can get an element\'s scrollTop', createTest(() => {
      expect(testSpan.scrollTop()).toEqual(0);
    }));
  });

  describe('Other element finder extensions', () => {
    it('can scroll to an element', createTest(() => {
      //Make sure we are starting on a fresh page
      browser.get('data:,');

      appendTestArea({
        style: { height: '100px', overflow: 'scroll' },
        innerHtml: '<div class="target" style="margin-top: 500px; margin-bottom: 500px;">World</div>'
      });

      var el = element.findElement('#' + TEST_AREA_ID + ' .target');
      expect(el.parent().scrollTop()).toEqual(0);
      el.scrollIntoView();
      expect(el.parent().scrollTop()).toEqual(500);
    }));
  });

  describe('Element finder methods', () => {
    var testArea: protractor.ElementFinder;

    beforeAll(createTest(() => {
      //Make sure we are starting on a fresh page
      browser.get('data:,');

      // add some text in the spans so they will be visible by default
      appendTestArea({
        innerHtml: '<span class="visible-element">Span 1</span>' +
                   '<span class="duplicate-selector">Span 2</span>' +
                   '<span class="duplicate-selector">Span 3</span>' +
                   '<span class="duplicate-selector not-visible" style="display:none">Span 4</span>' +
                   '<span class="invisible not-visible" style="display:none">Span 5</span>'
      });

      testArea = element.findElement('#' + TEST_AREA_ID);
    }));

    describe('findElement', () => {
      it('finds a visible element', createTest(() => {
        testArea.findElement('.visible-element');
      }));

      it('finds an invisible element', createTest(() => {
        testArea.findElement('.invisible');
      }));

      it('throws an error if element was not found', createTest(() => {
        testArea.findElement('.does-not-exist');
      }, 'No instances of (.does-not-exist) were found'));

      it('throws an error if more than one element was found', createTest(() => {
        testArea.findElement('.duplicate-selector');
      }, 'More than one instance of (.duplicate-selector) was found!'));
    });

    describe('findVisible', () => {
      it('finds a visible element', createTest(() => {
        testArea.findVisible('.visible-element');
      }));

      it('throws an error if more than one element was found', createTest(() => {
        testArea.findVisible('.duplicate-selector');
      }, 'More than one visible instance of (.duplicate-selector) was found!'));

      it('throws an error if the element found was not visible', createTest(() => {
        testArea.findVisible('.invisible');
      }, 'No visible instances of (.invisible) were found'));
    });

    describe('findElements', () => {
      it('finds an element', createTest(() => {
        testArea.findElement('.visible-element');
      }));

      it('finds an invisible element', createTest(() => {
        testArea.findElement('.invisible');
      }));

      it('finds more than one element, even if some are invisible', createTest(() => {
        expect(testArea.findElements('.duplicate-selector').length).toBe(3);
      }));

      it('throws an error if no elements were found', createTest(() => {
        testArea.findElements('.not-found');
      }, 'No instances of (.not-found) were found'));
    });

    describe('findVisibles', () => {
      it('finds a visible element', createTest(() => {
        testArea.findVisibles('.visible-element');
      }));

      it('finds more than one visible element', createTest(() => {
        expect(testArea.findVisibles('.duplicate-selector').length).toBe(2);
      }));

      it('throws an error if no visible elements were found', createTest(() => {
        testArea.findVisibles('.invisible');
      }, 'No visible instances of (.invisible) were found'));
    });

  });

  describe('assertElementDoesNotExist', () => {
    var testArea: protractor.ElementFinder;

    beforeAll(createTest(() => {
      //Make sure we are starting on a fresh page
      browser.get('data:,');

      appendTestArea({
        innerHtml: '<span class="element-does-exist"></span>'
      });

      testArea = element.findElement('#' + TEST_AREA_ID);
    }));

    it('throws an error if the element exists', createTest(() => {
      testArea.assertElementDoesNotExist('.element-does-exist');
    }, '.element-does-exist was found when it should not exist!'));

    it('does not throw an error if the element does not exist', createTest(() => {
      testArea.assertElementDoesNotExist('.does-not-exist');
    }));
  });

  describe('stale element prevention', () => {
    function appendStaleTestArea(extraClass = '') {
      appendTestArea({
        innerHtml: '<div class="stale-test ' + extraClass + '">' +
                   '  <div class="inner-stale ' + extraClass + '">' +
                   '    <div class="inner-stale-2 ' + extraClass +  '">test</div>' +
                   '  </div>' +
                   '</div>' +
                   '<div class="stale-test-2 ' + extraClass + '">test</div>'
      });
    }

    beforeAll(createTest(() => {
      browser.get('data:,');

      protractorSync.injectjQuery();
    }));

    beforeEach(() => {
      appendStaleTestArea();
    });

    it('re-selects a stale element', createTest(() => {
      var el = element.findElement('.stale-test');

      browser.executeScript(() => {
        (<any>window).jQuery('.stale-test').remove();
      });

      appendStaleTestArea('second');

      expect(el.hasClass('second')).toEqual(true);
    }));

    it('re-selects a stale element using findElements', createTest(() => {
      var el = element.findElements('.stale-test');

      browser.executeScript(() => {
        (<any>window).jQuery('.stale-test').remove();
      });

      appendStaleTestArea('second');

      expect(el[0].hasClass('second')).toEqual(true);
    }));

    it('re-selects a stale element with a stale parent', createTest(() => {
      var parent = element.findElement('.stale-test');
      var el = parent.findElement('.inner-stale');

      browser.executeScript(() => {
        (<any>window).jQuery('.stale-test').remove();
      });

      appendStaleTestArea('second');

      expect(el.getText()).toEqual('test');
    }));

    it('re-selects a stale element with two stale parents', createTest(() => {
      var parent = element.findElement('.stale-test');
      var inner = parent.findElement('.inner-stale');
      var el = inner.findElement('.inner-stale-2');

      browser.executeScript(() => {
        (<any>window).jQuery('.stale-test').remove();
      });

      appendStaleTestArea('second');

      expect(el.getText()).toEqual('test');
    }));

    it('re-selects a stale element selected using next', createTest(() => {
      var el = element.findElement('.stale-test').next();

      browser.executeScript(() => {
        (<any>window).jQuery('.stale-test-2').remove();
      });

      appendStaleTestArea('second');

      expect(el.hasClass('second')).toEqual(true);
    }));

    it('re-selects a stale element selected using closest', createTest(() => {
      var el = element.findVisible('.inner-stale').closest('.stale-test');

      browser.executeScript(() => {
        (<any>window).jQuery('.stale-test').remove();
      });

      appendStaleTestArea('second');

      expect(el.hasClass('second')).toEqual(true);
    }));

    it('re-selects a stale element selected using parents', createTest(() => {
      var el = element.findVisible('.inner-stale-2').parents()[1];

      browser.executeScript(() => {
        (<any>window).jQuery('.stale-test').remove();
      });

      appendStaleTestArea('second');

      expect(el.hasClass('second')).toEqual(true);
    }));

    it('waits to re-select a stale element', createTest(() => {
      var el = element.findElement('.stale-test');

      browser.executeScript(() => {
        (<any>window).jQuery('.stale-test').remove();

        setTimeout(() => {
          (<any>window).jQuery('#protractor_sync-test-area').append('<div class="stale-test second">test</div>');
        }, 500);
      });

      expect(el.hasClass('second')).toEqual(true);
    }));
  });

  describe('expect', () => {
    it('retries until the expectation passes', createTest(() => {
      var counter = 1;
      var expectation = protractorSync.polledExpect(() => 'test' + counter++);

      spyOn(expectation, 'toEqual').and.callThrough();
      expectation.toEqual('test5');

      expect(expectation.toEqual.calls.count()).toEqual(5);
    }));

    it('is also available as a global variable', createTest(() => {
      var counter = 0;

      polledExpect(() => 'test' + counter++).toEqual('test5');
    }));

    it('works with not', createTest(() => {
      var counter = 0;
      var expectation = protractorSync.polledExpect(() => 'test' + counter++).not;

      spyOn(expectation, 'toEqual').and.callThrough();
      expectation.toEqual('test0');

      expect(expectation.toEqual.calls.count()).toEqual(2);
    }));

    it('works with the toBeGreaterThan matcher', createTest(() => {
      var counter = 1;
      var expectation = protractorSync.polledExpect(() => counter++);

      spyOn(expectation, 'toBeGreaterThan').and.callThrough();
      expectation.toBeGreaterThan(3);

      expect(expectation.toBeGreaterThan.calls.count()).toEqual(4);
    }));

    it('works with multiple expectations', createTest(() => {
      var counter = 1;

      var expectation = protractorSync.polledExpect(() => counter++);
      spyOn(expectation, 'toBeGreaterThan').and.callThrough();
      expectation.toBeGreaterThan(3);
      expect(expectation.toBeGreaterThan.calls.count()).toEqual(4);

      expectation = protractorSync.polledExpect(() => counter++);
      spyOn(expectation, 'toBeGreaterThan').and.callThrough();
      expectation.toBeGreaterThan(7);
      expect(expectation.toBeGreaterThan.calls.count()).toEqual(4);

      expectation = protractorSync.polledExpect(() => counter++);
      spyOn(expectation, 'toBeGreaterThan').and.callThrough();
      expectation.toBeGreaterThan(10);
      expect(expectation.toBeGreaterThan.calls.count()).toEqual(3);
    }));

    it('times out', createTest(() => {
      var counter = 0;
      var catchRan = false;

      //Can't use expect().toThrow() to check this because it doesn't run from the Fiber when patched by jasminewd
      try {
        protractorSync.polledExpect(() => counter++, 100).toBeLessThan(0);
      } catch (e) {
        catchRan = true;
        expect(e.message).toMatch(/Expected \d+ to be less than 0\./);
      }

      expect(catchRan).toEqual(true);
    }));

    it('works in conjunction with element finders', createTest(() => {
      browser.get('data:,');
      protractorSync.injectjQuery();
      appendTestArea();

      var testArea = element.findElement('#' + TEST_AREA_ID);
      var addClass = jasmine.createSpy('addClass').and.callFake(() => {
        browser.executeScript(() => {
          (<any>window).jQuery('#protractor_sync-test-area').addClass('expect-test');
        });
      });

      var classCheck = jasmine.createSpy('classCheck').and.callFake(() => {
        var hasClass = testArea.hasClass('expect-test');
        if (!hasClass) {
          addClass();
        }

        return hasClass;
      });

      protractorSync.polledExpect(classCheck).toEqual(true);

      expect(classCheck.calls.count()).toEqual(2);
      expect(addClass.calls.count()).toEqual(1);
    }));

    it('errors if no matcher is called', createTest(() => {
      try {
        jasmine.clock().install();

        spyOn(console, 'error');
        spyOn(process, 'exit');

        polledExpect(() => 'something');
        jasmine.clock().tick(1);

        expect((<any>console.error).calls.count()).toEqual(1);
        expect((<any>console.error).calls.argsFor(0)[0]).toContain('polledExpect() was called without calling a matcher');
        expect((<any>process.exit).calls.count()).toEqual(1);
        expect((<any>process.exit).calls.argsFor(0)[0]).toEqual(1);
      } finally {
        jasmine.clock().uninstall();
      }
    }));
  });

  describe('Clicking an element', () => {
    it('retries until the element is uncovered', createTest(() => {
      browser.get('data:,');

      appendTestArea({ innerHtml:
        '<button class="covered" onclick="this.innerHTML = \'clicked\'">click</button>' +
        '<div class="cov" style="height:200px; width: 200px; position: absolute; top: 0; left: 0; z-index: 1;"></div>'
      });

      var consoleLog = console.log;
      var count = 0;
      spyOn(console, 'log').and.callFake(function(message: any) {
        if (/was covered, retrying click/.test(message)) {
          count++;

          if (count === 2) {
            browser.executeScript(() => {
              var cover = document.querySelector('div.cov');
              cover.parentNode.removeChild(cover);
            });
          } else if (count > 2) {
            throw new Error('Retried clicking too many times');
          }
        } else {
          throw new Error('Unexpected console.log received: ' + message);
        }

        return consoleLog.apply(this, arguments);
      });

      var button = element.findVisible('button.covered').click();

      expect((<any>console.log).calls.count()).toEqual(2);
      expect(button.getText()).toEqual('clicked');
    }));
  });

  describe('Screenshots', () => {
    it('takes a screenshot', createTest(() => {
      spyOn(fs, 'writeFileSync');
      spyOn(fs, 'existsSync').and.returnValue(true);

      browser.get('data:,');
      protractorSync.takeScreenshot('test');

      expect((<any>fs.writeFileSync).calls.count()).toEqual(1);
      expect((<any>fs.writeFileSync).calls.argsFor(0)[0]).toEqual('test.png');
      expect((<any>fs.writeFileSync).calls.argsFor(0)[1].slice(0, PNG_HEADER_BASE_64.length)).toEqual(PNG_HEADER_BASE_64);
      expect((<any>fs.writeFileSync).calls.argsFor(0)[2]).toEqual('base64');
    }));

    it ('creates the screenshot dir if it doesn\'t exist', createTest(() => {
      spyOn(mkdirp, 'sync');
      spyOn(fs, 'writeFileSync');
      spyOn(fs, 'existsSync').and.returnValue(false);

      browser.get('data:,');
      protractorSync.takeScreenshot('test/path');

      expect((<any>mkdirp.sync).calls.count()).toEqual(1);
      expect((<any>mkdirp.sync).calls.argsFor(0)[0]).toEqual('test');
    }));
  });

  describe('Window size', () => {
    it('resizes the window', createTest(() => {
      browser.get('data:,');
      var viewportSize: any = browser.driver.executeScript(function () {
        return {
          height: window.document.documentElement.clientHeight,
          width: window.document.documentElement.clientWidth
        };
      });

      var flow = ab.getCurrentFlow();
      var windowSize = flow.sync(browser.manage().window().getSize().then(flow.add({firstArgIsError: false})));

      protractorSync.resizeViewport({ width: 400, height: 200 });
      var newSize: any = browser.driver.executeScript(function () {
        return {
          height: window.document.documentElement.clientHeight,
          width: window.document.documentElement.clientWidth
        };
      });

      expect(newSize.width).toEqual(400);
      expect(newSize.height).toEqual(200);

      protractorSync.resizeViewport(viewportSize);
      newSize = browser.driver.executeScript(function () {
        return {
          height: window.document.documentElement.clientHeight,
          width: window.document.documentElement.clientWidth
        };
      });

      expect(newSize.width).toEqual(viewportSize.width);
      expect(newSize.height).toEqual(viewportSize.height);
    }));
  });
});