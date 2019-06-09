var budgetControl = (function() {
  //   some code
  var Expense = function(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
    this.percent = -1;
  };

  Expense.prototype.calcPercent = function(totalInc) {
    if (totalInc > 0) {
      this.percent = Math.round((this.value / totalInc) * 100);
    } else {
      this.percent = -1;
    }
  };

  Expense.prototype.getPer = function() {
    return this.percent;
  };

  var Income = function(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  var calcTotal = function(type) {
    var sum = 0;

    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percent: -1
  };

  return {
    addItem: function(type, desc, val) {
      var newItem, ID;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "inc") {
        newItem = new Income(ID, desc, val);
      } else if (type === "exp") {
        newItem = new Expense(ID, desc, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    delItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calBudget: function() {
      calcTotal("exp");
      calcTotal("inc");
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percent = -1;
      }
    },
    calculatePercent: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercent(data.totals.inc);
      });
    },
    getPercent: function() {
      var allPer = data.allItems.exp.map(function(cur) {
        return cur.getPer();
      });
      return allPer;
    },

    getBudget: function() {
      return {
        totinc: data.totals.inc,
        totexp: data.totals.exp,
        budget: data.budget,
        percent: data.percent
      };
    },
    testing: function() {
      return data;
    }
  };
})();

var uiCOntroller = (function() {
  var DOMStrings = {
    inpType: ".add__type",
    inpDesc: ".add__description",
    inpVal: ".add__value",
    inpbtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budLabel: ".budget__value",
    incLabel: ".budget__income--value",
    expLabel: ".budget__expenses--value",
    expPer: ".budget__expenses--percentage",
    contrainer: ".container",
    item__percentage: ".item__percentage",
    yearDM: ".budget__title--month"
  };
  var formatNum = function(num, type) {
    var sign;
    num = Math.abs(num);
    num = num.toFixed(2).toLocaleString();

    return (type === "exp" ? "-" : "+") + " " + num;
  };

  // code
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inpType).value,
        descp: document.querySelector(DOMStrings.inpDesc).value,
        val: parseFloat(document.querySelector(DOMStrings.inpVal).value)
      };
    },
    addListItems: function(obj, type) {
      var html, newHTML, elements;

      if (type === "inc") {
        elements = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" /></button></div></div></div>';
      } else if (type === "exp") {
        elements = DOMStrings.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" /></button></div></div></div>';
      }

      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.desc);
      newHTML = newHTML.replace("%value%", formatNum(obj.value, type));

      document.querySelector(elements).insertAdjacentHTML("beforeend", newHTML);
    },
    delListItems: function(id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    clearField: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMStrings.inpDesc + "," + DOMStrings.inpVal
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    dispBud: function(onj) {
      document.querySelector(DOMStrings.budLabel).textContent = onj.budget;
      document.querySelector(DOMStrings.incLabel).textContent = onj.totinc;
      document.querySelector(DOMStrings.expLabel).textContent = onj.totexp;

      if (onj.percent > 0) {
        document.querySelector(DOMStrings.expPer).textContent =
          onj.percent + "%";
      } else {
        document.querySelector(DOMStrings.expPer).textContent = "---";
      }
    },
    getDomStrings: function() {
      return DOMStrings;
    },
    displayPer: function(percentage) {
      var field = document.querySelectorAll(DOMStrings.item__percentage);

      var nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(field, function(current, index) {
        if (percentage[index] > 0) {
          current.textContent = percentage[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    displayDate: function() {
      var now, year, month;
      now = new Date();

      document.querySelector(DOMStrings.yearDM).textContent = now.getFullYear();
    }
  };
})();

var controller = (function(budCtrl, uiCtrl) {
  var setuoEventListner = function() {
    var DOMstr = uiCtrl.getDomStrings();

    document.querySelector(DOMstr.inpbtn).addEventListener("click", ctrlItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlItem();
      }
    });

    document
      .querySelector(DOMstr.contrainer)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // some code
    budCtrl.calBudget();
    var bud = budCtrl.getBudget();
    uiCtrl.dispBud(bud);
  };
  var updatePercet = function() {
    budCtrl.calculatePercent();
    var per = budCtrl.getPercent();

    uiCtrl.displayPer(per);
  };
  var ctrlItem = function() {
    var input, newItem;
    input = uiCtrl.getInput();

    if (input.descp !== "" && !isNaN(input.val) && input.val > 0) {
      newItem = budCtrl.addItem(input.type, input.descp, input.val);

      uiCtrl.addListItems(newItem, input.type);

      uiCtrl.clearField();

      updateBudget();
      updatePercet();
    }
  };
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
    }

    budCtrl.delItem(type, ID);

    uiCtrl.delListItems(itemID);

    updateBudget();
  };

  return {
    init: function() {
      console.log("Started");
      uiCtrl.displayDate();
      uiCtrl.dispBud({
        totinc: 0,
        totexp: 0,
        budget: 0,
        percent: 0
      });

      setuoEventListner();
    }
  };
})(budgetControl, uiCOntroller);

controller.init();
