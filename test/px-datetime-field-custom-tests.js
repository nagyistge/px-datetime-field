// This is the wrapper for custom tests, called upon web components ready state
function runCustomTests() {
  // Place any setup steps like variable declaration and initialization here

  var field = document.getElementById('px_datetime_field');

  // This is the placeholder suite to place custom tests in
  // Use testCase(options) for a more convenient setup of the test cases
  suite('Navigation', function() {

    test('show date and time', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry');

      assert.isFalse(field.hideTime);
      assert.isFalse(field.hideDate);
      assert.notEqual(entries[0].style.display, 'none');
      assert.notEqual(entries[1].style.display, 'none');

      //hide time
      field.hideTime = true;
      flush(function() {
        entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry');
        assert.notEqual(entries[0].style.display, 'none');
        assert.equal(entries[1].style.display, 'none');

        //show time, hide date
        field.hideTime = false;
        field.hideDate = true;
        flush(function() {
          entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry');
          assert.equal(entries[0].style.display, 'none');
          assert.notEqual(entries[1].style.display, 'none');

          //show date and time again
          field.hideDate = false;
          flush(function() {
            entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry');
            assert.notEqual(entries[0].style.display, 'none');
            assert.notEqual(entries[1].style.display, 'none');
            done();
          });
        });
      });
    });

    test('navigation from date to time', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
          dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell');

      var listener = function() {
        entries[0].removeEventListener('px-next-field', listener);
        done();
      };
      entries[0].addEventListener('px-next-field', listener);

      fireKeyboardEvent(dateCells[dateCells.length - 1], 'ArrowRight');
    });

    test('navigation from date to time doesnt trigger next-field from the outside', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
          dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell');

      var listener = function() {
        field.removeEventListener('px-next-field', listener);
        assert.isTrue(false);
        done();
      };
      field.addEventListener('px-next-field', listener);

      fireKeyboardEvent(dateCells[dateCells.length - 1], 'ArrowRight');

      setTimeout(function() {
        field.removeEventListener('px-next-field', listener);
        done();
      }, 200);
    });

    test('navigation from time to date', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
          timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

      var listener = function() {
        entries[1].removeEventListener('px-previous-field', listener);
        done();
      };
      entries[1].addEventListener('px-previous-field', listener);

      fireKeyboardEvent(timeCells[0], 'ArrowLeft');
    });

    test('navigation from time to date doesnt trigger previous-field from the outside', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
          timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

      var listener = function() {
        field.removeEventListener('px-previous-field', listener);
        assert.isTrue(false);
        done();
      };
      field.addEventListener('px-previous-field', listener);

      fireKeyboardEvent(timeCells[0], 'ArrowLeft');

      setTimeout(function() {
        field.removeEventListener('px-previous-field', listener);
        done();
      }, 200);
    });

    test('navigation from time to date doesnt trigger previous-field from the outside', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
          timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

      var listener = function() {
        field.removeEventListener('px-previous-field', listener);
        assert.isTrue(false);
        done();
      };
      field.addEventListener('px-previous-field', listener);

      fireKeyboardEvent(timeCells[0], 'ArrowLeft');

      setTimeout(function() {
        field.removeEventListener('px-previous-field', listener);
        done();
      }, 200);
    });

    test('hide time + right arrow on last date cell', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
          dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
          timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

      field.hideTime = true;
      flush(function() {

        var listener = function() {
          field.removeEventListener('px-next-field', listener);
          field.hideTime = false;
          done();
        };
        field.addEventListener('px-next-field', listener);

        fireKeyboardEvent(dateCells[dateCells.length-1], 'ArrowRight');
      });
    });

    test('hide date + left arrow on first time cell', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
          dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
          timeCells = Polymer.dom(entries[1].root).querySelectorAll('px-datetime-entry-cell');

      field.hideDate = true;
      flush(function() {

        var listener = function() {
          field.removeEventListener('px-previous-field', listener);
          field.hideDate = false;
          done();
        };
        field.addEventListener('px-previous-field', listener);

        fireKeyboardEvent(timeCells[0], 'ArrowLeft');
      });
    });



  });



  suite('submit', function() {

    test('event is not fired when changing invalid value', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
          dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
          i = 0;

      var listener = function(evt) {
        i++;
        //make sure string has been kept in sync
        assert.equal(field.momentObj.toISOString(), field.dateTime);
      };

      field.addEventListener('px-datetime-submitted', listener);

      //invalid month, should not trigger event
      fireKeyboardEvent(dateCells[1], '9');
      fireKeyboardEvent(dateCells[1], '9');

      setTimeout(function() {
        assert.equal(i, 0);
        field.removeEventListener('px-datetime-submitted', listener);
        done();
      }, 100);
    });

    test('event is fired when changing valid value', function(done) {
      var entries = Polymer.dom(field.root).querySelectorAll('px-datetime-entry'),
          dateCells = Polymer.dom(entries[0].root).querySelectorAll('px-datetime-entry-cell'),
          i = 0;

      var listener = function(evt) {
        i++;
        //make sure string has been kept in sync
        assert.equal(field.momentObj.toISOString(), field.dateTime);
      };

      field.addEventListener('px-datetime-submitted', listener);

      //valid month, should trigger event
      fireKeyboardEvent(dateCells[1], '0');
      fireKeyboardEvent(dateCells[1], '2');

      setTimeout(function() {
        assert.equal(i, 1);
        field.removeEventListener('px-datetime-submitted', listener);
        done();
      }, 100);
    });

    test('datetime kept in sync when changing moment', function() {

      field.momentObj = moment.tz(moment("2013-04-07T00:00:00Z"), field.timeZone);
      assert.equal(field.momentObj.toISOString(), field.dateTime);
    });

    test('moment kept in sync when changing datetime', function() {

      field.dateTime = "2009-06-07T00:00:00Z";
      assert.equal(field.momentObj.toISOString(), field.dateTime);
    });
  });

};

function fireKeyboardEvent(elem, key){
  var evt = new CustomEvent('keydown',{detail:{'key':key,'keyIdentifier':key}});
   elem.dispatchEvent(evt);
}
