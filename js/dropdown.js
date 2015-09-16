(function() {
  this.Dropdown = function(options, list) {
    
    var that = this;

    var defaults = {
      elemId: '',
      animations: 'fade-in-and-out',
      action: 'click',
      direction: 'bottom'
    }

    that.list = list;

    // Create options by extending defaults with the passed in arugments
    if (options && typeof options === 'object') {
      that.options = extendDefaults(defaults, options);
    }

    // Golbal Variables for Dom Nodes
    var $targetButton = document.getElementById(this.options.elemId);
    var $parentNode = $targetButton.parentNode;
    var $dropdownContainer;
        
    var generateWrapper = function() {
      // Generate div.container to wrap button and the list(will built it above)
      var $container = document.createElement('div');
      
      $container.className = 'dropdown-container';
      $container.appendChild($targetButton);
      
      $parentNode.appendChild($container);
      
      $dropdownContainer = $container;
      $parentNode = $targetButton.parentNode;
    }

    var generateList = function() {
      // Reorganize list
      var list = that.list;
      var groups = getGroups(list);
      var listsOrganizeByGroup = organizeByGroup(groups, list);

      // Generate div.list-container to wrap the list above
      var $listContainer = document.createElement('div');
      
      $listContainer.className = 'list-container hide ' + that.options.direction + ' ' + that.options.animations;

      listsOrganizeByGroup.forEach(function(list) {
        
        var sequencedList = sequenceList(list);
        var $groupUl = document.createElement('ul');

        $groupUl.className = 'group ' + list[0].group;
        buildList(sequencedList, $groupUl);
        $listContainer.appendChild($groupUl);

      });

      $parentNode.appendChild($listContainer);
      initializeEvents($listContainer);

    }

    builtOut();

    function builtOut() {
      generateWrapper();
      generateList();
    }

    // ----------------------------------------------
    // Public Methods
    // ----------------------------------------------

    // Swith on or off of list-container
    Dropdown.prototype.switching = function($target) {
      
      if ( hasClass('hide', $target.className) ) {
      
        removeClass('hide', $target);
        addClass('show', $target);

        $targetButton.className += $targetButton.className ? ' btn-focus' : 'btn-focus';
      
      } else {

        addClass('hide', $target);
        removeClass('show', $target);
        
        $targetButton.className = $targetButton.className.replace(/btn-focus/g, '').trim();

      }
    };

    // ----------------------------------------------
    // Private Methods
    // ----------------------------------------------

    function addClass(className, $target) {
        $target.className += ' ' + className;
    }

    function removeClass(className, $target) {
      var classWithSpace = ' ' + className;
      var patt = new RegExp(className + '|' + classWithSpace);
      
      if(patt.test($target.className)) {
        $target.className = $target.className.replace(className, '').trim();
      }

    }

    function hasClass(pattern, className) {
      
      var patt = new RegExp(pattern);

      return patt.test(className);

    }

    function getGroups(list) {
      
      var i = 0;
      var groups = [];

      list.forEach(function(item) {
      
        if (groups.indexOf(item.group) < 0) {
          groups.push(item.group);
        }
      
      });
      
      return groups;
    }

    function organizeByGroup(groups, list) {
      
      var newList = [];
      
      groups.forEach(function(group) {
      
        var listOrganizeByGroup = [];

        list.forEach(function(item) {
      
          if(item.group == group) {
            listOrganizeByGroup.push(item)
          }
      
        });
      
        newList.push(listOrganizeByGroup);
      
      });
      
      return newList;
    }

    function sequenceList(list) {
      return list.sort(compareSeqAsec);
    }

    function compareSeqAsec(a, b) {
    
      if(a.seq > b.seq ) return 1;
      if(a.seq < b.seq ) return -1;
      return 0;
    
    }

    function buildList(list, $groupNode) {
    
      list.forEach(function(item) {
    
        var $li = document.createElement('li');
        var $link = document.createElement('a');
        var $linkText = document.createTextNode(item.title);

        $link.appendChild($linkText);
        $link.title = item.title;
        $link.href = item.url;
        $li.appendChild($link);
        $groupNode.appendChild($li);

      });
    
    }

    function initializeEvents($listContainer) {
      $targetButton.addEventListener(that.options.action, function() {
        that.switching($listContainer);
      });
    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
      for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
          source[property] = properties[property];
        }
      }
      return source;
    }
  };
})();

// ------------------------------------------------
// Global functions for test
// ------------------------------------------------
// function cLog(ob) {
//   console.log(ob);
// }
// function cLine() {
//   console.log('-------');
// }
// function pJson(ob) {
//   console.log(JSON.stringify(ob));
// }