// Establishing Module Pattern with IIFE's
// (Immediately Invoked function Expressions)

// The Module Pattern allows for access of functions in a IIFE's
// local scope to the Global scope in the form of an object
// Module one


// Budget Controller
var budgetController =  (function() { 

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
        
    };


    Expense.prototype.calcPercentage = function(totalIncome) {
    
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        })
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
         percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // Create New ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
            
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem

        },

        deleteItem: function(type, id) {
            var ids, index;

           ids = data.allItems[type].map(function(current){
                return current.id;
            });

           index = ids.indexOf(id); 

           if(index !== -1) {
                data.allItems[type].splice(index, 1);
           }
        },

        calculateBudget: function() {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }


        },

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentage: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },


        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },



        testing: function() {
            console.log(data);
        }

      
    };




})();



// var UiController
 var UiController = (function() {

    // A quick section for all the dom strings used for DOM manipulation
    // Created for ease of access of class change

    var DOMstrings = {
        inputType: '.add__type',
        descriptionType: '.add__description',
        valueType: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };


    var formatNumber = function(num, type) {
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3 ) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3,3);
        } 

        dec = numSplit[1];


        return  (type === 'exp' ? '- $' : '+ $') + ' ' + int + '.' + dec;

    };

    var  nodeListForEach = function(list, callback) {
        for(var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };


    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
                description: document.querySelector(DOMstrings.descriptionType).value,
                value: parseFloat(document.querySelector(DOMstrings.valueType).value)
            }

        },

        addListItem: function (obj, type) {

            // Create HTML string with placeholder tags
            var html, newHtml, element;


            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
                

            }

            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';

            }

            // Replace the placeholder text with data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        // Go over this section!!!
        clearFields: function() {
            var fields, fieldArr;

            fields = document.querySelectorAll(DOMstrings.descriptionType + ', ' + DOMstrings.valueType);

            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldArr[0].focus();
        },




        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent =  formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent =  formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent =  formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }
        },

        displayPercentages: function(percentage) {
            var fields = document.querySelectorAll(DOMstrings.expPercLabel);


            nodeListForEach(fields, function(current, index) {

                if (percentage[index] > 0) {
                    current.textContent = percentage[index] + '%';
                } else {
                    current.textContent = '---';

                }

            });


        },
    
        displayMonth: function() {
            var now, year, month, months;

            now = new Date();
            months = ['January','February','March','April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;

        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.descriptionType + ',' +
                DOMstrings.valueType);
                
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });
    
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }



 })();


// Global App Controller
 var controller = (function(budgetCtrl, UiCtrl) {

    var setupEventListeners = function() {
        var DOM = UiController.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
    
            if(event.keycode === 13  || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UiCtrl.changedType);
    
    };

    var updateBudget = function() {

            // 1. Calculate The Budget
            budgetCtrl.calculateBudget();

            // 2. Return the budget
            var budget = budgetCtrl.getBudget();
            // 3. Display the budget
            UiCtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        // 1. Calculate the Percentages
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from budget controller
        var percentage = budgetCtrl.getPercentage();
        // 3. Update UI with new percentages
        UiCtrl.displayPercentages(percentage);
    };

    var ctrlAddItem = function() {
        var input, newItem;


            // 1. Get the field input data
            var input = UiCtrl.getInput();


            if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

                // 2. Add the item to the budget controller
                newItem = budgetCtrl.addItem(input.type, input.description, input.value);
                // 3. Add the item to the UI
                UiCtrl.addListItem(newItem, input.type);
    
                // 3.5 Clear the fields
                UiCtrl.clearFields();
    
                // 4. Calculate and update the budget
                updateBudget();
            
                // 5. Calculate and update percentages
                updatePercentages();
            } else {
                window.alert("Please enter a valid Description and Value");
            }

    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;  
        if(itemID) {

            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);


            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UiCtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();

        }
    };

    return {
        init: function() {
            console.log("Applied");
            UiCtrl.displayMonth();
            setupEventListeners();
            UiCtrl.displayBudget({
                budget:  0,
                totalInc:0,
                totalExp: 0,
                percentage: -1 + '%'});
        }
    }




 })(budgetController, UiController); 


 controller.init();